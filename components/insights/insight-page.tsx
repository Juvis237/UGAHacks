"use client";

import { useState, ChangeEvent } from "react";
import ChartComponent from "../charts/page";
import {
  BarChart,
  Bar,
  LabelList,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Define the types for the selected data
interface Period {
  period: {
    startDate: string;
    endDate: string;
  };
  value: number;
}

interface FieldData {
  name: string; // GAAP Item (e.g., "Assets")
  values: Period[]; // List of periods with values
}

interface ChartProps {
  fieldData: FieldData; // Data for a particular field like "Assets"
}

// Format the data to be used in Recharts

const Insights = () => {
  const [url, setUrl] = useState("");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [firstDropdown, setFirstDropdown] = useState("");
  const [secondDropdown, setSecondDropdown] = useState("");

  // Options for the first dropdown (Category)
  const firstOptions: { [key: string]: string } = {
    "Balance Sheet": "balanceSheet",
    "Cash Flow": "cashFlow",
    "Statement of Income": "statementofIncome",
  };

  interface Option {
    label: string;
    value: string;
  }

  // Options for the second dropdown based on first dropdown selection
  const secondOptions: { [key: string]: Option[] } = {
    balanceSheet: [
      { label: "Assets", value: "Assets" },
      { label: "Current Assets", value: "AssetsCurrent" },
      { label: "Non Current Assets", value: "AssetsNoncurrent" },
    ],
    cashFlow: [
      { label: "Payments of Dividends", value: "PaymentsOfDividends" },
      { label: "Net Income Loss", value: "NetIncomeLoss" },
      {
        label: "Depreciation, Depletion, and Amortization",
        value: "DepreciationDepletionAndAmortization",
      },
    ],
    statementofIncome: [
      { label: "Gross Profit", value: "GrossProfit" },
      { label: "Net Income Loss", value: "NetIncomeLoss" },
      { label: "Operating Expenses", value: "OperatingExpenses" },
      { label: "Revenues", value: "Revenues" },
    ],
  };

  // Handle first dropdown selection
  const handleFirstDropdownChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = event.target.value;
    setFirstDropdown(selectedOption);
    setSecondDropdown(""); // Reset second dropdown when first is changed
  };

  // Handle second dropdown selection
  const handleSecondDropdownChange = (
    event: ChangeEvent<HTMLSelectElement>
  ) => {
    setSecondDropdown(event.target.value);
  };
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
  };

  const fetchInsights = async () => {
    if (!url) {
      alert("Please enter a valid URL!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      setLoading(true); // Ensure loading state is set before fetching

      const response = await fetch("http://127.0.0.1:5000/getUsefulStuff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filing_url: url }),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch 10-K filing. Status: ${response.status}`
        );
      }

      const data = await response.json();
      setResults(data);
      console.log("Collected Data");
      console.log(data);

      setResults(data);
    } catch (err) {
      console.error("Error fetching 10-K:", err);
      setError("Failed to fetch 10-K filing. Please check the URL.");
    } finally {
      setLoading(false);
    }
  };
  const extractProperty = (category: string, property: string) => {
    // If the category is 'balanceSheet', we check for the specific property
    if (
      category === "balanceSheet" &&
      results[category] &&
      results[category][property]
    ) {
      console.log("from extract (balanceSheet)");
      console.log(results[category][property]);
      return results[category][property]; // Return the specific property if it exists
    }

    // For other categories, loop through the array and find the element with the matching 'name' property
    if (results[category]) {
      const matchingItem = results[category].find(
        (item: any) => item.name === property
      );
      if (matchingItem) {
        console.log("from extract (other categories)");
        console.log(matchingItem);
        return matchingItem.values; // Return the item with the matching name property
      }
    }

    console.log("Could not find the pair", { category, property });
    alert("Sorry that combination may not be found in the Archives");
    return null; // Return null or an empty array if the property doesn't exist
  };

  const formatDataForChart = (data: any) => {
    console.log(data);

    // Check if data is null or undefined
    if (data == null) {
      return []; // More user-friendly message
    }

    // Check if data is an array (this assumes the expected data structure is an array)
    if (!Array.isArray(data)) {
      return [];
    }

    // Ensure that each item in the array has the necessary properties ('period' and 'value')
    return data
      .map((item: any) => {
        if (!item.period || !item.value) {
          return null; // Skip any invalid item that does not have 'period' or 'value'
        }

        // Format period as either a 'startDate - endDate' or 'instant'
        const period =
          item.period.instant ||
          `${item.period.startDate} - ${item.period.endDate}`;

        // Return formatted data with value converted to billions of dollars
        return {
          period: period,
          value: Number(item.value) / 1e9, // Convert to billions of dollars
        };
      })
      .filter((item: any) => item !== null); // Filter out any null entries from invalid data points
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center ">
      <div className="bg-white p-2 rounded-lg border-2 border-red-300 shadow-md w-3/4 ">
        <h1 className="text-2xl font-semibold text-center text-gray-900 mb-6">
          Get Insights from 10-K Filing
        </h1>
        {/* First Dropdown */}
        <div className="p-2 flex gap-6">
          <div className="w-1/2">
            <label
              htmlFor="firstDropdown"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Select Category
            </label>
            <select
              id="firstDropdown"
              value={firstDropdown}
              onChange={handleFirstDropdownChange}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a category</option>
              {Object.keys(firstOptions).map((option) => (
                <option key={option} value={firstOptions[option]}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          {/* Second Dropdown */}
          <div className="w-1/2">
            <label
              htmlFor="secondDropdown"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Select Option
            </label>
            <select
              id="secondDropdown"
              value={secondDropdown}
              onChange={handleSecondDropdownChange}
              disabled={!firstDropdown} // Disable if no selection in first dropdown
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-200"
            >
              <option value="">Select an option</option>
              {firstDropdown &&
                secondOptions[firstDropdown].map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <input
          type="text"
          value={url}
          onChange={handleUrlChange}
          placeholder="Enter the URL of the 10-K Filing"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
        />
        <button
          onClick={fetchInsights}
          className={`w-full py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 ${
            loading && "cursor-not-allowed opacity-50"
          }`}
          disabled={loading}
        >
          {loading ? "Loading..." : "Get Insights"}
        </button>

        {error && <div className="text-red-500 mt-4 text-center">{error}</div>}

        {results && (
          <div className="mt-6 space-y-4">
            <ResponsiveContainer width="90%" height={400}>
              <BarChart
                data={formatDataForChart(
                  extractProperty(firstDropdown, secondDropdown)
                )}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis
                  label={{
                    value: "Billions of $",
                    angle: -90,
                    position: "insideLeft",
                  }}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8">
                  <LabelList dataKey="value" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
};

export default Insights;
