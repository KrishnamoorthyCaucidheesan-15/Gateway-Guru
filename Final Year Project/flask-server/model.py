# Import libraries
import numpy as np
import pandas as pd
from sklearn.metrics import  r2_score, mean_absolute_error, mean_squared_error
from sklearn.ensemble import VotingRegressor
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import cross_val_score
import matplotlib.pyplot as plt
import pickle

# Importing the datasets
df = pd.read_csv('Organized-dataset.csv')

# Using concurrency and timeout to train and predict latency
X_1 = df.iloc[:, [0, 6]]
Y_1 = df.iloc[:, [5]]

# Using concurrency,ratelimit and timeout to train and predict error percentage
X_2= df.iloc[:, [0, 3, 6]]
Y_2= df.iloc[:, [2]]

# Splitting the dataset into the Training set and Test set
X1_Train, X1_Test, Y1_Train, Y1_Test = train_test_split(X_1, Y_1, test_size=0.2, random_state=50)

# Splitting the dataset into the Training set and Test set
X2_Train, X2_Test, Y2_Train, Y2_Test = train_test_split(X_2, Y_2, test_size=0.2, random_state=75)

# Fitting the Random forest regression in the Training set
lr = LinearRegression()
rf = RandomForestRegressor(n_estimators=50, max_depth=5)
regressor = VotingRegressor(estimators=[('lr', lr), ('rf', rf2)])
# regressor = RandomForestRegressor(n_estimators=50, max_depth=5)
regressor.fit(X1_Train, Y1_Train)

rf2 = RandomForestRegressor(n_estimators=100, max_depth=5)
regressor2 = VotingRegressor(estimators=[('lr', lr), ('rf2', rf2)])
regressor2.fit(X2_Train, Y2_Train)

# Saving in a pickle file
pickle.dump(regressor, open('model_1.pkl','wb'))
model = pickle.load(open("model_1.pkl","rb"))

pickle.dump(regressor2, open('model_2.pkl','wb'))
model2 = pickle.load(open("model_2.pkl","rb"))

# K-fold cross validation
scores = cross_val_score(regressor, X1_Train, Y1_Train, cv=5)
print('Cross-validation scores:', scores)
print('Mean score:', np.mean(scores))
print('Standard deviation:', np.std(scores))

# K-fold cross validation
scores2 = cross_val_score(regressor2, X2_Train, Y2_Train, cv=5)
print('Cross-validation scores:', scores2)
print('Mean score:', np.mean(scores2))
print('Standard deviation:', np.std(scores2))

# Predicting the test set results
Y1_Pred = regressor.predict(X1_Test)

# Predicting the Test set results
Y2_Pred = regressor2.predict(X2_Test)

# Obtain evaluation scores
score=r2_score(Y1_Test,Y1_Pred)
mae = mean_absolute_error(Y1_Test, Y1_Pred)
mse = np.sqrt(mean_squared_error(Y1_Test, Y1_Pred))
print("R2 score:", score, "Mean absolute error:", mae, "Mean squared error:", mse)

# Obtain evaluation scores
score2=r2_score(Y2_Test,Y2_Pred)
mae2 = mean_absolute_error(Y2_Test, Y2_Pred)
mse2 = np.sqrt(mean_squared_error(Y2_Test, Y2_Pred))
print("r2 score", score2, "mean absolute error :", mae2, "mean squared error:", mse2)

Timeout = np.array([20,60,100,140])
pred_array = np.empty((0,3), float)
user_input_1 = float(input("Enter Concurrency: "))
user_input_2 = float(input("Enter Rate limit: "))
for i in range(len(Timeout+1)):
    prediction1 = regressor.predict([[user_input_1, Timeout[i]]])
    prediction2 = regressor2.predict([[user_input_1, user_input_2, Timeout[i]]])
    # print("Latency for static input", Timeout[i], "for dependent variable 1:", prediction1)
    # print("Error percentage for static input", Timeout[i], "for dependent variable 1:", prediction2)

    # Create a row to add to the array with the count and predictions
    row = np.array([[Timeout[i], prediction1[0], prediction2[0]]])

    # Add the row to the array
    pred_array = np.append(pred_array, row, axis=0)

print(pred_array)

# Create a figure with two y-axes
fig, ax1 = plt.subplots()

# Plot the first predictions on the first y-axis
ax1.plot(pred_array[:,0], pred_array[:,1], color='red')
ax1.set_xlabel('Timeout (ms)')
ax1.set_ylabel('Latency (ms)', color='red')
ax1.tick_params(axis='y', labelcolor='red')

# Create a second y-axis
ax2 = ax1.twinx()

# Plot the second predictions on the second y-axis
ax2.plot(pred_array[:,0], pred_array[:,2], color='blue')
ax2.set_ylabel('Error percentage (%)', color='blue')
ax2.tick_params(axis='y', labelcolor='blue')
plt.title('Accuracy - Latency Tradeoff (concurrency=400,rate limit =30000req/min')
# Show the plot
# plt.show()
plt.savefig('plot.png', dpi=300)
