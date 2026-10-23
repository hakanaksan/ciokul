# CioOkul · Yerel çalışma masası

Bu uygulama aynı Windows bilgisayarında veli ve öğrenci tarafından kullanılır. İnternet bağlantısı gerektirmez. Sunucu yalnızca `127.0.0.1:8765` adresini dinler.

## Başlatma

`Baslat.bat` dosyasına çift tıklayın. Tarayıcıda `http://127.0.0.1:8765` açılır. İlk açılışta öğrenci adını, veli şifresini ve öğrenci PIN'ini siz oluşturursunuz. Bu bilgileri unutmayacağınız şekilde saklayın.

Veli girişiyle **Yeni çalışma** seçin; ders ve fasikülden sonra 15 soruluk testi belirleyin. Örneğin 87 soruluk fasikül 6 test olarak görünür; son testte 12 soru bulunur. Çalışmaya kendi adınızı verebilir, sonra ana sayfadan adını değiştirebilirsiniz. Görseli önizleyerek otomatik kesimi kontrol edebilirsiniz. Öğrenci soruları ekranda yanıtlayıp çalışmayı teslim eder; sonra ana sayfaya döner. Veli teslim edilen çalışmada cevap anahtarı bulunan soruların önceden seçilmiş doğru/yanlış durumunu kontrol eder. Anahtarı olmayan yazılı soruları değerlendirir ve **Tümünü kaydet** ile hepsini birlikte kaydeder. Veli bir çalışmayı sildiğinde o çalışmanın öğrenci yanıtları ve değerlendirmeleri de silinir; fasikül ve soru görselleri kalır.

## Okuma Becerileri

Veli ana sayfadaki **Okuma çalışması ata** düğmesiyle 10 metinden birini seçer, çalışmayı adlandırır ve isterse hedef tarih koyar. Metin ve ona bağlı bütün sorular birlikte atanır. Öğrenci önce metnin sayfalarını okur, sonra soruları çözer; sorulardan metne geri dönebilir. Şıklı sorularda tek cevap, çoklu seçimlilerde birden fazla cevap işaretler; yazılı, tablo ve şema sorularını metin alanına yazar. Tamamlayınca ana sayfaya döner.

Veli, öğrencinin yanıtını soru görseli ve resmi cevap ölçütüyle birlikte görür. 34 tek şıklı ve 13 çoklu seçimli soruda doğru/yanlış puanı önceden seçilir; veli bunu değiştirebilir. Diğer 71 soru elle puanlanır. Resmi anahtarda iki puanlık ölçütü bulunan sorularda 0, 1 veya 2 puan seçilebilir. **Tümünü kaydet** bütün soruları tek işlemde değerlendirir. Tüm puanlar kaydedildikten sonra öğrenci sonuçlarını görür. Veli çalışmayı silerse yanıtlar ve puanlar da silinir.

Öğrenci yazılı, tablo ve şema sorularında cevabını metin olarak yazabilir; ayrıca soru görseline kısa not veya ✓ işareti koyabilir. Bu işaretler yanıtla birlikte saklanır ve veli değerlendirme ekranında aynı konumlarda görünür. Veli, puanlama sırasında **Metinden kanıt**, **Açıklamayı genişlet**, **Görseli yeniden incele** ve **Güçlü yön** hazır notlarından yararlanabilir.

Veli panelindeki **Görselleri denetle**, 118 soru ve resmi cevap görselini yan yana gösterir. Her görsel ayrı onaylanabilir, sorun notu eklenebilir ve PDF sayfasından kesimi düzeltilebilir. Öğrenci işareti bulunan soru görselinin kesimi kilitlenir; resmi cevap kesimi düzenlenebilir. Soru başına otomatik belirlenen beceri etiketi de burada değiştirilebilir. **Okuma ilerlemesi** bölümü geçmiş çalışmaları ve beceri bazında puanları gösterir; en düşük puanlı beceriyi tekrar için önerir.

## Sesli okuma

