import React, { useState, useEffect } from 'react'
import {
  Container,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Box,
  CircularProgress,
} from '@mui/material'
import StockChart from '../components/StockChart'

const STOCKS_API = 'http://20.244.56.144/evaluation-service/stocks'

function StockPage() {
  const [stocks, setStocks] = useState({})
  const [selectedStock, setSelectedStock] = useState('')
  const [minutes, setMinutes] = useState('')
  const [priceHistory, setPriceHistory] = useState(null)
  const [loadingStocks, setLoadingStocks] = useState(false)
  const [loadingPrices, setLoadingPrices] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchStocks() {
      setLoadingStocks(true)
      setError(null)
      try {
        const response = await fetch(STOCKS_API)
        if (!response.ok) {
          throw new Error('Failed to fetch stocks')
        }
        const data = await response.json()
        setStocks(data.stocks)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoadingStocks(false)
      }
    }
    fetchStocks()
  }, [])

  const handleFetchPriceHistory = async () => {
    if (!selectedStock) return
    setLoadingPrices(true)
    setError(null)
    setPriceHistory(null)
    try {
      let url = `${STOCKS_API}/${stocks[selectedStock]}`
      if (minutes) {
        url += `?minutes=${minutes}`
      }
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error('Failed to fetch price history')
      }
      const data = await response.json()
      setPriceHistory(data.stock || data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingPrices(false)
    }
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Stock Price Chart
      </Typography>

      {loadingStocks ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="stock-select-label">Select Stock</InputLabel>
            <Select
              labelId="stock-select-label"
              value={selectedStock}
              label="Select Stock"
              onChange={(e) => setSelectedStock(e.target.value)}
            >
              {Object.keys(stocks).map((stockName) => (
                <MenuItem key={stockName} value={stockName}>
                  {stockName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            label="Minutes (optional)"
            type="number"
            fullWidth
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
            sx={{ mb: 3 }}
            inputProps={{ min: 1 }}
          />

          <Button
            variant="contained"
            onClick={handleFetchPriceHistory}
            disabled={!selectedStock || loadingPrices}
          >
            {loadingPrices ? 'Loading...' : 'Get Price History'}
          </Button>

          {priceHistory && Array.isArray(priceHistory) && priceHistory.length > 0 && (
            <Box mt={4}>
              <StockChart data={priceHistory} />
            </Box>
          )}
        </>
      )}
    </Container>
  )
}

export default StockPage
