"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import "../styles/BirthdayCard.css"

const BirthdayCard = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [showMessage, setShowMessage] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setShowMessage(true), 800)
    } else {
      setShowMessage(false)
    }
  }, [isOpen])

  return (
    <div className="birthday-card-page">
      <Link to="/" className="back-button">
        ← Back Home
      </Link>

      <div className="card-container">
        <div className={`birthday-card ${isOpen ? "open" : ""}`}>
          <div className={`card-front ${isOpen ? "open" : ""}`}>
            <div className="card-decorations">
              {[...Array(15)].map((_, i) => (
                <div
                  key={i}
                  className="sparkle"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                >
                  ✨
                </div>
              ))}
            </div>
            <h2>Happy Birthday!</h2>
            <p>Click to open your special card</p>
            <div className="cake-icon">🎂</div>
          </div>

          <div className={`card-inside ${!isOpen ? "notopen" : ""}`}>
            <div className="left-panel">
              <div className="birthday-message">
                {showMessage && (
                  <>
                    <h3>My Dearest Love,</h3>
                    <p>
                      On this special day, I want you to know how much you mean to me. Every moment with you is a gift,
                      every smile you share lights up my world.
                    </p>
                    <p>
                      You are my sunshine, my inspiration, and my greatest blessing. I'm so grateful to celebrate
                      another year of your beautiful existence.
                    </p>
                    <p className="signature">
                      Happy Birthday, Beautiful! 💕<br />
                      With all my love,
                      <br />
                      Forever yours
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="right-panel">
              <div className="birthday-animation">
                <div className="balloons">
                  <div className="balloon balloon-1">🎈</div>
                  <div className="balloon balloon-2">🎈</div>
                  <div className="balloon balloon-3">🎈</div>
                </div>
                <div className="confetti">
                  {[...Array(20)].map((_, i) => (
                    <div
                      key={i}
                      className="confetti-piece"
                      style={{
                        left: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 3}s`,
                        backgroundColor: ["#ff6b6b", "#4ecdc4", "#45b7d1", "#f9ca24", "#f0932b"][
                          Math.floor(Math.random() * 5)
                        ],
                      }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <button className="card-toggle" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "Close Card" : "Open Card"}
        </button>
      </div>
    </div>
  )
}

export default BirthdayCard