On okuma metninin tamamı, bilgisayarın kendi içinde çalışan Piper sesiyle (tr-TR dfki) önceden seslendirilmiştir; internet gerekmez. Öğrenci metin ekranındaki **Metni dinle** çubuğundan, soru çözerken kenardaki küçük oynatıcıdan dinleyebilir; hız 0.8x/1x/1.25x seçilir ve bu tarayıcıda saklanır. Ses dosyaları `reading_audio/R01.wav` biçimindedir (toplam ~124 MB) ve yedeğe dahil değildir; `extract_reading_passages.py` ve `generate_reading_audio.py` ile yeniden üretilebilir. Piper programı ve ses modeli `tools/piper/` içindedir.

## Haftalık takip ve sakin çalışma

Öğrenci, fasikül ve okuma sorularında **Bu sorudan emin değilim** işaretini kullanabilir. Veli değerlendirme sırasında zorlanma nedenini seçer: konu, soruyu okuma, dikkat, yöntem veya diğer. Bu seçimler puanla birlikte kaydedilir ve haftalık özette görünür.

Veli ana sayfasındaki **Bu haftanın özeti**, atanan ve teslim edilen çalışmaları, kontrol edilen soruları, bekleyen kontrolleri ve emin olunmayan soruları toplar. Yanlış veya kısmen doğru değerlendirilen sorular için 2 gün sonrasına tekrar önerisi eklenir. Başarılı tekrarların ardından sonraki öneriler 7 ve 21 gün sonrasına planlanır. Veli **Seçilenleri ata** ile hazır sorulardan kısa tekrar çalışması oluşturur. Okuma tekrarlarında yalnızca seçilen sorular açılır. Atanmış bir tekrar, değerlendirilene kadar yeniden atama listesine girmez.

Öğrenci çalışma ekranındaki **Sakin çalışma modu** soruyu büyütür ve gezinme alanını sadeleştirir. **Tam ekran** seçeneği tarayıcı penceresini büyütür. Sakin modda 20 dakikada bir isteğe bağlı kısa mola hatırlatması görünür; süre sınırı veya otomatik teslim yoktur. Sakin mod tercihi bu tarayıcıda saklanır.

## Yeni ekran düzeni

Veli paneli **Özet**, **Çalışmalar**, **İlerleme** ve **İçerik ve araçlar** sekmelerine ayrılmıştır. Özet ekranı bekleyen kontrolleri ve tekrarları öne çıkarır. İlerleme sekmesinde son sekiz haftanın atanan/teslim edilen çalışma grafiği ve ders/ünite sonuçları bulunur; beşten az değerlendirilmiş sorusu olan ünitede başarı yüzdesi gösterilmez. Öğrenci ana sayfasında sıradaki çalışma büyük bir kartta açılır, tamamlananlar ayrı bir bölümde toplanır.

Soru görselindeki **Görseli büyüt** bağlantısı, resmi uygulama içinde açar; yakınlaştırma ve kaydırma yapılabilir. Okuma sorusunda **Metni yan yana göster** metni soru yanında açar. Önceki/sonraki düğmeleri ekranın altına yakın tutulur. Üstteki **Görünüm** menüsünde yazı/ekran boyutu ve yüksek kontrast seçilir; tercih bu tarayıcıda saklanır.

Kaynak PDF'ler ve [kaynak bilgisi](4_sinif_okuma_becerileri/KAYNAK.md) `4_sinif_okuma_becerileri/` klasöründedir. Metin, soru ve yalnızca veliye açılan cevap görselleri `reading_images/` klasöründedir. `import_reading.py` görselleri ve `etkinlikler.json` içeriğini yeniden üretir; ilk aktarım için `pdfplumber`, `pypdfium2` ve Pillow gerekir. Soruların otomatik tür ve konum eşlemesi yapıldığı için öğrenciye vermeden önce görselleri gözden geçirmek faydalıdır.

## İçerik ve veri

