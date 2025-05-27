import React, { useState } from 'react'
import { Box, Typography, Tooltip } from '@mui/material'

// Helper functions for correlation calculations
function mean(arr) {
  return arr.reduce((sum, val) => sum + val, 0) / arr.length
}

function stdDev(arr, meanVal) {
  const variance = arr.reduce((sum, val) => sum + (val - meanVal) ** 2, 0) / (arr.length - 1)
  return Math.sqrt(variance)
}

function covariance(arrX, meanX, arrY, meanY) {
  let cov = 0
  for (let i = 0; i < arrX.length; i++) {
    cov += (arrX[i] - meanX) * (arrY[i] - meanY)
  }
  return cov / (arrX.length - 1)
}

function pearsonCorrelation(arrX, arrY) {
  if (arrX.length !== arrY.length || arrX.length < 2) return 0
  const meanX = mean(arrX)
  const meanY = mean(arrY)
  const stdX = stdDev(arrX, meanX)
  const stdY = stdDev(arrY, meanY)
  if (stdX === 0 || stdY === 0) return 0
  const cov = covariance(arrX, meanX, arrY, meanY)
  return cov / (stdX * stdY)
}

// Color scale for correlation: -1 (blue) to 0 (white) to 1 (red)
function correlationColor(value) {
  const r = value > 0 ? 255 : Math.round(255 * (1 + value))
  const g = value === 0 ? 255 : Math.round(255 * (1 - Math.abs(value)))
  const b = value < 0 ? 255 : Math.round(255 * (1 - value))
  return `rgb(${r},${g},${b})`
}

function CorrelationHeatmap({ priceHistories }) {
  const stockNames = Object.keys(priceHistories)
  const n = stockNames.length

  // Extract price arrays aligned by index (assuming time alignment)
  const pricesByStock = stockNames.map((name) =>
    priceHistories[name].map((entry) => entry.price)
  )

  // Calculate correlation matrix
  const correlationMatrix = Array(n)
    .fill(null)
    .map(() => Array(n).fill(0))

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      correlationMatrix[i][j] = pearsonCorrelation(pricesByStock[i], pricesByStock[j])
    }
  }

  // Calculate average and std dev for each stock
  const stats = pricesByStock.map((prices) => {
    const avg = mean(prices)
    const sd = stdDev(prices, avg)
    return { avg, sd }
  })

  return (
    <Box sx={{ overflowX: 'auto' }}>
      <Typography variant="subtitle1" gutterBottom>
        Correlation Heatmap (Pearson's Coefficient)
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: `150px repeat(${n}, 50px)`,
          gridAutoRows: '50px',
          alignItems: 'center',
          justifyItems: 'center',
          border: '1px solid #ccc',
        }}
      >
        {/* Top-left empty cell */}
        <Box />
        {/* Column headers */}
        {stockNames.map((name, idx) => (
          <Tooltip
            key={name}
            title={
              <>
                <div>{name}</div>
                <div>Avg: {stats[idx].avg.toFixed(2)}</div>
                <div>Std Dev: {stats[idx].sd.toFixed(2)}</div>
              </>
            }
          >
            <Box sx={{ fontWeight: 'bold', cursor: 'default' }}>{name}</Box>
          </Tooltip>
        ))}

        {/* Rows */}
        {stockNames.map((rowName, rowIndex) => (
          <React.Fragment key={rowName}>
            {/* Row header */}
            <Tooltip
              title={
                <>
                  <div>{rowName}</div>
                  <div>Avg: {stats[rowIndex].avg.toFixed(2)}</div>
                  <div>Std Dev: {stats[rowIndex].sd.toFixed(2)}</div>
                </>
              }
            >
              <Box sx={{ fontWeight: 'bold', cursor: 'default' }}>{rowName}</Box>
            </Tooltip>
            {/* Correlation cells */}
            {correlationMatrix[rowIndex].map((value, colIndex) => (
              <Tooltip key={colIndex} title={value.toFixed(3)}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    backgroundColor: correlationColor(value),
                    border: '1px solid #999',
                    borderRadius: '4px',
                  }}
                />
              </Tooltip>
            ))}
          </React.Fragment>
        ))}
      </Box>

      {/* Color legend */}
      <Box sx={{ mt: 2, display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            width: 100,
            height: 20,
            background: 'linear-gradient(to right, blue, white, red)',
            border: '1px solid #999',
            borderRadius: '4px',
            mr: 1,
          }}
        />
        <Typography variant="body2">Correlation: -1 (blue) to 0 (white) to 1 (red)</Typography>
      </Box>
    </Box>
  )
}

export default CorrelationHeatmap
