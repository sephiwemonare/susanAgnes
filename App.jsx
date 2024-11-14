import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import Dashboard from './Dashboard';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import UserManagement from './UserManagement';
import SignIn from './SignIn'; 
import Login from './Login';
import Logout from './Logout';
import './App.css';
import { saveToLocalStorage, getFromLocalStorage, removeFromLocalStorage } from './LocalStorageHelper';

function App() {
  const [user, setUser] = useState(getFromLocalStorage('currentUser'));
  const [isSignUp, setIsSignUp] = useState(true);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    const currentUser = getFromLocalStorage('currentUser');
    setUser(currentUser);
  }, []);

  const handleSignIn = (newUser) => {
    saveToLocalStorage('currentUser', newUser);
    setIsSignUp(false);
  };

  const handleLogin = (loggedInUser) => {
    saveToLocalStorage('currentUser', loggedInUser);
    setUser(loggedInUser);
  };

  const handleLogout = () => {
    setUser(null);
    removeFromLocalStorage('currentUser'); 
  };

  const refreshData = () => {
    setRefresh(!refresh);
  };

  const goToSignUp = () => {
    setIsSignUp(true);
  };

  const goToLogin = () => {
    setIsSignUp(false); // Switch to Login view
  };

  return (
    <Router>
      <div className="App">
        <header>
          <h1>Susan Stock Inventory System</h1>
        </header>

        {!user ? (
          <div>
            {isSignUp ? (
              <SignIn onSignIn={handleSignIn} goToLogin={goToLogin} />
            ) : (
              <Login onLogin={handleLogin} goToSignUp={goToSignUp} />
            )}
          </div>
        ) : (
          <div>
            <Logout onLogout={handleLogout} />
            {/* Navigation Links */}
            <nav>
              <ul>
                <li><Link to="/">Dashboard</Link></li>
                <li><Link to="/product-form">Adding new Products</Link></li>
                <li><Link to="/product-list">current products</Link></li>
                <li><Link to="/user-management">User Management</Link></li>
              </ul>
            </nav>

            <div className="main-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/product-form" element={<ProductForm onFormSubmit={refreshData} />} />
                <Route path="/product-list" element={<ProductList />} />
                <Route path="/user-management" element={<UserManagement />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