- Soru bankasında altı dersin 39 fasikülü ve 3.467 soru bulunur. İlk 12 soru daha önce elle doğrulanmıştır. Diğer görseller PDF numaralarından otomatik kesilmiştir; 36 ortak metin, tablo veya grafik grubu için 89 soru görseli düzeltilmiş, önceki soruya taşan 36 kesim temizlenmiştir.
- Her sorunun görseli `question_images/DKAB_U01_S001.png` biçimindeki fiziksel dosyalarda bulunur. Görsele tıklayarak büyütebilirsiniz.
- PDF'ler `4_sinif_fasikulleri/` içindedir. İçe aktarma `import_fasikuller.py`, anahtar düzeltme `reconcile_answer_keys.py` ile tekrarlanabilir. Aktarım özeti `data/ice_aktarma_raporu.json` içindedir.
- Kullanıcılar, atamalar, yanıtlar ve değerlendirmeler `data/cio_okul.sqlite3` içinde saklanır. Yedek almak için uygulamayı kapatıp bu dosyayı başka bir yere kopyalayın.
- Veli panelindeki **Yedek indir**, veritabanını, fasikül soru görsellerini ve okuma görsellerini tek ZIP dosyasına koyar. **Yedeği geri yükle** sonrası uygulamayı kapatıp yeniden açın; mevcut çalışmalar yedekteki durumla değiştirilir.
- PDF, öğrenci ekranından açılamaz; fasiküldeki cevap anahtarı yalnızca veli ekranından erişilebilir.

## Yeni çalışma araçları

- Veli, fasikül listesindeki soruyu önizleyebilir, **Sorun işaretle** ile not bırakabilir ve **Kesimi düzelt** ile PDF sayfasında yeni görsel alanını seçebilir. Kaydedilen kesim soru görselinin yerine geçer ve doğrulandı olarak işaretlenir.
- Çalışma oluştururken hedef tarih seçilebilir; mevcut çalışmaların hedef tarihi ana sayfadan değiştirilebilir.
- İlerleme paneli ders, ünite ve ay bazında kaydedilmiş değerlendirmeleri gösterir. **Yanlışları tekrar çalışması**, her sorunun son değerlendirmesine göre en fazla 15 soru seçerek yeni çalışma oluşturur.
- Öğrenci soru numaralarıyla hızla gezinebilir, çalışmadan çıkınca kaldığı sorudan devam eder. Teslim özeti yanıtlanmamış soruları gösterir.
- Veli tüm soruların değerlendirmesini kaydedince öğrenci doğru/yanlış sonucunu, doğru şıkkı ve veli notunu görür.
- Yanlış oranı yüksek ünitelerden önerilen tekrar çalışmaları oluşturulabilir; veli önerilen soruları kaldırıp çalışmanın adını düzenleyebilir.
- Veli panelinde hedef tarihli çalışmalar aylık takvimde gösterilir. Fasikül seçerken her testin tahmini ayı öğretmenin ilerleyişine göre değiştirilebilir.
- Son yedekten 14 gün geçince veli paneli yeni yedek hatırlatması gösterir.

## Soru denetimi

`audit_questions.py`, 3.467 sorunun PNG dosyasını açar; boyut, boş görsel, PDF sayfası, soru numarası ve okunabilen cevap anahtarı uyumunu denetler. Sonuçlar `data/soru_denetimi.csv` ve `data/soru_denetimi_ozet.json` dosyalarına yazılır. Veli panelinden CSV indirilebilir. `shared_question_context.py --apply`, ortak metin veya grafikle çözülen soruları düzeltir. Düzeltme öncesi ilgili görseller `data/original_question_images/` içine saklanır. Otomatik denetim, her sorunun tek tek insan gözüyle onaylandığı anlamına gelmez; şüpheli görselleri veli panelinde işaretleyebilirsiniz.

## Tahmini çalışma ayları

Veli ana sayfasında ders başına yaklaşan bir test ve tüm fasiküllerin önerilen ayları gösterilir. Fasikül seçerken her 15 soruluk testin tahmini ayı ayrıca görünür. Bu tarihler bir ödev zorunluluğu değildir; öğretmenin konu işleyişi önceliklidir.

