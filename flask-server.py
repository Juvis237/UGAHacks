from flask import Flask, jsonify, request, Response
from flask_cors import CORS
import requests
from groq import Groq
import json
import os
import datetime
import pandas as pd




app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

API_KEY = "b6942a28e6c843abb719375c8ecd6fd9e54257577b2e29aa0ded214a4c9a9cb7";
GROQ_API_KEY="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";

# SEC API Headers
HEADERS = {"User-Agent": "mbengjuvis0@gmail.com"}
EXTRACTOR_ENPOINT = "https://api.sec-api.io/extractor"
# 🔥 Route to fetch 10-K filing content from a given link
# XBRL-to-JSON converter API endpoint
xbrl_converter_api_endpoint = "https://api.sec-api.io/xbrl-to-json"

def format_data_for_chart(income_statement):
    formatted_data = []
    
    for key, value_list in income_statement.items():
        # Prepare each item (US GAAP item)
        formatted_item = {
            'name': key,
            'values': []
        }

        # Get first 3 periods
        for item in value_list[:3]:  # Take the first 3 items
            period = item['period']
            value = float(item['value'])  # Convert value to a number for better charting
            
            # Append period and value to values list
            formatted_item['values'].append({
                'period': period,  # Keep the entire period object (startDate, endDate)
                'value': value     # Converted value
            })
        
        formatted_data.append(formatted_item)
    
    return formatted_data
  



client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)



@app.route("/fetch_10k", methods=["POST"])
def fetch_10k():

    try:
        # Get the URL from request JSON
        data = request.json
        filing_url = data.get("filing_url")

        if not filing_url:
            return jsonify({"error": "Missing filing_url parameter"}), 400
        
        final_url = EXTRACTOR_ENPOINT + "?url="+filing_url+"&item=8&type=text&token="+API_KEY
    
        # Request the 10-K filing content
        response = requests.get(final_url, headers=HEADERS)

        if response.status_code != 200:
            return jsonify({"error": "Failed to fetch filing"}), 500
        
       
        

        return jsonify({"filing_url": final_url, "content": response.text[:700]})
        #Response(response.iter_content(chunk_size=1024), content_type="text/plain")
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/getUsefulStuff", methods=["POST"])
def getUsefulStuff():

    try:
        # Get the URL from request JSON
        data = request.json
        filing_url = data.get("filing_url")

        if not filing_url:
            return jsonify({"error": "Missing filing_url parameter"}), 400
        
        final_url = xbrl_converter_api_endpoint + "?htm-url=" + filing_url + "&token=" + API_KEY
        response = requests.get(final_url)

        # load JSON into memory
        xbrl_json = json.loads(response.text)
    
        # Request the 10-K filing content
        #income_statement = get_income_statement(xbrl_json)

        if response.status_code != 200:
            return jsonify({"error": "Failed to fetch filing"}), 500
        
       
        

        return jsonify({"statementofIncome": format_data_for_chart(xbrl_json["StatementsOfIncome"]), "balanceSheet":xbrl_json["BalanceSheets"], "cashFlow":format_data_for_chart(xbrl_json["StatementsOfCashFlows"])})
        #Response(response.iter_content(chunk_size=1024), content_type="text/plain")
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
# Run Flask Server
if __name__ == "__main__":
    app.run(debug=True)
