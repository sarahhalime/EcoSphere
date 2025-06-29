import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import ForestMonitor from './components/ForestMonitor';
import BiodiversityTracker from './components/BiodiversityTracker';
import CarbonCalculator from './components/CarbonCalculator';
import ClimateAlerts from './components/ClimateAlerts';
import ProjectTracker from './components/ProjectTracker';
import EducationHub from './components/EducationHub';
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
          <Route path="/carbon" element={<CarbonCalculator />} />
          <Route path="/climate" element={<ClimateAlerts />} />
          <Route path="/projects" element={<ProjectTracker />} />
          <Route path="/education" element={<EducationHub />} />
          <Route path="/my-inbox" element={<ChatPage/>} />
        </Routes>
      </Layout>
    </Router>
    </>
  );
}

export default App;