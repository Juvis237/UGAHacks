import { useState, ChangeEvent, useEffect } from "react";
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

const HAInsights = () => {
  const [url, setUrl] = useState("");
  const [url2, setUrl2] = useState("");
  const [results, setResults] = useState<any>(null);
  const [results2, setResults2] = useState<any>(null);
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

  // Options for the second dropdown based on first dropdown selection
  const secondOptions: { [key: string]: { label: string; value: string }[] } = {
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

  // Helper function to format data for chart comparison
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

  const handleUrl2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl2(e.target.value);
  };

  const fetchInsights = async () => {
    if (!url || !url2) {
      alert("Please enter valid URLs for both companies!");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      setLoading(true); // Ensure loading state is set before fetching

      // Fetch data for Company 1
      const response1 = await fetch("http://127.0.0.1:5000/getUsefulStuff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filing_url: url }),
      });

      if (!response1.ok) {
        throw new Error(
          `Failed to fetch data for company 1. Status: ${response1.status}`
        );
      }
      const data1 = await response1.json();
      setResults(data1);

      // Fetch data for Company 2
      const response2 = await fetch("http://127.0.0.1:5000/getUsefulStuff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ filing_url: url2 }),
      });

      if (!response2.ok) {
        throw new Error(
          `Failed to fetch data for company 2. Status: ${response2.status}`
        );
      }
      const data2 = await response2.json();
      setResults2(data2);
      //console.log(data1);
      //console.log(data2);
    } catch (err) {
      console.error("Error fetching 10-K:", err);
      setError("Failed to fetch 10-K filing. Please check the URLs.");
    } finally {
      setLoading(false);
    }
  };

  // Extract property function to handle the logic of extracting the data for a specific category and property

  const extractProperty = (category: string, property: string, data: any) => {
    // If the category is 'balanceSheet', we check for the specific property
    if (data !== null) {
      if (
        category === "balanceSheet" &&
        data[category] &&
        data[category][property]
      ) {
        console.log("from extract (balanceSheet)");
        console.log(data[category][property]);
        return data[category][property]; // Return the specific property if it exists
      }

      // For other categories, loop through the array and find the element with the matching 'name' property
      if (data[category]) {
        const matchingItem = data[category].find(
          (item: any) => item.name === property
        );
        if (matchingItem) {
          console.log("from extract (other categories)");
          console.log(matchingItem);
          return matchingItem.values; // Return the item with the matching name property
        }
      }

      console.log("Could not find the pair", { category, property });
      //alert("Sorry that combination may not be found in the Archives");
      return null;
    }
    // Return the specific property if it exists
  };

  // Function to compare the selected field data for both companies
  const compareData = (category: string, property: string) => {
    const company1Data = extractProperty(category, property, results);
    const company2Data = extractProperty(category, property, results2);

    return {
      company1: formatDataForChart(company1Data),
      company2: formatDataForChart(company2Data),
    };
  };

  //https://www.sec.gov/Archives/edgar/data/1300514/000130051425000040/lvs-20241231.htm

  //https://www.sec.gov/Archives/edgar/data/320193/000032019324000123/aapl-20240928.htm

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold text-center text-gray-900 mb-6">
        Horizontal Analysis
      </h1>

      <div>
        <input
          type="text"
          value={url}
          onChange={handleUrlChange}
          placeholder="Enter the URL of the 10-K Filing"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
        />
        <input
          type="text"
          value={url2}
          onChange={handleUrl2Change}
          placeholder="Enter the Second Companies Information"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 mb-4"
        />
      </div>

      {error && <p>{error}</p>}

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

      <button
        onClick={fetchInsights}
        className={`w-full py-2 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 ${
          loading && "cursor-not-allowed opacity-50"
        }`}
        disabled={loading}
      >
        {loading ? "Loading..." : "Get Insights"}
      </button>
      {results && (
        <ResponsiveContainer width="90%" height={400}>
          <BarChart data={compareData(firstDropdown, secondDropdown).company1}>
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
            <Bar dataKey="value" fill="#8884d8" name="Company 1" />
          </BarChart>
        </ResponsiveContainer>
      )}

      {results2 && (
        <ResponsiveContainer width="90%" height={400}>
          <BarChart data={compareData(firstDropdown, secondDropdown).company2}>
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
            <Bar dataKey="value" fill="#82ca9d" name="Company 2" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default HAInsights;
