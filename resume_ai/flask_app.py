import os
import sys
from flask import Flask, request, jsonify
from flask_cors import CORS

# Add parent dir to path so imports work
sys.path.insert(0, os.path.dirname(__file__))

from scorer import rank_jobs_for_student

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "service": "Flask Resume Recommendation Engine"})

@app.route('/recommend-jobs', methods=['POST'])
def recommend_jobs():
    data = request.json
    if not data:
        return jsonify({"error": "No JSON payload provided"}), 400

    resume_text = data.get('resume_text')
    jobs = data.get('jobs')
    profile_completeness = data.get('profile_completeness', 100)

    if not resume_text:
        return jsonify({"error": "resume_text is required"}), 400
    if not jobs or not isinstance(jobs, list):
        return jsonify({"error": "jobs array is required"}), 400

    try:
        rankings = rank_jobs_for_student(
            resume_text=resume_text,
            jobs=jobs,
            profile_completeness=profile_completeness,
            top_n=len(jobs)
        )
        return jsonify({"rankings": rankings, "total": len(rankings)})
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    port = int(os.environ.get("FLASK_PORT", 8001))
    app.run(host='0.0.0.0', port=port, debug=False)
