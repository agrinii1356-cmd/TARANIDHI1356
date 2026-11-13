#!/bin/bash
cd "$(dirname "$0")/../backend"
python3 -m venv venv 2>/dev/null || true
source venv/bin/activate
pip install -r requirements.txt -q
echo "Starting PanchangPro API on http://localhost:8000"
echo "Docs: http://localhost:8000/docs"
uvicorn main:app --reload --host 0.0.0.0 --port 8000
