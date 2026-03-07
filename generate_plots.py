import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

df = pd.read_csv("data/artists.csv")
df = df.dropna(subset=["followers", "popularity"])
genres_df = df.copy()

sample_size = min(10000, len(df))
sample_df = df.sample(sample_size, random_state=42)

# Plot 1: Followers vs Popularity
plt.figure(facecolor='#f0f8ff')
plt.scatter(sample_df['followers'], sample_df['popularity'],
            alpha=0.6, color='#ff6b6b', edgecolors='#4ecdc4', linewidth=0.5)
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

# Plot 2: Top Artists
top_artists = df.sort_values(by='followers', ascending=False).head(10)
plt.figure(facecolor='#f0f8ff')
plt.barh(top_artists['name'], top_artists['followers'],
         color='#2d6a4f', edgecolor='#4ecdc4', linewidth=1.5)
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

# Plot 3: Top Genres
top_genres = genres_df['genres'].value_counts().head(10)
plt.figure(facecolor='#f0f8ff')
plt.barh(top_genres.index, top_genres.values,
         color='#ff6b6b', edgecolor='#4ecdc4', linewidth=1.5)
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

# Plot 4: Genre Popularity
genre_popularity = (
    genres_df.groupby('genres')['popularity']
    .mean()
    .sort_values(ascending=False)
    .head(10)
)
plt.figure(facecolor='#f0f8ff')
plt.barh(genre_popularity.index, genre_popularity.values,
         color='#4ecdc4', edgecolor='#ff6b6b', linewidth=1.5)
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

print("All plots saved to static/!")