"use client"

import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import "../styles/Home.css"
import { FaHeart, FaSun, FaFilm } from "react-icons/fa"
import { FaCalendar } from "react-icons/fa6"

const Home = ({isBirthdayTime, ready}) => {
  const [mounted, setMounted] = useState(false)
  const [displayGalleryError, setDisplayGalleryError] = useState(false)
  const [displayStarsError, setDisplayStarsError] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])
  const heartStyles = useMemo(() => {
    return Array.from({ length: 40 }).map(() => ({
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      animationDuration: `${3 + Math.random() * 2}s`,
    }));
  }, []);
  
  return (
    <div className={`home ${mounted ? "mounted" : ""}`}>
      <div className="background-hearts">
        {heartStyles.slice(0,20).map((style, i) => (
          <div key={i} className="heart" style={style}>
            💖
          </div>
        ))}
      </div>
      <div className="background-hearts">
        {heartStyles.slice(21, 40).map((style, i) => (
          <div key={i} className="heart" style={style}>
            🌻
          </div>
        ))}
      </div>

      <div className="home-content">
        <h1 className="main-title">Happy Birthday Ipshi</h1>
        <h2 className="subtitle">You are the boss my love</h2>
        {/* <p className="subtitle">A website made just for you ✨</p> */}
        
        <div className="navigation-cards">
          <Link to="/timeline" className="nav-card photos-theme">
            <div className="card-icon">📅</div>
            <h3>Our timeline</h3>
            <p>All our memories by date</p>
          </Link>

          <Link to="/valentines" className="nav-card photos-theme">
            <div className="card-icon"><FaHeart color="red" className="valentinesIcon"/></div>
            <h3>Valentines</h3>
            <p>His and her valentines' proposal</p>
          </Link>

          <Link to="/photos" className="nav-card photos-theme">
            <div className="card-icon">📸</div>
            <h3>Our Memories</h3>
            <p>A film strip of our beautiful moments</p>
          </Link>
          <Link to="/montage" className="nav-card photos-theme">
            <div className="card-icon"><FaFilm color="#b184a0" /></div>
            <h3>Our little reel room</h3>
            <p>Choose a film and replay our memories</p>
          </Link>
          {/* {new Date().getDate() >=18 ?
          <Link to="/photos" className="nav-card photos-theme">
            <div className="card-icon">📸</div>
            <h3>Our Memories</h3>
            <p>A film strip of our beautiful moments</p>
          </Link>
          :
          <div onClick={() => {
              setDisplayGalleryError(true);
              setTimeout(() => {
                setDisplayGalleryError(false);
              }, 3000)
            }
          } className="nav-card photos-theme">
            <div className="card-icon">📸</div>
            <h3>Our Memories</h3>
            <p>A film strip of our beautiful moments</p>
          </div>
        } */}
          <Link to="/stars" className="nav-card stars-theme">
            <div className="card-icon">⭐</div>
            <h3>Your Birth Sky</h3>
            <p>The stars from August 18, 2006</p>
          </Link>
          
        
        </div>
        
        <div className={`error-message gallery ${displayGalleryError ? 'revealed':""}`}> 
          <p>Page will open in {Math.floor((new Date(2025, 7, 18, 0, 0) - new Date()) / 60000 )  
          } mins</p>
          {!ready && 
            "Go connect spotify and chill"
          }
          </div>
        <div className={`error-message stars ${displayStarsError ? 'revealed':""}`}> 
          <p>Page will open in {Math.floor((new Date(2025, 7, 18, 1, 43) - new Date()) / 60000) 
          } mins</p>
          {!ready && 
            "Go connect spotify and chill"
          }
          </div>
        <div className="countdown">
          <p>Made with love by Mone💕</p>
        </div>
      </div>
        
    </div>
  )
}

export default Home
