import React from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { Typography } from '@mui/material'

function StockChart({ data }) {
  if (!data || data.length === 0) {
    return <Typography>No data available for chart</Typography>
  }

  // Calculate average price
  const avgPrice =
    data.reduce((sum, entry) => sum + entry.price, 0) / data.length

  // Format data for chart (convert lastUpdatedAt to readable time)
  const chartData = data.map((entry) => ({
    price: entry.price,
    time: new Date(entry.lastUpdatedAt).toLocaleTimeString(),
  }))

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis domain={['auto', 'auto']} />
        <Tooltip />
        <Legend />
        <ReferenceLine y={avgPrice} label={`Avg: ${avgPrice.toFixed(2)}`} stroke="red" strokeDasharray="3 3" />
        <Line type="monotone" dataKey="price" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default StockChart
