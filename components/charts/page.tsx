import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface Period {
  period: {
    startDate: string;
    endDate: string;
  };
  value: number;
}

interface FormattedData {
  name: string; // The name of the GAAP item (e.g., "Revenue")
  values: Period[]; // List of periods with start/end dates and values
}

interface ChartProps {
  formattedData: FormattedData[]; // Formatted data passed as prop
}

const ChartComponent: React.FC<ChartProps> = ({ formattedData }) => {
  // Format the data to be used in Recharts
  const chartData = formattedData.reduce((acc: any[], item) => {
    item.values.forEach((period, index) => {
      // Add the period value to the corresponding key in the accumulator
      if (!acc[index]) {
        acc[index] = {
          date: `${period.period.startDate} - ${period.period.endDate}`,
        };
      }
      acc[index][item.name] = period.value;
    });
    return acc;
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        {formattedData.map((item, index) => (
          <Line
            key={index}
            type="monotone"
            dataKey={item.name}
            stroke={`hsl(${index * 60}, 100%, 50%)`} // Dynamic color for each line
            activeDot={{ r: 8 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ChartComponent;
