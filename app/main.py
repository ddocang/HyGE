from flask import Flask, request, jsonify
from flask_cors import CORS
import datetime

app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:3000",  # 개발용
    "https://www.hyge.store",  # 실제 서비스 도메인
    "https://hyge-xi.vercel.app",  # Vercel 기본 URL
    "https://hyge-4ol5b179e-ddocangs-projects.vercel.app"  # 임시 Vercel 도메인
])

LOG_FILE = "sensor_log.txt"

@app.route('/save', methods=['POST'])
def save_data():
    data = request.json
    if not data:
        return jsonify({"error": "No data received"}), 400

    timestamp = datetime.datetime.now().isoformat()
    with open(LOG_FILE, "a", encoding="utf-8") as f:
        f.write(f"{timestamp} - {str(data)}\n")

    return jsonify({"message": "Data saved"}), 200


@app.route('/data', methods=['GET'])
def get_recent_data():
    now = datetime.datetime.now()
    one_hour_ago = now - datetime.timedelta(hours=1)

    result = []
    try:
        with open(LOG_FILE, "r", encoding="utf-8") as f:
            for line in f:
                try:
                    timestamp_str, payload = line.strip().split(" - ", 1)
                    timestamp = datetime.datetime.fromisoformat(timestamp_str)
                    if timestamp >= one_hour_ago:
                        result.append({
                            "time": timestamp_str,
                            "data": eval(payload)  # ⚠️ 실제 운영 시 eval은 위험 → json.loads로 바꾸는 게 안전
                        })
                except Exception:
                    continue
    except FileNotFoundError:
        pass

    return jsonify(result), 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
