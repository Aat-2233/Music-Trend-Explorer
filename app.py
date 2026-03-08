from flask import Flask, render_template, request
import pandas as pd
import numpy as np
import pickle


import ast

app = Flask(__name__)

# Load dataset - only needed columns to save memory
df = pd.read_csv("data/artists.csv", usecols=["name", "followers", "popularity", "genres"])

# REMOVE MISSING VALUES
df = df.dropna(subset=["followers", "popularity"])

# Downcast to reduce memory
df["followers"] = pd.to_numeric(df["followers"], downcast="integer")
df["popularity"] = pd.to_numeric(df["popularity"], downcast="integer")

# Create log feature
df["log_followers"] = np.log1p(df["followers"])
genres_df = df.copy()

# Load trained model
model = pickle.load(open("model.pkl", "rb"))

# Features and target
X = df[["log_followers"]]
y = df["popularity"]

# Model score
r2_score = model.score(X, y)

# ---------------- HOME PAGE ---------------- #

@app.route("/")
def home():
    return render_template("index.html")


# ---------------- ARTIST SEARCH ---------------- #

@app.route("/artist", methods=["GET", "POST"])
def artist_search():

    artists = None
    error = None

    if request.method == "POST":

        artist_name = request.form.get("artist_name", "").strip().lower()

        results = df[df["name"].str.lower().str.contains(artist_name, na=False)]

        if not results.empty:
            artists = results.sort_values(by="followers", ascending=False).head(10)
        else:
            error = "No matching artists found."

    return render_template("artist.html", artists=artists, error=error)


# ---------------- PREDICTION ---------------- #

@app.route("/predict", methods=["GET", "POST"])
def predict():

    prediction = None
    followers = None

    if request.method == "POST":

        followers = float(request.form["followers"])
        pred = model.predict([[np.log1p(followers)]])
        prediction = round(pred[0], 2)

    return render_template(
        "predict.html",
        prediction=prediction,
        followers=followers,
        r2=r2_score
    )


# ---------------- HELPER: Parse Genres ---------------- #

def parse_genres(raw):
    """Convert genres field to a clean list regardless of storage format."""
    if pd.isna(raw) or raw == "":
        return []
    raw = str(raw).strip()
    # Format: "['hip hop', 'rap']"
    if raw.startswith("["):
        try:
            return ast.literal_eval(raw)
        except Exception:
            pass
    # Format: "hip hop, rap, west coast rap"
    return [g.strip() for g in raw.split(",") if g.strip()]


# ---------------- ARTIST DETAIL ---------------- #

@app.route("/artist/<artist_name>")
def artist_detail(artist_name):

    # ✅ FIX: lowercase the URL param to match the lowercased column
    artist_name = artist_name.lower()

    results = df[df["name"].str.lower().str.contains(artist_name, na=False)]

    if results.empty:
        return "Artist not found", 404

    artist = results.iloc[0]

    artist_data = {
        "name": artist["name"],
        "followers": int(artist["followers"]),
        "popularity": artist["popularity"],
        "genres": parse_genres(artist["genres"])
    }

    return render_template("artist_detail.html", artist=artist_data)


if __name__ == "__main__":
    app.run(debug=True)