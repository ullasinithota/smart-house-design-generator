
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


def generate_room(name, x, y, w, d, kind, furniture):
    return {
        "name": name,
        "x": round(x, 2),
        "y": round(y, 2),
        "w": round(w, 2),
        "d": round(d, 2),
        "kind": kind,
        "area": round(w * d, 2),
        "furniture": furniture
    }


def generate_layout(width, length, bedrooms):
    margin = 1.0

    inner_w = width - 2 * margin
    inner_l = length - 2 * margin

    # Divide the plot into three main zones.
    living_d = inner_l * 0.30
    bedroom_zone_d = inner_l * 0.42
    service_d = inner_l - living_d - bedroom_zone_d

    rooms = []

    # 1. Living room
    rooms.append(
        generate_room(
            "Living Room",
            margin,
            margin,
            inner_w,
            living_d,
            "living",
            ["Sofa", "TV Unit", "Coffee Table"]
        )
    )

    # 2. Bedroom arrangement
    cols = 2 if bedrooms > 1 else 1
    rows = (bedrooms + cols - 1) // cols

    cell_w = inner_w / cols
    cell_d = bedroom_zone_d / rows

    for i in range(bedrooms):
        col = i % cols
        row = i // cols

        rooms.append(
            generate_room(
                f"Bedroom {i + 1}",
                margin + col * cell_w,
                margin + living_d + row * cell_d,
                cell_w,
                cell_d,
                "bedroom",
                ["Bed", "Wardrobe", "Side Table"]
            )
        )

    # 3. Kitchen and bathroom
    service_y = margin + living_d + bedroom_zone_d
    kitchen_w = inner_w * 0.60

    rooms.append(
        generate_room(
            "Kitchen",
            margin,
            service_y,
            kitchen_w,
            service_d,
            "kitchen",
            ["Kitchen Counter", "Sink", "Storage"]
        )
    )

    rooms.append(
        generate_room(
            "Bathroom",
            margin + kitchen_w,
            service_y,
            inner_w - kitchen_w,
            service_d,
            "bathroom",
            ["Wash Basin", "Shower", "Toilet"]
        )
    )

    return rooms


@app.route("/api/generate", methods=["POST"])
def generate():
    data = request.get_json(silent=True) or {}

    try:
        width = float(data.get("width", 30))
        length = float(data.get("length", 40))
        bedrooms = int(data.get("bedrooms", 2))
        floors = int(data.get("floors", 1))

    except (ValueError, TypeError):
        return jsonify({
            "error": "Please enter valid numeric values."
        }), 400

    # Validate plot measurements.
    if not (15 <= width <= 100):
        return jsonify({
            "error": "Plot width must be between 15 and 100 feet."
        }), 400

    if not (15 <= length <= 150):
        return jsonify({
            "error": "Plot length must be between 15 and 150 feet."
        }), 400

    if not (1 <= bedrooms <= 4):
        return jsonify({
            "error": "Choose between 1 and 4 bedrooms."
        }), 400

    if not (1 <= floors <= 3):
        return jsonify({
            "error": "Choose between 1 and 3 floors."
        }), 400

    # Generate the room layout.
    rooms = generate_layout(width, length, bedrooms)

    margin = 1.0

    # Main entrance door.
    doors = [
        {
            "x": round(width / 2, 2),
            "y": margin,
            "wall": "front",
            "type": "main entrance"
        }
    ]

    # Approximate exterior window positions.
    windows = [
        {
            "x": round(width * 0.25, 2),
            "y": margin,
            "wall": "front"
        },
        {
            "x": round(width * 0.75, 2),
            "y": margin,
            "wall": "front"
        },
        {
            "x": margin,
            "y": round(length / 2, 2),
            "wall": "left"
        },
        {
            "x": round(width - margin, 2),
            "y": round(length / 2, 2),
            "wall": "right"
        }
    ]

    return jsonify({
        "plot": {
            "width": width,
            "length": length,
            "area": round(width * length, 2),
            "unit": "ft"
        },

        "bedrooms": bedrooms,
        "floors": floors,

        "rooms": rooms,
        "doors": doors,
        "windows": windows,

        "total_rooms": len(rooms),

        "note": (
            "Conceptual house layout with suggested furniture. "
            "Room arrangements, openings and dimensions require "
            "architectural review."
        )
    })


if __name__ == "__main__":
    app.run(debug=True, port=5000)
