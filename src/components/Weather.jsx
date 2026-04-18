import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Thermometer, Droplets, Wind, CloudSun } from "lucide-react";
import "./weather.css";

const Weather = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [query, setQuery] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const apiKey = import.meta.env.VITE_API_KEY;

 const fetchWeather = async () => {
  // If user deletes the name and hits search/enter
  if (!query.trim()) {
    setData(null); // Clear previous weather data
    setShowAlert(false); // Hide any active alerts
    return;
  }

  setLoading(true);
  setShowAlert(false); 

  try {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&units=metric&appid=${apiKey}`;
    const res = await axios.get(url);
    setData(res.data);
  } catch (err) {
    setShowAlert(true);
    setData(null); // Optional: clear data so the card hides on error
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="responsive-weather-wrapper">
      {/* Immersive Cloud Background */}
      <div className="cloud-overlay"></div>

      <AnimatePresence>
  {showAlert && (
    <motion.div 
      initial={{ opacity: 0 }} // Removed y: -20 to prevent movement
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="custom-glass-alert"
      onClick={() => setShowAlert(false)} // Click to close
      style={{ cursor: 'pointer' }} // Visual hint that it is clickable
    >
      <div className="alert-content">
        <span className="alert-icon">⚠️</span>
        <div className="alert-text">
          <strong>Location Error</strong>
          <p>Click to dismiss this message.</p>
        </div>
      </div>
      {/* Progress bar removed as it no longer auto-hides */}
    </motion.div>
  )}
</AnimatePresence>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-container"
      >
        <h1 className="main-title">Climate Intelligence</h1>

        <div className="search-box">
          <input 
            type="text" 
            placeholder="Search city..." 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
          />
          <button onClick={fetchWeather} disabled={loading} className="search-btn">
            {loading ? "..." : <Search size={20} />}
          </button>
        </div>

        <AnimatePresence mode="wait">
          {data && (
            <motion.div 
              key={data.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="weather-content"
            >
              <div className="main-display">
                <div className="temp-group">
                  <span className="current-temp">{Math.round(data.main.temp)}°</span>
                  <p className="condition">{data.weather[0].description}</p>
                </div>
                <div className="location-group">
                  <CloudSun size={48} className="weather-icon-top" />
                  <h2 className="city-label">{data.name}, {data.sys.country}</h2>
                </div>
              </div>

              <div className="mobile-grid">
                <div className="stat-item">
                  <Thermometer size={20} />
                  <div className="stat-text">
                    <span className="stat-val">{Math.round(data.main.feels_like)}°C</span>
                    <span className="stat-label">Feels Like</span>
                  </div>
                </div>
                <div className="stat-item">
                  <Droplets size={20} />
                  <div className="stat-text">
                    <span className="stat-val">{data.main.humidity}%</span>
                    <span className="stat-label">Humidity</span>
                  </div>
                </div>
                <div className="stat-item">
                  <Wind size={20} />
                  <div className="stat-text">
                    <span className="stat-val">{data.wind.speed}m/s</span>
                    <span className="stat-label">Wind</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Weather;