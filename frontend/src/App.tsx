import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ForestMonitor from './components/ForestMonitor';
import BiodiversityTracker from './components/BiodiversityTracker';
import CarbonCalculator from './components/CarbonCalculator';
import ClimateAlerts from './components/ClimateAlerts';

import ChatPage from './components/Chat/ChatPage';
function App() {

  return (
    <>

    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/forest" element={<ForestMonitor />} />
          <Route path="/biodiversity" element={<BiodiversityTracker />} />
          <Route path="/climate" element={<ClimateAlerts />} />
          <Route path="/my-inbox" element={<ChatPage/>} />
        </Routes>
      </Layout>
    </Router>
    </>
  );
}

export default App;