FROM python:3.9-slim

WORKDIR /app

# Install system dependencies including build essentials
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    make \
    libopenblas-dev \
    liblapack-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first for Docker layer caching
COPY requirements-prod.txt .

# Install Python dependencies WITH cache (remove --no-cache-dir)
RUN pip install --upgrade pip && \
    pip install -r requirements-prod.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Use python -m to run uvicorn
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]