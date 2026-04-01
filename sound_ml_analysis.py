"""
SENG 691 AI Agent Computing - Assignment 4: Supervised Machine Learning
Sound Data Analysis from UMBC Campus Locations
Author: Prathyusha
Date: 2026-03-30

This script performs:
1. Data loading and preprocessing
2. Exploratory Data Analysis (EDA)
3. Feature Engineering
4. Machine Learning Classification (Decision Tree, Random Forest, SVM)
5. Model Evaluation and Comparison
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.tree import DecisionTreeClassifier, plot_tree
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.metrics import (accuracy_score, precision_score, recall_score,
                             f1_score, classification_report, confusion_matrix)
import warnings
warnings.filterwarnings('ignore')

# Set plot style
plt.style.use('seaborn-v0_8-whitegrid')
sns.set_palette("husl")

# ============================================================================
# PART A: DATA COLLECTION AND ANALYSIS
# ============================================================================

print("=" * 70)
print("SENG 691 - Assignment 4: Supervised Machine Learning")
print("Sound Data Analysis from UMBC Campus Locations")
print("=" * 70)

# --- Step 1: Load the combined dataset ---
print("\n--- Step 1: Loading Data ---")
df = pd.read_csv('combined_sound_data.csv')
df['timestamp'] = pd.to_datetime(df['timestamp'])

print(f"Total data points: {len(df)}")
print(f"Locations: {df['location'].unique()}")
print(f"Data points per location:")
print(df['location'].value_counts())
print(f"\nDataset shape: {df.shape}")
print(f"\nFirst 5 rows:")
print(df.head())

# --- Step 2: Data Quality Check ---
print("\n--- Step 2: Data Quality Check ---")
print(f"Missing values:\n{df.isnull().sum()}")
print(f"\nData types:\n{df.dtypes}")
print(f"\nDuplicate rows: {df.duplicated().sum()}")
print(f"\nDecibel value range: {df['decibel'].min()} - {df['decibel'].max()} dBA")

# Check for outliers using IQR
Q1 = df['decibel'].quantile(0.25)
Q3 = df['decibel'].quantile(0.75)
IQR = Q3 - Q1
outlier_lower = Q1 - 1.5 * IQR
outlier_upper = Q3 + 1.5 * IQR
outliers = df[(df['decibel'] < outlier_lower) | (df['decibel'] > outlier_upper)]
print(f"\nIQR-based outlier bounds: [{outlier_lower:.1f}, {outlier_upper:.1f}]")
print(f"Number of outliers: {len(outliers)}")

# --- Step 3: Initial Analysis - Compare sound levels across locations ---
print("\n--- Step 3: Statistical Summary by Location ---")
location_stats = df.groupby('location')['decibel'].agg(
    ['count', 'mean', 'std', 'min', 'max', 'median']
).round(2)
print(location_stats)

# --- Visualization 1: Box plot of decibel levels by location ---
fig, axes = plt.subplots(2, 2, figsize=(14, 10))

# Box plot
ax1 = axes[0, 0]
df.boxplot(column='decibel', by='location', ax=ax1)
ax1.set_title('Sound Level Distribution by Location')
ax1.set_xlabel('Location')
ax1.set_ylabel('Decibel (dBA)')
ax1.set_xticklabels(ax1.get_xticklabels(), rotation=15)
plt.sca(ax1)
plt.title('Sound Level Distribution by Location')

# Histogram
ax2 = axes[0, 1]
for loc in df['location'].unique():
    subset = df[df['location'] == loc]
    ax2.hist(subset['decibel'], bins=20, alpha=0.6, label=loc, edgecolor='black')
ax2.set_title('Histogram of Decibel Readings by Location')
ax2.set_xlabel('Decibel (dBA)')
ax2.set_ylabel('Frequency')
ax2.legend()

# Bar chart of mean decibel by location
ax3 = axes[1, 0]
mean_by_loc = df.groupby('location')['decibel'].mean().sort_values()
colors = ['#2ecc71', '#3498db', '#e74c3c', '#f39c12']
mean_by_loc.plot(kind='bar', ax=ax3, color=colors, edgecolor='black')
ax3.set_title('Average Sound Level by Location')
ax3.set_xlabel('Location')
ax3.set_ylabel('Average Decibel (dBA)')
ax3.set_xticklabels(ax3.get_xticklabels(), rotation=15)
for i, v in enumerate(mean_by_loc.values):
    ax3.text(i, v + 0.3, f'{v:.1f}', ha='center', fontweight='bold')

# Violin plot
ax4 = axes[1, 1]
locations = df['location'].unique()
data_by_loc = [df[df['location'] == loc]['decibel'].values for loc in locations]
parts = ax4.violinplot(data_by_loc, showmeans=True, showmedians=True)
ax4.set_xticks(range(1, len(locations) + 1))
ax4.set_xticklabels(locations, rotation=15)
ax4.set_title('Violin Plot of Sound Levels')
ax4.set_xlabel('Location')
ax4.set_ylabel('Decibel (dBA)')

plt.tight_layout()
plt.savefig('part_a_analysis.png', dpi=150, bbox_inches='tight')
plt.close()
print("\nSaved: part_a_analysis.png")

# ============================================================================
# PART B: APPLYING MACHINE LEARNING ALGORITHMS
# ============================================================================

print("\n" + "=" * 70)
print("PART B: MACHINE LEARNING CLASSIFICATION")
print("=" * 70)

# --- Step 1: Feature Engineering ---
print("\n--- Step 1: Feature Engineering ---")

# Feature 1: Hour of the day (time-based)
df['hour'] = df['timestamp'].dt.hour

# Feature 2: Minute of the hour (time-based granularity)
df['minute'] = df['timestamp'].dt.minute

# Feature 3: Indoor/Outdoor classification (location-based)
# Library = Indoor, RAC = Indoor, University Center = Indoor, Commons = Outdoor
indoor_outdoor_map = {
    'RAC': 1,                  # Indoor
    'University Center': 1,    # Indoor
    'Library': 1,              # Indoor
    'Commons': 0               # Outdoor
}
df['is_indoor'] = df['location'].map(indoor_outdoor_map)

# Feature 4: Noise Level Category (derived from decibel)
def categorize_noise(db):
    if db < 55:
        return 'Quiet'
    elif db < 65:
        return 'Moderate'
    elif db < 75:
        return 'Loud'
    else:
        return 'Very Loud'

df['noise_category'] = df['decibel'].apply(categorize_noise)

# Feature 5: Rolling statistics (using 5-sample window per location)
df['rolling_mean'] = df.groupby('location')['decibel'].transform(
    lambda x: x.rolling(window=5, min_periods=1).mean()
)
df['rolling_std'] = df.groupby('location')['decibel'].transform(
    lambda x: x.rolling(window=5, min_periods=1).std().fillna(0)
)

# Feature 6: Deviation from location mean
df['deviation_from_mean'] = df.groupby('location')['decibel'].transform(
    lambda x: x - x.mean()
)

# Feature 7: Second of measurement (captures temporal position)
df['second'] = df['timestamp'].dt.second

print("Engineered Features:")
print("  1. hour            - Hour of the day (time-based)")
print("  2. minute          - Minute of the hour (time-based)")
print("  3. is_indoor       - Indoor(1) / Outdoor(0) (location-based)")
print("  4. noise_category  - Quiet/Moderate/Loud/Very Loud (noise-level based)")
print("  5. rolling_mean    - 5-sample rolling average (statistical)")
print("  6. rolling_std     - 5-sample rolling std dev (statistical)")
print("  7. deviation_from_mean - Deviation from location mean (statistical)")
print("  8. second          - Second of measurement (time-based)")

print(f"\nNoise Category Distribution:")
print(df['noise_category'].value_counts())

print(f"\nFeature-engineered dataset preview:")
print(df[['decibel', 'location', 'hour', 'minute', 'is_indoor',
          'noise_category', 'rolling_mean', 'rolling_std']].head(10))

# Feature 8: Noise level encoded (ordinal encoding of noise_category)
noise_level_map = {'Quiet': 0, 'Moderate': 1, 'Loud': 2, 'Very Loud': 3}
df['noise_level_encoded'] = df['noise_category'].map(noise_level_map)

# --- Step 2: Prepare data for classification ---
print("\n--- Step 2: Preparing Data for Multi-Class Classification ---")
print("Target variable: location (4 classes: RAC, University Center, Library, Commons)")
print("\nNote: Using SOUND-BASED features only (not raw time features like hour/minute)")
print("      which would trivially identify the recording session and leak location info.")

# Encode the target variable
le = LabelEncoder()
df['location_encoded'] = le.fit_transform(df['location'])
print(f"Label encoding: {dict(zip(le.classes_, le.transform(le.classes_)))}")

# Select features for ML models - sound-based features that generalize
feature_columns = ['decibel', 'rolling_mean', 'rolling_std',
                   'deviation_from_mean', 'noise_level_encoded']

X = df[feature_columns].values
y = df['location_encoded'].values

print(f"\nFeatures used: {feature_columns}")
print(f"Feature matrix shape: {X.shape}")
print(f"Target vector shape: {y.shape}")
print(f"Class distribution:\n{pd.Series(y).value_counts().sort_index()}")

# --- Step 3: Train-Test Split ---
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)
print(f"\nTraining set size: {X_train.shape[0]}")
print(f"Testing set size: {X_test.shape[0]}")

# Scale features for SVM
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# --- Step 4: Apply 3 Machine Learning Algorithms ---
print("\n--- Step 3: Training Machine Learning Models ---")

# Dictionary to store results
results = {}

# ---- Model 1: Decision Tree ----
print("\n>> Model 1: Decision Tree Classifier")
dt_model = DecisionTreeClassifier(random_state=42, max_depth=10, min_samples_split=5)
dt_model.fit(X_train, y_train)
dt_pred = dt_model.predict(X_test)
dt_accuracy = accuracy_score(y_test, dt_pred)
dt_precision = precision_score(y_test, dt_pred, average='weighted')
dt_recall = recall_score(y_test, dt_pred, average='weighted')
dt_f1 = f1_score(y_test, dt_pred, average='weighted')

print(f"   Accuracy:  {dt_accuracy:.4f}")
print(f"   Precision: {dt_precision:.4f}")
print(f"   Recall:    {dt_recall:.4f}")
print(f"   F1-Score:  {dt_f1:.4f}")
print(f"\n   Classification Report:")
print(classification_report(y_test, dt_pred, target_names=le.classes_))

results['Decision Tree'] = {
    'accuracy': dt_accuracy, 'precision': dt_precision,
    'recall': dt_recall, 'f1': dt_f1, 'predictions': dt_pred
}

# Feature importance for Decision Tree
dt_importance = pd.DataFrame({
    'Feature': feature_columns,
    'Importance': dt_model.feature_importances_
}).sort_values('Importance', ascending=False)
print("   Feature Importance (Decision Tree):")
print(dt_importance.to_string(index=False))

# ---- Model 2: Random Forest ----
print("\n>> Model 2: Random Forest Classifier")
rf_model = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=15,
                                   min_samples_split=5)
rf_model.fit(X_train, y_train)
rf_pred = rf_model.predict(X_test)
rf_accuracy = accuracy_score(y_test, rf_pred)
rf_precision = precision_score(y_test, rf_pred, average='weighted')
rf_recall = recall_score(y_test, rf_pred, average='weighted')
rf_f1 = f1_score(y_test, rf_pred, average='weighted')

print(f"   Accuracy:  {rf_accuracy:.4f}")
print(f"   Precision: {rf_precision:.4f}")
print(f"   Recall:    {rf_recall:.4f}")
print(f"   F1-Score:  {rf_f1:.4f}")
print(f"\n   Classification Report:")
print(classification_report(y_test, rf_pred, target_names=le.classes_))

results['Random Forest'] = {
    'accuracy': rf_accuracy, 'precision': rf_precision,
    'recall': rf_recall, 'f1': rf_f1, 'predictions': rf_pred
}

# Feature importance for Random Forest
rf_importance = pd.DataFrame({
    'Feature': feature_columns,
    'Importance': rf_model.feature_importances_
}).sort_values('Importance', ascending=False)
print("   Feature Importance (Random Forest):")
print(rf_importance.to_string(index=False))

# ---- Model 3: Support Vector Machine (SVM) ----
print("\n>> Model 3: Support Vector Machine (SVM)")
svm_model = SVC(kernel='rbf', C=10, gamma='scale', random_state=42)
svm_model.fit(X_train_scaled, y_train)
svm_pred = svm_model.predict(X_test_scaled)
svm_accuracy = accuracy_score(y_test, svm_pred)
svm_precision = precision_score(y_test, svm_pred, average='weighted')
svm_recall = recall_score(y_test, svm_pred, average='weighted')
svm_f1 = f1_score(y_test, svm_pred, average='weighted')

print(f"   Accuracy:  {svm_accuracy:.4f}")
print(f"   Precision: {svm_precision:.4f}")
print(f"   Recall:    {svm_recall:.4f}")
print(f"   F1-Score:  {svm_f1:.4f}")
print(f"\n   Classification Report:")
print(classification_report(y_test, svm_pred, target_names=le.classes_))

results['SVM'] = {
    'accuracy': svm_accuracy, 'precision': svm_precision,
    'recall': svm_recall, 'f1': svm_f1, 'predictions': svm_pred
}

# --- Step 5: Model Comparison ---
print("\n--- Step 4: Model Comparison ---")
comparison_df = pd.DataFrame({
    'Model': list(results.keys()),
    'Accuracy': [results[m]['accuracy'] for m in results],
    'Precision': [results[m]['precision'] for m in results],
    'Recall': [results[m]['recall'] for m in results],
    'F1-Score': [results[m]['f1'] for m in results]
}).round(4)
print(comparison_df.to_string(index=False))

best_model = comparison_df.loc[comparison_df['F1-Score'].idxmax(), 'Model']
best_f1 = comparison_df['F1-Score'].max()
print(f"\nBest performing model: {best_model} (F1-Score: {best_f1:.4f})")

# ============================================================================
# VISUALIZATION: Model Results
# ============================================================================

# --- Figure 2: Confusion Matrices ---
fig, axes = plt.subplots(1, 3, figsize=(18, 5))
model_names = list(results.keys())

for idx, (name, ax) in enumerate(zip(model_names, axes)):
    cm = confusion_matrix(y_test, results[name]['predictions'])
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', ax=ax,
                xticklabels=le.classes_, yticklabels=le.classes_)
    ax.set_title(f'{name}\nAccuracy: {results[name]["accuracy"]:.4f}')
    ax.set_xlabel('Predicted')
    ax.set_ylabel('Actual')
    ax.set_xticklabels(ax.get_xticklabels(), rotation=30, ha='right')
    ax.set_yticklabels(ax.get_yticklabels(), rotation=0)

plt.tight_layout()
plt.savefig('confusion_matrices.png', dpi=150, bbox_inches='tight')
plt.close()
print("\nSaved: confusion_matrices.png")

# --- Figure 3: Model Performance Comparison Bar Chart ---
fig, ax = plt.subplots(figsize=(10, 6))
x = np.arange(len(model_names))
width = 0.2
metrics = ['Accuracy', 'Precision', 'Recall', 'F1-Score']
colors = ['#2ecc71', '#3498db', '#e74c3c', '#f39c12']

for i, metric in enumerate(metrics):
    values = comparison_df[metric].values
    bars = ax.bar(x + i * width, values, width, label=metric, color=colors[i],
                  edgecolor='black')
    for bar, val in zip(bars, values):
        ax.text(bar.get_x() + bar.get_width() / 2., bar.get_height() + 0.005,
                f'{val:.3f}', ha='center', va='bottom', fontsize=8)

ax.set_xlabel('Model')
ax.set_ylabel('Score')
ax.set_title('Model Performance Comparison')
ax.set_xticks(x + width * 1.5)
ax.set_xticklabels(model_names)
ax.legend()
ax.set_ylim(0, 1.15)
plt.tight_layout()
plt.savefig('model_comparison.png', dpi=150, bbox_inches='tight')
plt.close()
print("Saved: model_comparison.png")

# --- Figure 4: Feature Importance (Random Forest) ---
fig, ax = plt.subplots(figsize=(10, 5))
rf_importance_sorted = rf_importance.sort_values('Importance', ascending=True)
ax.barh(rf_importance_sorted['Feature'], rf_importance_sorted['Importance'],
        color='#3498db', edgecolor='black')
ax.set_xlabel('Importance')
ax.set_title('Feature Importance (Random Forest)')
for i, v in enumerate(rf_importance_sorted['Importance'].values):
    ax.text(v + 0.005, i, f'{v:.4f}', va='center')
plt.tight_layout()
plt.savefig('feature_importance.png', dpi=150, bbox_inches='tight')
plt.close()
print("Saved: feature_importance.png")

# --- Figure 5: Decision Tree Visualization ---
fig, ax = plt.subplots(figsize=(20, 10))
plot_tree(dt_model, feature_names=feature_columns, class_names=le.classes_,
          filled=True, rounded=True, ax=ax, max_depth=3, fontsize=8)
ax.set_title('Decision Tree Visualization (Max Depth = 3 shown)')
plt.tight_layout()
plt.savefig('decision_tree.png', dpi=150, bbox_inches='tight')
plt.close()
print("Saved: decision_tree.png")

# ============================================================================
# FINAL SUMMARY
# ============================================================================
print("\n" + "=" * 70)
print("FINAL SUMMARY")
print("=" * 70)

print(f"""
Dataset Summary:
  - Total data points: {len(df)}
  - Locations: {', '.join(df['location'].unique())}
  - Collection date: 2026-03-30
  - Tool used: Decibel X mobile application

Location Statistics:
{location_stats.to_string()}

Features Engineered:
  Time-based:     hour, minute, second
  Location-based: is_indoor (Indoor=1, Outdoor=0)
  Noise-level:    noise_category (Quiet/Moderate/Loud/Very Loud), noise_level_encoded
  Statistical:    rolling_mean, rolling_std, deviation_from_mean

Features Used for ML Classification:
  {feature_columns}

Machine Learning Models Applied:
  1. Decision Tree Classifier  - Accuracy: {dt_accuracy:.4f}, F1: {dt_f1:.4f}
  2. Random Forest Classifier  - Accuracy: {rf_accuracy:.4f}, F1: {rf_f1:.4f}
  3. Support Vector Machine    - Accuracy: {svm_accuracy:.4f}, F1: {svm_f1:.4f}

Best Model: {best_model} with F1-Score: {best_f1:.4f}

Generated Plots:
  - part_a_analysis.png      (Box, Histogram, Bar, Violin plots)
  - confusion_matrices.png   (Confusion matrices for all 3 models)
  - model_comparison.png     (Performance bar chart)
  - feature_importance.png   (Random Forest feature importance)
  - decision_tree.png        (Decision Tree visualization)
""")

print("Script completed successfully!")
