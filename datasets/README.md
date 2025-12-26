# Hate Speech Detection Dataset

## Source
This dataset is derived from the work of **Davidson et al. (2017)**. 
*Title:* "Automated Hate Speech Detection and the Problem of Offensive Language".
*Proceedings of the 11th International AAAI Conference on Web and Social Media (ICWSM).*

## Structure
The `labeled_data.csv` contains the following columns:

1.  **count**: Number of CrowdFlower users who coded each tweet (min 3).
2.  **hate_speech**: Number of users who judged the tweet to be hate speech.
3.  **offensive_language**: Number of users who judged the tweet to be offensive.
4.  **neither**: Number of users who judged the tweet to be neither.
5.  **class**: The final class label determined by majority vote.
    *   `0` - Hate Speech
    *   `1` - Offensive Language
    *   `2` - Neither
6.  **tweet**: The text content of the tweet.

## Usage in Capstone
This data is used to train the Logistic Regression model. The features are extracted using TF-IDF and optimized using the Orthogonal Least Squares (OLS) algorithm.
