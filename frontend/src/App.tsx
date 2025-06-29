import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ForestMonitor from './components/ForestMonitor';
import BiodiversityTracker from './components/BiodiversityTracker';
import CarbonCalculator from './components/CarbonCalculator';
import ClimateAlerts from './components/ClimateAlerts';

import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';

function App() {
  return (
    <>
      <SignedOut>
        <SignInButton />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>

    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/forest" element={<ForestMonitor />} />
          <Route path="/biodiversity" element={<BiodiversityTracker />} />
          <Route path="/climate" element={<ClimateAlerts />} />
        </Routes>
      </Layout>
    </Router>
    </>
  );
}

export default App;