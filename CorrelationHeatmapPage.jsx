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
  Paper,
  Tooltip,
} from '@mui/material'
import CorrelationHeatmap from '../components/CorrelationHeatmap'

const STOCKS_API = 'http://20.244.56.144/evaluation-service/stocks'

function CorrelationHeatmapPage() {
  const [stocks, setStocks] = useState({})
  const [minutes, setMinutes] = useState('')
  const [priceHistories, setPriceHistories] = useState({})
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

  const handleFetchPriceHistories = async () => {
    setLoadingPrices(true)
    setError(null)
    setPriceHistories({})
    try {
      const entries = Object.entries(stocks)
      const histories = {}
      for (const [stockName, ticker] of entries) {
        let url = `${STOCKS_API}/${ticker}`
        if (minutes) {
          url += `?minutes=${minutes}`
        }
        const response = await fetch(url)
        if (!response.ok) {
          throw new Error(`Failed to fetch price history for ${stockName}`)
        }
        const data = await response.json()
        histories[stockName] = data.stock || data
      }
      setPriceHistories(histories)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoadingPrices(false)
    }
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Correlation Heatmap
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
            <InputLabel id="minutes-label">Minutes (optional)</InputLabel>
            <TextField
              label="Minutes (optional)"
              type="number"
              fullWidth
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              inputProps={{ min: 1 }}
              sx={{ mb: 2 }}
            />
          </FormControl>

          <Button
            variant="contained"
            onClick={handleFetchPriceHistories}
            disabled={loadingPrices || Object.keys(stocks).length === 0}
          >
            {loadingPrices ? 'Loading...' : 'Get Correlation Heatmap'}
          </Button>

          {Object.keys(priceHistories).length > 0 && (
            <Box mt={4}>
              <CorrelationHeatmap priceHistories={priceHistories} />
            </Box>
          )}
        </>
      )}
    </Container>
  )
}

export default CorrelationHeatmapPage
