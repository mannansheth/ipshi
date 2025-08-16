"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import "../styles/Home.css"

const Home = () => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={`home ${mounted ? "mounted" : ""}`}>
      <div className="background-hearts">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="heart"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          >
            💖
          </div>
        ))}
      </div>

      <div className="home-content">
        <h1 className="main-title">Happy Birthday Ipshi</h1>
        <p className="subtitle">A website made just for you ✨</p>

        <div className="navigation-cards">
          <Link to="/photos" className="nav-card photos-theme">
            <div className="card-icon">📸</div>
            <h3>Our Memories</h3>
            <p>A film strip of our beautiful moments</p>
          </Link>

          <Link to="/stars" className="nav-card stars-theme">
            <div className="card-icon">⭐</div>
            <h3>Your Birth Sky</h3>
            <p>The stars from August 18, 2006</p>
          </Link>
        </div>

        <div className="countdown">
          <p>Made with all my love 💕</p>
        </div>
      </div>
    </div>
  )
}

export default Home
