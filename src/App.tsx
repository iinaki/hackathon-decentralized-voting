import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

// import './App.css';
// import TabsRouter from './components/TabsRouter';

import Login from './components/Login';
import Home from './components/Home';
import Vote from './components/Vote';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/DVote/home" />} />
      <Route path="/DVote/home" element={<Home />} />
      <Route path="/DVote/vote" element={<Vote />} />
    </Routes>
    // <TabsRouter />
  );
};

export default App;

