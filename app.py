from flask import Flask, request, jsonify
from flask_cors import CORS

import pandas as pd
import math
import json

app = Flask(__name__)

CORS(app)


@app.route("/")
def home():

    return "Backend Running"


@app.route(
    "/generate-seating",
    methods=["POST"]
)
def generate_seating():

    # GET FILE

    uploaded_file = request.files["file"]

    # GET HALLS

    halls = json.loads(
        request.form["halls"]
    )

    # READ CSV

    df = pd.read_csv(uploaded_file)

    students = df.to_dict(
        orient="records"
    )

    # TOTAL STUDENTS

    total_students = len(students)

    # HALL LOGIC

    capacity_per_hall = 36

    required_halls = math.ceil(
        total_students / capacity_per_hall
    )

    # VALIDATION

    if len(halls) < required_halls:

        return jsonify({

            "error":
            f"Please select at least {required_halls} halls"

        }), 400

    # ONLY USE REQUIRED HALLS

    used_halls = halls[:required_halls]

    hall_data = []

    current_index = 0

    # CREATE HALL DATA

    for hall in used_halls:

        students_in_hall = min(

            capacity_per_hall,

            total_students - current_index
        )

        student_list = students[

            current_index:

            current_index + students_in_hall
        ]

        hall_data.append({

            "hallName": hall,

            "students": student_list

        })

        current_index += students_in_hall

    # SEND RESPONSE

    return jsonify({

        "total_students":
        total_students,

        "hallData":
        hall_data

    })


if __name__ == "__main__":

    app.run(
        debug=True
    )