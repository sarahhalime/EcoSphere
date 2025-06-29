import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ForestMonitor from './components/ForestMonitor';
import BiodiversityTracker from './components/BiodiversityTracker';
import CarbonCalculator from './components/CarbonCalculator';
import ClimateAlerts from './components/ClimateAlerts';
import EcoAI from './components/EcoAI';

import ChatPage from './components/Chat/ChatPage';
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

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
          <Route path="/ecoai" element={<EcoAI />} />
            <Route path="/my-inbox" element={<ChatPage/>} />
        </Routes>
      </Layout>
    </Router>
    </>
  );
}

export default App;