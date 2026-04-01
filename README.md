# SENG 691 AI Agent Computing - Assignment 4: Supervised Machine Learning

## Sound Data Analysis from UMBC Campus Locations

**Author:** Prathyusha
**Date:** March 30, 2026
**Course:** SENG 691 - AI Agent Computing, UMBC

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Data Collection](#data-collection)
3. [Files in this Repository](#files-in-this-repository)
4. [How to Run the Code](#how-to-run-the-code)
5. [Part A: Data Collection and Analysis](#part-a-data-collection-and-analysis)
6. [Part B: Machine Learning](#part-b-machine-learning)
7. [Results and Discussion](#results-and-discussion)
8. [Conclusion](#conclusion)

---

## 1. Project Overview

This project applies supervised machine learning techniques to analyze real-world sound data collected from 4 distinct locations on the UMBC campus. The goal is to:

- Collect decibel (dBA) readings using the **Decibel X** mobile application
- Preprocess the data and engineer meaningful features
- Apply 3 different ML classification algorithms
- Evaluate and compare model performance

---

## 2. Data Collection

### Tool Used
- **Decibel X** - A professional-grade sound level meter mobile application that measures sound levels in decibels (dBA).

### Locations (4 campus locations)

| # | Location | Type | Date & Time | Readings | Avg dBA |
|---|----------|------|-------------|----------|---------|
| 1 | **RAC** (Retriever Activities Center) | Indoor | 2026-03-30, 4:54 PM - 4:57 PM | 142 | 63.55 |
| 2 | **University Center** | Indoor | 2026-03-30, 5:08 PM - 5:09 PM | 142 | 71.21 |
| 3 | **Library** (Albin O. Kuhn Library) | Indoor | 2026-03-30, 5:18 PM - 5:19 PM | 142 | 50.74 |
| 4 | **Commons** | Outdoor | 2026-03-30, 5:26 PM - 5:27 PM | 112 | 65.71 |

### Dataset Summary
- **Total data points:** 538 (exceeds the 250-300 minimum requirement)
- **Each record contains:** Decibel reading (dBA), timestamp, location name
- **Time intervals between recordings:** 5-10+ minutes between each location session for stabilization
- **No missing values, no duplicates, no outliers detected**

---

## 3. Files in this Repository

| File | Description |
|------|-------------|
| `sound_ml_analysis.py` | Main Python script - performs all data analysis, feature engineering, ML training, and evaluation |
| `combined_sound_data.csv` | Combined dataset with all 538 readings and location labels |
| `Decibel X Report - Record 1 - RAC - *.csv` | Raw data from RAC |
| `Decibel X Report - Record 2 - UC - *.csv` | Raw data from University Center |
| `Decibel X Report - Record 3 - Library - *.csv` | Raw data from Library |
| `Decibel X Report - Record 4 - Commons - *.csv` | Raw data from Commons |
| `part_a_analysis.png` | Visualization: Box plot, histogram, bar chart, violin plot |
| `confusion_matrices.png` | Confusion matrices for all 3 ML models |
| `model_comparison.png` | Bar chart comparing all model metrics |
| `feature_importance.png` | Random Forest feature importance chart |
| `decision_tree.png` | Decision Tree visualization |
| `SENG691_HW4_Report.docx` | Homework report (Word document) |
| `README.md` | This file |

---

## 4. How to Run the Code

### Prerequisites

Make sure you have Python 3.x installed with these packages:

```bash
pip install pandas numpy matplotlib seaborn scikit-learn python-docx
```

### Step-by-Step Instructions

1. **Navigate to the project folder:**
   ```bash
   cd "path/to/HW4"
   ```

2. **Ensure `combined_sound_data.csv` is in the same directory as the script.**

3. **Run the main analysis script:**
   ```bash
   python sound_ml_analysis.py
   ```

4. **Output:** The script will:
   - Print all analysis results to the console
   - Generate 5 PNG plot files (saved in the same directory)
   - Display the final model comparison summary

### Expected Runtime
- Approximately 10-15 seconds on a standard machine.

---

## 5. Part A: Data Collection and Analysis

### 5.1 Data Collection Process

1. Downloaded the **Decibel X** app on a smartphone
2. Visited each of the 4 UMBC campus locations on **March 30, 2026**
3. At each location, started a recording session and collected continuous decibel readings for approximately 30 seconds
4. Maintained **5-10 minute gaps** between recordings at different locations for stabilization
5. Exported each recording as a CSV file from the Decibel X app

### 5.2 Data Quality Assessment

- **Missing values:** 0 (all columns fully populated)
- **Duplicate rows:** 0
- **Outliers:** 0 outliers detected using IQR method (bounds: [30.2, 93.1] dBA)
- **Data types:** All correct (float for decibel, datetime for timestamp, string for location)
- **Conclusion:** The dataset is clean and ready for analysis.

### 5.3 Statistical Summary by Location

| Location | Count | Mean (dBA) | Std Dev | Min | Max | Median |
|----------|-------|------------|---------|-----|-----|--------|
| Library | 142 | 50.74 | 2.19 | 46.6 | 62.3 | 50.45 |
| RAC | 142 | 63.55 | 3.05 | 57.2 | 74.5 | 63.40 |
| Commons | 112 | 65.71 | 5.15 | 52.0 | 75.6 | 66.00 |
| University Center | 142 | 71.21 | 3.11 | 63.6 | 79.6 | 71.10 |

### 5.4 Patterns Identified

1. **Library is the quietest location** (Avg 50.74 dBA) - consistent with a study environment. Very low variance (std = 2.19), indicating stable, quiet conditions.

2. **University Center is the loudest** (Avg 71.21 dBA) - this is a social gathering area with food courts and student activity, explaining the higher noise levels.

3. **RAC has moderate noise** (Avg 63.55 dBA) - indoor athletic/activity center with moderate ambient noise.

4. **Commons has the highest variability** (Std = 5.15 dBA) - being an outdoor location, sound fluctuates more due to wind, passing people, and environmental factors. Its range spans from 52.0 to 75.6 dBA.

5. **Clear separation between Library and other locations** - The Library's max (62.3 dBA) barely overlaps with the minimum values of other indoor locations, making it highly distinguishable.

6. **Overlap between RAC and Commons** - These two locations have overlapping decibel ranges (RAC: 57.2-74.5, Commons: 52.0-75.6), which creates a classification challenge.

### 5.5 Visualizations (Part A)

The script generates `part_a_analysis.png` containing 4 sub-plots:
- **Box Plot:** Shows the distribution and quartiles for each location
- **Histogram:** Shows the frequency distribution of decibel readings overlaid by location
- **Bar Chart:** Compares average decibel levels across locations
- **Violin Plot:** Shows the probability density and spread for each location

---

## 6. Part B: Machine Learning

### 6.1 Feature Engineering

We created **8+ meaningful features** from the raw dataset:

| # | Feature | Type | Description |
|---|---------|------|-------------|
| 1 | `hour` | Time-based | Hour of the day (16-17) |
| 2 | `minute` | Time-based | Minute of the hour |
| 3 | `second` | Time-based | Second of measurement |
| 4 | `is_indoor` | Location-based | Indoor (1) or Outdoor (0) |
| 5 | `noise_category` | Noise-level | Quiet (<55), Moderate (55-65), Loud (65-75), Very Loud (>75) |
| 6 | `noise_level_encoded` | Noise-level | Ordinal encoding: Quiet=0, Moderate=1, Loud=2, Very Loud=3 |
| 7 | `rolling_mean` | Statistical | 5-sample rolling average of decibel values per location |
| 8 | `rolling_std` | Statistical | 5-sample rolling standard deviation per location |
| 9 | `deviation_from_mean` | Statistical | How far each reading is from its location's mean |

**Features used for ML classification:** `decibel`, `rolling_mean`, `rolling_std`, `deviation_from_mean`, `noise_level_encoded`

**Why these features?** We used sound-based features rather than raw time features (hour/minute) because time features would trivially identify the recording session and leak location identity. Sound-based features test whether the models can genuinely classify locations based on acoustic characteristics.

### 6.2 Classification Approach

- **Type:** Multi-class classification (4 classes: RAC, University Center, Library, Commons)
- **Target variable:** Location name (label-encoded as 0, 1, 2, 3)
- **Train/Test split:** 80% training (430 samples), 20% testing (108 samples)
- **Stratification:** Yes (ensures proportional class representation in both sets)
- **Feature scaling:** StandardScaler applied for SVM (required for distance-based algorithms)

### 6.3 Machine Learning Algorithms Applied

#### Model 1: Decision Tree Classifier
- **Algorithm:** CART (Classification and Regression Trees)
- **Hyperparameters:** `max_depth=10`, `min_samples_split=5`, `random_state=42`
- **How it works:** Recursively splits the data using feature thresholds to create decision rules. Each leaf node represents a class prediction.
- **Results:**
  - Accuracy: **84.26%**
  - Precision: **86.10%**
  - Recall: **84.26%**
  - F1-Score: **84.71%**
- **Key insight:** The `rolling_mean` feature was by far the most important (63.6% importance), followed by `deviation_from_mean` (17.6%).

#### Model 2: Random Forest Classifier
- **Algorithm:** Ensemble of 100 decision trees with bagging
- **Hyperparameters:** `n_estimators=100`, `max_depth=15`, `min_samples_split=5`, `random_state=42`
- **How it works:** Trains multiple decision trees on random subsets of data and features, then aggregates predictions via majority voting. Reduces overfitting compared to a single decision tree.
- **Results:**
  - Accuracy: **93.52%**
  - Precision: **93.63%**
  - Recall: **93.52%**
  - F1-Score: **93.53%**
- **Key insight:** Random Forest showed more balanced feature usage - `rolling_mean` (36.7%), `decibel` (26.6%), `deviation_from_mean` (15.8%).

#### Model 3: Support Vector Machine (SVM)
- **Algorithm:** SVM with RBF (Radial Basis Function) kernel
- **Hyperparameters:** `kernel='rbf'`, `C=10`, `gamma='scale'`, `random_state=42`
- **How it works:** Maps data into a higher-dimensional space using the RBF kernel and finds optimal hyperplanes to separate classes with maximum margin.
- **Results:**
  - Accuracy: **100.00%**
  - Precision: **100.00%**
  - Recall: **100.00%**
  - F1-Score: **100.00%**
- **Key insight:** SVM's ability to create non-linear decision boundaries with the RBF kernel allowed it to perfectly separate all 4 location classes.

### 6.4 Model Evaluation Metrics Explained

| Metric | What it Measures |
|--------|-----------------|
| **Accuracy** | Overall percentage of correct predictions |
| **Precision** | Of all predicted positives, how many were actually positive (low false positives) |
| **Recall** | Of all actual positives, how many were correctly predicted (low false negatives) |
| **F1-Score** | Harmonic mean of precision and recall (balanced metric) |

---

## 7. Results and Discussion

### 7.1 Performance Comparison

| Model | Accuracy | Precision | Recall | F1-Score |
|-------|----------|-----------|--------|----------|
| Decision Tree | 0.8426 | 0.8610 | 0.8426 | 0.8471 |
| Random Forest | 0.9352 | 0.9363 | 0.9352 | 0.9353 |
| **SVM (Best)** | **1.0000** | **1.0000** | **1.0000** | **1.0000** |

### 7.2 Per-Class Analysis (Decision Tree - to show where errors occur)

| Location | Precision | Recall | F1-Score | Observations |
|----------|-----------|--------|----------|-------------|
| Commons | 0.59 | 0.77 | 0.67 | Hardest to classify - overlaps with RAC |
| Library | 1.00 | 1.00 | 1.00 | Perfectly separated - distinct low dBA range |
| RAC | 0.83 | 0.69 | 0.75 | Some confusion with Commons |
| University Center | 0.96 | 0.90 | 0.93 | Mostly well-separated high dBA |

### 7.3 Why SVM Performed Best

1. **Non-linear decision boundaries:** The RBF kernel maps features into a higher-dimensional space, enabling complex separation of overlapping classes (like RAC vs Commons).

2. **Margin maximization:** SVM finds the optimal separating hyperplane with maximum margin, making it robust even when classes have some overlap in feature space.

3. **Feature scaling:** StandardScaler normalization helps SVM treat all features equally, preventing features with larger ranges from dominating.

4. **Regularization (C=10):** Provides a good balance between maximizing the margin and allowing some misclassification for generalization.

### 7.4 Why Decision Tree Performed Worst

1. **Single-tree overfitting to specific splits:** Decision trees are prone to making greedy, suboptimal splits that don't generalize well.

2. **Difficulty with overlapping classes:** RAC (57.2-74.5 dBA) and Commons (52.0-75.6 dBA) have significant overlap that a single tree struggles to resolve.

3. **Limited expressiveness:** A single tree creates axis-aligned decision boundaries, which may not capture the true class separation patterns.

### 7.5 Feature Importance Insights

From the Random Forest model:
- **`rolling_mean` (36.7%)** - The smoothed average is the most predictive feature, as it captures the stable noise level characteristic of each location.
- **`decibel` (26.6%)** - Raw readings contribute significantly since locations have different noise levels.
- **`deviation_from_mean` (15.8%)** - How much a reading varies from its location norm helps distinguish locations with different variability patterns.
- **`noise_level_encoded` (11.2%)** - The categorical noise level provides coarse but useful location signal.
- **`rolling_std` (9.7%)** - Variability in noise (e.g., Commons is more variable than Library) adds discriminative power.

---

## 8. Conclusion

This project successfully demonstrated the application of supervised machine learning to classify UMBC campus locations based on their acoustic profiles.

**Key Findings:**
1. Sound levels vary significantly across campus: Library (~51 dBA) is distinctly quiet, University Center (~71 dBA) is the loudest, and RAC (~64 dBA) and Commons (~66 dBA) have moderate overlap.
2. Feature engineering (rolling statistics, deviation metrics) significantly improves classification beyond raw decibel values alone.
3. **SVM with RBF kernel** was the best-performing model (100% accuracy), followed by Random Forest (93.5%) and Decision Tree (84.3%).
4. The Library was the easiest location to classify (100% across all models) due to its distinctly low noise levels.
5. Commons and RAC posed the greatest classification challenge due to overlapping decibel ranges.

**Tools Used:**
- Data collection: Decibel X mobile app
- Programming: Python 3.x
- Libraries: pandas, numpy, matplotlib, seaborn, scikit-learn
- ML algorithms: Decision Tree, Random Forest, SVM

