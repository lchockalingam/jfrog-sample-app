"""
Python microservice companion for JFrog trial.
Demonstrates PyPI package resolution through JFrog Artifactory.
"""
import os
from datetime import datetime
from flask import Flask, jsonify, request
from pydantic import BaseModel
import requests

app = Flask(__name__)


class HealthResponse(BaseModel):
    status: str
    timestamp: str
    service: str = "python-service"


@app.route("/health")
def health():
    resp = HealthResponse(status="ok", timestamp=datetime.utcnow().isoformat())
    return jsonify(resp.model_dump())


@app.route("/api/packages")
def list_packages():
    """Returns the packages used — useful for Xray vulnerability scanning demo."""
    packages = [
        {"name": "requests", "version": "2.31.0", "ecosystem": "pypi"},
        {"name": "flask", "version": "3.0.0", "ecosystem": "pypi"},
        {"name": "click", "version": "8.1.7", "ecosystem": "pypi"},
        {"name": "pydantic", "version": "2.5.0", "ecosystem": "pypi"},
    ]
    return jsonify({"packages": packages, "count": len(packages)})


@app.route("/api/proxy", methods=["GET"])
def proxy_demo():
    """Demonstrates outbound calls — useful for network policy testing."""
    url = request.args.get("url", "https://httpbin.org/get")
    try:
        resp = requests.get(url, timeout=5)
        return jsonify({"status": resp.status_code, "ok": resp.ok})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
