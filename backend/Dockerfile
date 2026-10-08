# --- Build Stage ---
FROM python:3.12-slim AS builder

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libmariadb-dev \
    pkg-config \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --prefix=/install -r requirements.txt

# --- Final Production Stage ---
FROM python:3.12-slim

WORKDIR /app

# Install runtime system libraries (MariaDB client libs)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libmariadb3 \
    && rm -rf /var/lib/apt/lists/*

# Copy installed python dependencies from build stage
COPY --from=builder /install /usr/local

# Copy application source code
COPY . .

# Expose backend API port
EXPOSE 8000

# Run as non-root user for security best practices
RUN useradd -m appuser && chown -R appuser:appuser /app
USER appuser

# Start application using uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
