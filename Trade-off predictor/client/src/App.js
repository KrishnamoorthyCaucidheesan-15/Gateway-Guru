import React from 'react';
import { Route, Routes } from 'react-router-dom';

import Home from './Home';
import LatencyPredictor from './LatencyPredictor';
import ErrorpercentagePredictor from './ErrorpercentagePredictor';
import TradeoffPredictor from './TradeoffPredictor';

function App() {
	return (
		<div className="container-fluid px-0 pt-4 mt-4">
			{/* This is the alias of BrowserRouter i.e. Router */}
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="latency-Predictor" element={<LatencyPredictor />} />
				<Route path="error-percentage-predictor" element={<ErrorpercentagePredictor />} />
				<Route path="trade-off-predictor" element={<TradeoffPredictor />} />
			</Routes>
		</div>
	);
}

export default App;
