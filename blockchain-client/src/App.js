import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import BlockChainPage from "./pages/blockChainPage/BlockChainPage.jsx";
import ChainDisplay from "./pages/chainDisplay/ChainDisplay";

function App() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Router>
        <Routes>
          <Route path="/" Component={BlockChainPage}/>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
