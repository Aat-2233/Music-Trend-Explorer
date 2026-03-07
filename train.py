import pandas as pd
import numpy as np
import pickle

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import r2_score

# Load dataset
df = pd.read_csv("data/artists.csv")

# Keep only needed columns
df = df[["followers", "popularity"]]

# Drop missing values
df = df.dropna()

# Apply log transform to followers
df["log_followers"] = np.log1p(df["followers"])

X = df[["log_followers"]]
y = df["popularity"]

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# Train model
model = LinearRegression()
model.fit(X_train, y_train)

# Predict
preds = model.predict(X_test)

# Score
r2 = r2_score(y_test, preds)

print("Model R² Score:", r2)

# Save model
pickle.dump(model, open("model.pkl", "wb"))