import matplotlib
matplotlib.use("Agg")
from flask import Flask, render_template, request
from sklearn.linear_model import LinearRegression







from flask import Flask, render_template
import pandas as pd
import matplotlib.pyplot as plt

app = Flask(__name__)


# Load dataset
df = pd.read_csv("data/artists.csv")

# Remove rows with missing critical values
df = df.dropna(subset=['followers', 'name'])
# Convert genres from string to list
df['genres'] = df['genres'].apply(
    lambda x: x.strip("[]").replace("'", "").split(", ") if x != "[]" else []
)

# Explode genres into separate rows
genres_df = df.explode('genres')

# Remove empty genres
genres_df = genres_df[genres_df['genres'] != ""]
# --------- Popularity Prediction Model ---------

from sklearn.linear_model import LinearRegression
import numpy as np

X = df[['followers']].values
y = df['popularity'].values

model = LinearRegression()
model.fit(X, y)

r2_score = model.score(X, y)
print("Model R² score:", r2_score)




@app.route("/")
def home():

    # ---------- Plot 1: Followers vs Popularity ----------
    sample_df = df.sample(10000, random_state=42)

    plt.figure(facecolor='#f0f8ff')
    plt.scatter(sample_df['followers'], sample_df['popularity'], alpha=0.6, color='#ff6b6b', edgecolors='#4ecdc4', linewidth=0.5)
    plt.xlabel("Followers", color='#2c3e50')
    plt.ylabel("Popularity", color='#2c3e50')
    plt.title("Followers vs Popularity", color='#2d6a4f', fontsize=14, fontweight='bold')
    ax = plt.gca()
    ax.set_facecolor('#ffffff')
    ax.spines['bottom'].set_color('#2c3e50')
    ax.spines['left'].set_color('#2c3e50')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.tick_params(colors='#2c3e50')
    plt.savefig("static/followers_vs_popularity.png", facecolor='#f0f8ff')
    plt.close()


    # ---------- Plot 2: Top 10 Artists ----------
    top_artists = df.sort_values(by='followers', ascending=False).head(10)

    plt.figure(facecolor='#f0f8ff')
    plt.barh(top_artists['name'], top_artists['followers'], color='#2d6a4f', edgecolor='#4ecdc4', linewidth=1.5)
    plt.xlabel("Followers", color='#2c3e50')
    plt.ylabel("Artist", color='#2c3e50')
    plt.title("Top 10 Most Followed Artists", color='#2d6a4f', fontsize=14, fontweight='bold')
    ax = plt.gca()
    ax.set_facecolor('#ffffff')
    ax.spines['bottom'].set_color('#2c3e50')
    ax.spines['left'].set_color('#2c3e50')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.tick_params(colors='#2c3e50')
    plt.gca().invert_yaxis()
    plt.savefig("static/top_10_artists.png", facecolor='#f0f8ff')
    plt.close()


    # ---------- Plot 3: Top Genres ----------
    top_genres = genres_df['genres'].value_counts().head(10)

    plt.figure(facecolor='#f0f8ff')
    plt.barh(top_genres.index, top_genres.values, color='#ff6b6b', edgecolor='#4ecdc4', linewidth=1.5)
    plt.xlabel("Number of Artists", color='#2c3e50')
    plt.ylabel("Genre", color='#2c3e50')
    plt.title("Top 10 Spotify Genres", color='#2d6a4f', fontsize=14, fontweight='bold')
    ax = plt.gca()
    ax.set_facecolor('#ffffff')
    ax.spines['bottom'].set_color('#2c3e50')
    ax.spines['left'].set_color('#2c3e50')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.tick_params(colors='#2c3e50')
    plt.gca().invert_yaxis()
    plt.savefig("static/top_genres.png", facecolor='#f0f8ff')
    plt.close()


    # ---------- Plot 4: Genre Popularity ----------
    genre_popularity = (
        genres_df
        .groupby('genres')['popularity']
        .mean()
        .sort_values(ascending=False)
        .head(10)
    )

    plt.figure(facecolor='#f0f8ff')
    plt.barh(genre_popularity.index, genre_popularity.values, color='#4ecdc4', edgecolor='#ff6b6b', linewidth=1.5)
    plt.xlabel("Average Popularity", color='#2c3e50')
    plt.ylabel("Genre", color='#2c3e50')
    plt.title("Top Genres by Average Popularity", color='#2d6a4f', fontsize=14, fontweight='bold')
    ax = plt.gca()
    ax.set_facecolor('#ffffff')
    ax.spines['bottom'].set_color('#2c3e50')
    ax.spines['left'].set_color('#2c3e50')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.tick_params(colors='#2c3e50')
    plt.gca().invert_yaxis()
    plt.savefig("static/genre_popularity.png", facecolor='#f0f8ff')
    plt.close()


    return render_template("index.html")

@app.route("/artist", methods=["GET", "POST"])
def artist_search():

    artists = None
    error = None

    if request.method == "POST":
        artist_name = request.form.get("artist_name").strip().lower()

        # Partial, case-insensitive search
        results = df[df['name'].str.lower().str.contains(artist_name)]

        if not results.empty:
            # Sort by followers and take top 10 matches
            artists = (
                results
                .sort_values(by='followers', ascending=False)
                .head(10)
            )
        else:
            error = "No matching artists found."

    return render_template(
        "artist.html",
        artists=artists,
        error=error
    )

@app.route("/predict", methods=["GET", "POST"])
def predict():

    predicted_value = None

    if request.method == "POST":
        followers = float(request.form.get("followers"))
        predicted_value = model.predict([[followers]])[0]

    return render_template(
        "predict.html",
        prediction=predicted_value,
        r2=r2_score
    )
@app.route("/artist/<artist_name>")
def artist_detail(artist_name):

    result = df[df['name'].str.lower() == artist_name.lower()]

    if result.empty:
        return "Artist not found", 404

    artist = result.iloc[0]

    artist_data = {
        "name": artist['name'],
        "followers": int(artist['followers']),
        "popularity": artist['popularity'],
        "genres": artist['genres']
    }

    return render_template("artist_detail.html", artist=artist_data)




if __name__ == "__main__":
    app.run(debug=True)
