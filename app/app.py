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

@app.route("/api/v1.0/<st>")
def get_data(st):
    print(st)

    # execute the queries
    data_map = sqlHelper.getMapData(st)
    data_bar = sqlHelper.getBarData(st)
    data_line = sqlHelper.getLineData(st)

    data = {"map_data": data_map,
            "bar_data": data_bar,
            "line_data": data_line}

    return jsonify(data)

#################################################
# Execute the App
#################################################
if __name__ == "__main__":
    app.run(debug=True)
