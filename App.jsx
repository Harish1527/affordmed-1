import React from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { AppBar, Toolbar, Typography, Tabs, Tab, Box } from '@mui/material'
import StockPage from './pages/StockPage'
import CorrelationHeatmapPage from './pages/CorrelationHeatmapPage'

function App() {
  const [tabValue, setTabValue] = React.useState(0)

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Stock Price Aggregation
          </Typography>
          <Tabs value={tabValue} onChange={handleTabChange} textColor="inherit" indicatorColor="secondary">
            <Tab label="Stock Page" component={Link} to="/" />
            <Tab label="Correlation Heatmap" component={Link} to="/correlation" />
          </Tabs>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 3 }}>
        <Routes>
          <Route path="/" element={<StockPage />} />
          <Route path="/correlation" element={<CorrelationHeatmapPage />} />
        </Routes>
      </Box>
    </Router>
  )
}

export default App
