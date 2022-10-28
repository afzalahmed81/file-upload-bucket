// import Home from "./components/home";
import Products from "./components/products";
// import About from "./components/about";
import Login from "./components/login";
import Signup from "./components/signup";
import NavBar from "./components/navbar";

import './App.css';

import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";



function App() {
  return (
    <Router>
      
        <NavBar />

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Routes>

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* <Route path="/about" element={<About />} /> */}
          <Route path="/products" element={<Products />} />
          <Route path="/" element={<Signup />} />

        </Routes>
    
    </Router>
  );
}

export default App;