# Import the dependencies.
from flask import Flask, jsonify, render_template
import pandas as pd
from sqlHelper import SQLHelper

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
sqlHelper = SQLHelper() # initialize the database helper

@app.route("/")
def home_page():
    return render_template("index.html")

@app.route("/about_us")
def about_us():
    return render_template("about_us.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

@app.route("/api/v1.0/<region>")
def get_data(region):
    print(region)

    # execute the queries
    data_map = sqlHelper.getMapData(region)
    data_bar = sqlHelper.getBarData(region)
    data_sunburst = sqlHelper.getSunburstData(region)
    data_box = sqlHelper.getBoxData(region)

    data = {"map_data": data_map,
            "bar_data": data_bar,
            "sunburst_data": data_sunburst,
            "box_data": data_box}

    return jsonify(data)

#################################################
# Execute the App
#################################################
if __name__ == "__main__":
    app.run(debug=True)
