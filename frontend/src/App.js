import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import MovieList from './pages/MovieList';
import MovieDetail from './pages/MovieDetail';
import ReviewForm from './pages/ReviewForm';
import UserProfile from './pages/UserProfile';
import Header from './components/Header';
import Footer from './components/Footer';
import './styles/App.css';

function App() {
  return (
    <Router>
  <Header />
      <main className="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/movies" element={<MovieList />} />
          <Route path="/movies/:id" element={<MovieDetail />} />
          <Route path="/review/:movieId" element={<ReviewForm />} />
          <Route path="/profile/:id" element={<UserProfile />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  );
}

export default App;
