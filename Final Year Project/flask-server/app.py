import numpy as np
from flask import Flask, request, jsonify, render_template
import pickle

# Create flask app
flask_app = Flask(__name__)
model_1 = pickle.load(open("model_1.pkl", "rb"))
model_2 = pickle.load(open("model_2.pkl", "rb"))

@flask_app.route("/")
def Home():
    return render_template("index.html")

@flask_app.route("/predict1", methods=["POST"])
def predict1():
    inputs = request.get_json()
    concurrency_value = float(inputs['concurrency'])
    # timeout_values = np.array([20, 60, 100, 140])
    feature_values = np.array([concurrency_value])
    pred_array = np.empty((0, 2), float)

    for timeout in range(1,151):
        feature_array = np.hstack([feature_values, timeout])
        prediction1 = model_1.predict(np.array([feature_array]))
        prediction1 = np.round(prediction1, decimals=2)
        row = np.array([[timeout, prediction1[0]]])
        pred_array = np.append(pred_array, row, axis=0)
    print(list(pred_array[0]))

    return {
      'output': {
        'response': [list(x) for x in pred_array],
      },
      'status': 200
    }, 200
    # return render_template("index.html", prediction_text="The latency value is {}".format(pred_array))

@flask_app.route("/predict2", methods = ["POST"])
def predict2():
    inputs = request.get_json()
    concurrency_value = float(inputs['concurrency'])
    rate_limit_value = float(inputs['rateLimit'])
    # timeout_values = np.array([20, 60, 100, 140])
    feature_values = np.array([concurrency_value, rate_limit_value])
    pred_array = np.empty((0, 2), float)

    for timeout in range(1,151):
        feature_array = np.hstack([feature_values, timeout])
        prediction2 = model_2.predict(np.array([feature_array]))
        prediction2 = np.round(prediction2, decimals=2)
        row = np.array([[timeout, prediction2[0]]])
        pred_array = np.append(pred_array, row, axis=0)
    print(list(pred_array[0]))

    return {
      'output': {
        'response': [list(x) for x in pred_array],
      },
      'status': 200
    }, 200

    # return render_template("index.html", prediction_text="The error percentage value is {}".format(pred_array))

@flask_app.route("/predict3", methods = ["POST"])
def predict3():
    inputs = request.get_json()
    concurrency_value = float(inputs['concurrency'])
    rate_limit_value = float(inputs['rateLimit'])
    # timeout_values = np.array([20, 60, 100, 140])
    feature_values = np.array([concurrency_value, rate_limit_value])
    pred_array = np.empty((0, 3), float)

    for timeout in range(1,151):
        feature_array = np.hstack([feature_values, timeout])
        feature_array2 = np.hstack([feature_values[0], timeout])
        prediction1 = model_1.predict(np.array([feature_array2]))
        prediction1 = np.round(prediction1, decimals=2)
        prediction2 = model_2.predict(np.array([feature_array]))
        prediction2 = np.round(prediction2, decimals=2)
        row = np.array([[timeout, prediction1[0],prediction2[0]]])
        pred_array = np.append(pred_array, row, axis=0)
    
    return {
      'output': {
        'response': [list(x) for x in pred_array],
      },
      'status': 200
    }, 200

    # return render_template("index.html", prediction_text="The latency value is {}".format(pred_array))

if __name__ == "__main__":
    flask_app.run(debug=True)