# CioOkul server image for DataKey: the Python app, data in PostgreSQL (DATABASE_URL).
FROM python:3.12-slim

# HOST/PORT: DataKey reaches the app on 0.0.0.0:$PORT (3000), HTTPS ends at the proxy in front.
# TZ: weekly summaries and review dates follow the school's calendar day.
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1 \
    HOST=0.0.0.0 \
    PORT=3000 \
    CIO_NO_BROWSER=1 \
    TRUST_PROXY=1 \
    COOKIE_SECURE=1 \
    TZ=Europe/Istanbul

RUN apt-get update \
    && apt-get install -y --no-install-recommends tzdata \
    && rm -rf /var/lib/apt/lists/* \
    && useradd --create-home --uid 10001 cio

WORKDIR /app
COPY requirements.txt ./
RUN pip install -r requirements.txt
COPY . .

USER cio
EXPOSE 3000
CMD ["python", "app.py"]