Öneri, [MEB 2026–2027 çalışma takvimindeki](https://meb.gov.tr/2026-2027-egitim-ogretim-yili-takvimi-aciklandi/haber/41057/tr) ders ve tatil haftalarıyla, [4. sınıf fasiküllerinin](https://odsgm.meb.gov.tr/www/4-sinif-calisma-fasikulleri/icerik/615) ünite sırasını eşleştirir. MEB'in [2026–2027 çerçeve plan sayfasına](https://tymm.meb.gov.tr/taslak-cerceve-planlari/temel-egitim) göre 4. sınıfta hâlihazırdaki program sürmektedir. Ünite süreleri [matematik](https://mufredat.meb.gov.tr/Dosyalar/201813017165445-MATEMAT%C4%B0K%20%C3%96%C4%9ERET%C4%B0M%20PROGRAMI%202018v.pdf), [fen bilimleri](https://mufredat.meb.gov.tr/Dosyalar/201812312311937-FEN%20B%C4%B0L%C4%B0MLER%C4%B0%20%C3%96%C4%9ERET%C4%B0M%20PROGRAMI2018.pdf) ve [sosyal bilgiler](https://mufredat.meb.gov.tr/Dosyalar/201812103847686-SOSYAL%20B%C4%B0LG%C4%B0LER%20%C3%96%C4%9ERET%C4%B0M%20PROGRAMI%20.pdf) öğretim programlarından, din kültüründe [MEB DKAB 4 yıllık planından](https://dogm.meb.gov.tr/Programlar/CerceveYillikPlan/DKAB/2026-2027dkab4.xlsx) alınmıştır. Türkçe tema ve İngilizce üniteleri yıl içine yaklaşık eşit dağıtılmıştır. Her ünitenin yaklaşık bitişinden başlayarak haftada iki kısa test önerilir; kesin gün yerine yalnızca ay gösterilir.

## Teknik yapı

Uygulama Python standart kütüphanesiyle çalışan yerel HTTP sunucusu, SQLite veritabanı ve bağımsız HTML/CSS/JavaScript arayüzü kullanır. PDF içe aktarma için `pypdfium2` ve Pillow gerekir. `Baslat.bat`, bu bilgisayardaki Codex çalışma ortamının Python 3.10+ yorumlayıcısını kullanır.

## Sunucuda çalıştırma (DataKey)

Aynı uygulama DataKey üzerinde de çalışır: `main` dalına yapılan her push, `.github/workflows/datakey.yml` ile `Dockerfile`'dan imaj derler ve yayına alır. Ortam değişkeni verilmezse uygulama bu bilgisayardaki gibi SQLite ve yerel klasörlerle çalışır.

DataKey panelinde (Ayarlar) tanımlanan değişkenler:

- `DATABASE_URL`: PostgreSQL adresi. Tanımlıysa veriler PostgreSQL'de tutulur (`schema_postgres.sql`).
- `DOSYA_URL`, `DOSYA_TOKEN`: DataKey dosya deposu. Tanımlıysa görseller, sesler, PDF'ler ve denetim raporları depodan okunur, kesim düzeltmeleri depoya yazılır.
- `DOSYA_ANAHTARI`: Depo herkese açık olduğu için yalnızca velinin görmesi gereken dosyalar (okuma cevap görselleri, cevap anahtarı sayfaları bulunan PDF'ler, denetim raporları) AES-256-GCM ile şifrelenerek `gizli/` altına yüklenir. Anahtar `.env.datakey` dosyasındadır; bu dosya depoya ve imaja girmez.
- `SETUP_TOKEN`: Sunucuda ilk kurulum ekranı bu anahtar olmadan çalışmaz.

`HOST`, `PORT`, `TRUST_PROXY`, `COOKIE_SECURE` ve `TZ` imajda ayarlıdır. Oturumlar veritabanında tutulur; hatalı girişler adres ve rol başına sınırlanır.

Araçlar:

- `migrate_sqlite_to_pg.py`: `data/cio_okul.sqlite3` verisini `DATABASE_URL` veritabanına taşır (`--replace` ile üzerine yazar).
- `upload_files.py`: Yerel içerik dosyalarını depoya yükler; aynı boyuttaki dosyaları atlar (`--force` hepsini yükler, `--new-key` yeni anahtar üretir).
- Sunucudaki **Yedek indir** tüm tabloları JSON olarak verir; **Yedeği geri yükle** hem bu yedekleri hem de bu bilgisayarda alınmış eski yedekleri kabul eder (görseller hariç).
