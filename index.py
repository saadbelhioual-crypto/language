from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# قاعدة بيانات التمارين - دقيقة ومنظمة
FRENCH_EXERCISES = [
    {
        "id": 1,
        "category": "Pronoms Personnels",
        "question": "Tu و __ (Aime) la pizza. (Choose: nous/vous)",
        "options": ["nous", "vous"],
        "answer": "vous",
        "explanation": "عندما نعطف شخصاً على 'Tu'، نستخدم الضمير 'vous'."
    },
    {
        "id": 2,
        "category": "Pronoms Relatifs",
        "question": "C'est l'homme __ travaille ici. (qui / que)",
        "options": ["qui", "que"],
        "answer": "qui",
        "explanation": "نستخدم 'qui' عندما يحل الضمير محل الفاعل (Sujet)."
    }
]

@app.route("/api/exercises", methods=["GET"])
def get_exercises():
    return jsonify(FRENCH_EXERCISES)

@app.route("/api/check", methods=["POST"])
def check_answer():
    data = request.json
    q_id = data.get("id")
    user_val = data.get("answer", "").strip().lower()
    
    exercise = next((e for e in FRENCH_EXERCISES if e["id"] == q_id), None)
    if exercise and user_val == exercise["answer"].lower():
        return jsonify({"status": "success", "msg": "إجابة دقيقة! أحسنت."})
    return jsonify({"status": "error", "msg": "للأسف، الإجابة غير صحيحة.", "hint": exercise["explanation"]})

if __name__ == "__main__":
    app.run()