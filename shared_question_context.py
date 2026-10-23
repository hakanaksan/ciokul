"""Find and optionally prepend shared PDF prompts to grouped question PNGs."""

from __future__ import annotations

import argparse
import json
import re
import shutil
import sqlite3
import tempfile
from pathlib import Path

import pypdfium2 as pdfium
from PIL import Image

from import_fasikuller import BASE, key_page, scan


GROUP = re.compile(
    r"(?i)(?<!\d)(\d{1,3}(?:\s*,\s*\d{1,3})*(?:\s*ve\s*\d{1,3}|\s*[-–]\s*\d{1,3}))\.\s*soru\w*"
)
ENGLISH_GROUP = re.compile(
    r"(?i)questions?\s+(\d{1,3}(?:\s*,\s*\d{1,3})+)"
)
ORIGINALS = BASE / "data" / "original_question_images"
IMAGES = BASE / "question_images"


def groups_for_booklet(document, locations):
    by_page = {}
    for number, page, top in locations:
        by_page.setdefault(page, []).append((number, top))
    groups = []
    for page_index in range(5, key_page(document)):
        page = document[page_index]
        textpage = page.get_textpage()
        content = textpage.get_text_range()
        page_height = page.get_size()[1]
        for match in list(GROUP.finditer(content))+list(ENGLISH_GROUP.finditer(content)):
            numbers = [int(value) for value in re.findall(r"\d{1,3}", match.group(1))]
            if len(numbers) < 2:
                continue
            if numbers[-1] - numbers[0] == len(numbers) - 1:
                included = numbers
            elif len(numbers) == 2 and numbers[1] > numbers[0] and numbers[1]-numbers[0] <= 10:
                included = list(range(numbers[0], numbers[1]+1))
            else:
                continue
            _, _, _, y1 = textpage.get_charbox(match.start(1))
            heading_top = page_height - y1
            first = next(((n,top) for n,top in by_page.get(page_index,[])
                          if n == included[0] and top > heading_top), None)
            if not first or first[1] - heading_top < 30:
                continue
            groups.append({
                "page": page_index + 1, "numbers": included,
                "heading_top": round(heading_top,2),
                "question_top": round(first[1],2),
                "label": match.group(0),
            })
    return groups


def context_image(document, group, end_top=None):
    page = document[group["page"]-1]
    scale = 1.7
    width, _ = page.get_size()
    source = page.render(scale=scale).to_pil().convert("RGB")
    return source.crop((
        round(34*scale),round(max(25,group["heading_top"]-9)*scale),
        round(min(width-33,562)*scale),round(((end_top or group["question_top"])-7)*scale)
    ))


def save_combined(filename, question, context=None):
    if context is not None:
        combined = Image.new("RGB",(max(context.width,question.width),
                                    context.height+question.height+14),"white")
        combined.paste(context,(0,0))
        combined.paste(question,(0,context.height+14))
    else:
        combined = question
    target = IMAGES / filename
    with tempfile.NamedTemporaryFile(dir=IMAGES,suffix=".png",delete=False) as stream:
        temporary = Path(stream.name)
    try:
        combined.save(temporary,format="PNG",optimize=True)
        temporary.replace(target)
    finally:
        temporary.unlink(missing_ok=True)
    return combined.size


def prepend_context(document, group, filename, end_top=None):
    original = ORIGINALS / filename
    if not original.is_file():
        ORIGINALS.mkdir(exist_ok=True)
        shutil.copy2(IMAGES / filename, original)
    with Image.open(original) as image:
        question = image.convert("RGB")
    return save_combined(filename,question,context_image(document,group,end_top))


def trim_previous(document, group, location, question, own_group):
    number,page_index,top=location
    if page_index not in (group["page"]-1,group["page"]-2):
        return None
    page=document[page_index]
    width,height=page.get_size()
    if page_index==group["page"]-1:
        end=group["heading_top"]-7
    else:
        end=min(795,height-38)
    if end-top<20:
        return None
    scale=1.7
    source=page.render(scale=scale).to_pil().convert("RGB")
    base=source.crop((round(34*scale),round(max(25,top-9)*scale),
                      round(min(width-33,562)*scale),round(end*scale)))
    if page_index==group["page"]-2 and group["heading_top"]>80:
        next_page=document[group["page"]-1]
        next_width,_=next_page.get_size()
        next_source=next_page.render(scale=scale).to_pil().convert("RGB")
        continuation=next_source.crop((
            round(34*scale),round(35*scale),
            round(min(next_width-33,562)*scale),
            round((group["heading_top"]-7)*scale)))
        joined=Image.new("RGB",(max(base.width,continuation.width),
                                base.height+continuation.height+12),"white")
        joined.paste(base,(0,0));joined.paste(continuation,(0,base.height+12))
        base=joined
    filename=question["image_path"]
    original=ORIGINALS/filename
    if not original.is_file():
        ORIGINALS.mkdir(exist_ok=True)
        shutil.copy2(IMAGES/filename,original)
    context=context_image(document,own_group) if own_group else None
    return save_combined(filename,base,context)


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--apply",action="store_true")
    arguments=parser.parse_args()
    db=sqlite3.connect(BASE/"data"/"cio_okul.sqlite3")
    db.row_factory=sqlite3.Row
    report=[]
    for booklet in db.execute("SELECT * FROM booklets ORDER BY id").fetchall():
        doc=pdfium.PdfDocument(str(BASE/booklet["pdf_path"]))
        locations,_=scan(doc,key_page(doc))
        questions={row["number"]:row for row in db.execute(
            "SELECT id,number,image_path,page FROM questions WHERE booklet_id=?",(booklet["id"],))}
        groups=groups_for_booklet(doc,locations)
        own_groups={number:group for group in groups for number in group["numbers"]}
        location_by_number={location[0]:location for location in locations}
        for group in groups:
            group.update({"booklet_id":booklet["id"],"course":booklet["course"],
                          "booklet":booklet["title"]})
            group["images"]=[]
            for number in group["numbers"]:
                question=questions.get(number)
                if not question:
                    continue
                size=None
                if arguments.apply:
                    end_top=(location_by_number[number][2] if
                        booklet["pdf_path"].replace("\\","/").endswith("Ingilizce/unite_09.pdf")
                        and group["numbers"]==[83,84] and number==84 else None)
                    size=prepend_context(doc,group,question["image_path"],end_top)
                group["images"].append({"question_id":question["id"],
                                        "filename":question["image_path"],"size":size})
            report.append(group)
        if arguments.apply:
            for group in groups:
                previous_number=group["numbers"][0]-1
                previous=questions.get(previous_number)
                location=location_by_number.get(previous_number)
                if previous and location:
                    size=trim_previous(doc,group,location,previous,own_groups.get(previous_number))
                    if size:
                        group["trimmed_previous"]={"question_id":previous["id"],
                                                   "filename":previous["image_path"],"size":size}
        doc.close()
    output=BASE/"data"/"ortak_baglam_raporu.json"
    output.write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding="utf-8")
    print(f"{len(report)} ortak bağlam, {sum(len(x['images']) for x in report)} soru"
          f"{' düzeltildi' if arguments.apply else ' aday'}")
    db.close()


if __name__=="__main__":
    main()
