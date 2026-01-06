# HateSpeechOLS  
## Hate Speech Detection using Orthogonal Least Squares (OLS)

HateSpeechOLS is a machine learning project that detects **Hate Speech**, **Offensive Language**, and **Normal Speech** from text data.  
The main goal of this project is to demonstrate how **Orthogonal Least Squares (OLS)** feature selection can reduce feature size and improve model efficiency in text classification.

---

## 📌 Project Information

- **Project Type:** Academic / Capstone Project  
- **Year:** 2026  
- **Department:** Artificial Intelligence & Data Science  
- **Institution:** GITAM (Deemed to be University), Bengaluru  
- **Batch:** CS Batch 14  

---

## 🎯 Objective

- Detect hate speech in social media text
- Reduce high-dimensional TF-IDF features using OLS
- Improve training time and model performance
- Build a simple and deployable ML pipeline

---

## 📂 Dataset

- **Dataset:** Davidson et al. (2017) Hate Speech Dataset
- **Total Samples:** 24,783 tweets

### Class Labels
- `0` – Hate Speech  
- `1` – Offensive Language  
- `2` – Normal Speech  

The dataset is highly imbalanced, making feature selection important.

---

## ⚙️ Workflow

1. Load dataset
2. Text preprocessing
3. TF-IDF vectorization
4. OLS feature selection
5. Model training
6. Evaluation
7. API-based deployment (prototype)

---

## 🧹 Text Preprocessing

The following steps are applied to clean the text:

- Convert text to lowercase
- Remove URLs and user mentions
- Remove punctuation and numbers
- Apply lemmatization

This reduces noise and improves feature quality.

---

## 📐 Feature Engineering

### TF-IDF Vectorization
- Converts text into numerical features
- Uses unigrams to trigrams (1–3 grams)
- Generates **10,000+ features**

### OLS Feature Selection (Key Contribution)
- Selects top **1,500 important features**
- Removes redundant and irrelevant features
- Reduces dimensionality by ~85%

---

## 🤖 Model Used

- **Logistic Regression**
- Uses class weights to handle imbalance
- Trained on OLS-selected features

Chosen because it is simple, interpretable, and effective with optimized features.

---

## 📊 Experimental Results

- **Training time reduced by ~40%**
- **Features reduced:** 10,000+ → 1,500
- Improved precision and recall for Hate Speech class
- Faster inference with stable accuracy

---

## 🔥 Confusion Matrix (Conceptual)

| Actual \\ Predicted | Hate | Offensive | Normal |
|--------------------|------|-----------|--------|
| Hate | 1200 | 150 | 80 |
| Offensive | 400 | 18500 | 290 |
| Normal | 50 | 313 | 3800 |

High diagonal values indicate correct classifications.

---

## 🌍 Applications

- Social media moderation
- Online community monitoring
- Gaming chat filtering
- News website comment moderation
- Brand safety systems

---

## 🌐 Deployment Overview

The model is designed as a REST API:

1. User sends text input
2. Text is preprocessed
3. TF-IDF vectorization
4. OLS feature filtering
5. Model predicts the class
6. API returns the result

Supports real-time inference.

---

## 👨‍🏫 Project Guide

**Dr. Kothuru Srinivasulu**  
Faculty Supervisor  
Department of Artificial Intelligence & Data Science

---

## 👨‍💻 Project Team (CS Batch 14)

- **Kaditham Gowtham** – Team Leader  
  Roll No: BU22CSEN0400136  

- **Srishanth** – Member  
  Roll No: BU22CSEN0400071  

- **Gayathri Y N** – Member  
  Roll No: BU22CSEN0400217  

- **Mukesh Reddy** – Member  
  Roll No: BU22CSEN0400175  

---

## 📌 Conclusion

HateSpeechOLS demonstrates how Orthogonal Least Squares can effectively optimize NLP models by reducing feature size, improving efficiency, and maintaining strong classification performance.  
This project is suitable for academic evaluation and real-world moderation use cases.

---

