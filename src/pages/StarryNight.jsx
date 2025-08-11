"use client"

import React, {
  lazy,
  Suspense,
  useEffect,
  useState,
  useRef,
} from "react"
import { Link } from "react-router-dom"
import "../styles/StarryNight.css"
import { FaSalesforce, FaStar, FaStarOfLife } from 'react-icons/fa';
import { CSSTransition } from 'react-transition-group';

const MoonEmbed = lazy(() => import("../components/MoonEmbed"))

// Intersection Observer hook
function useOnScreen(ref, rootMargin = "0px") {
  const [isIntersecting, setIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIntersecting(entry.isIntersecting),
      { rootMargin }
    )
    if (ref.current) observer.observe(ref.current)

    return () => {
      if (ref.current) observer.unobserve(ref.current)
    }
  }, [ref, rootMargin])

  return isIntersecting
}
const polygonPoints = ["30,215 40,240 15,225 45,225 24,240",
                  "110,125 120,150 95,135 125,135 104,150",
                  "120,185 130,210 105,195 135,195 114,210",
                  "260,175 270,200 245,185 275,185 254,200",
                  "255,130 265,155 240,140 270,140 249,155",
                  "210,110 220,135 195,120 225,120 204,135",
                  "205,70 215,95 190,80 220,80 199,95",
                  "250,15 260,40 235,25 265,25 244,40",
                  "280,50 290,75 265,60 295,60 274,75"
                  ]
const StarryNight = () => {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [currentPanel, setCurrentPanel] = useState(0)
  const [showLeoConstellation, setShowLeoConstellation] = useState(false)
  const [showMoonPhase, setShowMoonPhase] = useState(false)
  const [showShootingStar, setShowShootingStar] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [visibleCount, setVisibleCount] = useState(0);
  const [isStartSpawned, setIsStarSpawned] = useState(false);
  useEffect(() => {
    if (showLeoConstellation) {
      if (visibleCount < polygonPoints.length) {
      const timer = setTimeout(() => {
        setVisibleCount(visibleCount + 1);
      }, 300); // 100ms delay per polygon
      setTimeout(() => {
        setIsStarSpawned(true);
      },polygonPoints.length*300+1000)
      return () => clearTimeout(timer);
    }
    } else {
      setVisibleCount(0);
      setIsStarSpawned(false);
    }
    
  }, [visibleCount, showLeoConstellation]);
  const containerRef = useRef(null)

  // Create refs for each panel
  const introRef = useRef(null)
  const skyRef = useRef(null)
  const leoRef = useRef(null)
  const moonRef = useRef(null)
  const finaleRef = useRef(null)

  // Check visibility for all panels
  const introVisible = useOnScreen(introRef, "-100px")
  const skyVisible = useOnScreen(skyRef, "-100px")
  const leoVisible = useOnScreen(leoRef, "-100px")
  const moonVisible = useOnScreen(moonRef, "-100px")
  const finaleVisible = useOnScreen(finaleRef, "-100px")

  const panels = [
    { id: 0, title: "The Night You Were Born", subtitle: "August 18, 2006 • 1:45 AM" },
    { id: 1, title: "The Stars Aligned", subtitle: "Tap to see the sky from that moment" },
    { id: 2, title: "Leo Season", subtitle: "Tap to reveal your constellation" },
    { id: 3, title: "The Moon's Blessing", subtitle: "Tap to see the moon phase" },
    { id: 4, title: "A Shooting Star", subtitle: "For the wish that came true" },
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date()
      setCurrentTime(now)

      if (isBirthdayTime()) {
        if (currentPanel === 4) {
          setShowShootingStar(true)
          setTimeout(() => setShowMessage(true), 2000)
        }
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [currentPanel])

  useEffect(() => {
    let scrollTimeout = null

    const handleScroll = () => {
      if (!containerRef.current) return
      const timeDisplay = document.querySelector(".time-display")
      if (!timeDisplay) return

      timeDisplay.classList.add("collapse")

      if (scrollTimeout) clearTimeout(scrollTimeout)

      scrollTimeout = setTimeout(() => {
        timeDisplay.classList.remove("collapse")
      }, 1000)

      const scrollTop = containerRef.current.scrollTop
      const windowHeight = window.innerHeight
      const newPanel = Math.floor(scrollTop / windowHeight)

      if (newPanel !== currentPanel && newPanel >= 0 && newPanel < panels.length) {
        setCurrentPanel(newPanel)

        if (newPanel !== 2) setShowLeoConstellation(false)
        if (newPanel !== 3) setShowMoonPhase(false)
        if (newPanel !== 4) {
          setShowShootingStar(false)
          setShowMessage(false)
        }
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener("scroll", handleScroll)
      document.querySelector(".time-display")?.classList.remove("collapse")

      return () => {
        container.removeEventListener("scroll", handleScroll)
        if (scrollTimeout) clearTimeout(scrollTimeout)
      }
    }
  }, [currentPanel, panels.length])

  const handlePanelTap = () => {
    switch (currentPanel) {
      case 2:
        setShowLeoConstellation(!showLeoConstellation)
        break
      case 3:
        setShowMoonPhase(!showMoonPhase)
        break
      case 4:
        setShowShootingStar(true)
        setTimeout(() => {setShowMessage(true); setShowShootingStar(false);}, 10000)
        break
    }
  }

  const formatTime = (date) => {
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const isBirthdayTime = () => {
    return (
      currentTime.getMonth() === 7 &&
      currentTime.getDate() === 9 &&
      currentTime.getHours() === 21 &&
      currentTime.getMinutes() === 32
    )
  }

  return (
    <div className="starry-story-container" ref={containerRef}>
      <Link to="/" className="back-button">
        ← Back
      </Link>
      <div className="time-display">
        <h2>Current Time</h2>
        <p className={isBirthdayTime() ? "birthday-time" : ""}>{formatTime(currentTime)}</p>
        {isBirthdayTime() && <p className="special-moment">✨ It's your special moment! ✨</p>}
      </div>

      {/* Panel 1: Introduction */}
      <div
        className={`story-panel panel-intro ${introVisible ? "fade-in" : "fade-out"}`}
        ref={introRef}
      >
        <div className="panel-content">
          <div className="intro-text">
            <h1 className="story-title">The Night You Were Born</h1>
            <p className="story-date">August 18, 2006 • 1:45 AM</p>
            <p className="story-subtitle">
              The universe held its breath as the most beautiful star was born
            </p>
          </div>
          <div className="scroll-hint">
            <span>Scroll to begin the story</span>
            <div className="scroll-arrow">↓</div>
          </div>
        </div>
        <div className="dark-overlay"></div>
      </div>

      {/* Panel 2: Sky Image */}
      <div
        className={`story-panel panel-sky ${skyVisible ? "fade-in" : "fade-out"}`}
        ref={skyRef}
      >
        <div className="sky-image-container">
          <img
            src="/images/sky_image.png"
            alt="The sky on August 18, 2006"
            className="sky-image"
          />
          <div className="sky-overlay"></div>
        </div>
        <div className="panel-content">
          <h2 className="panel-title">The Stars Aligned</h2>
          <p className="panel-text">
            This is exactly how the sky looked when you took your first breath. Every star was perfectly placed, as
            if the cosmos knew something magical was about to happen.
          </p>
        </div>
      </div>

      {/* Panel 3: Leo Constellation */}
      <div className="story-panel panel-leo" onClick={handlePanelTap}>
        <div className="constellation-container">
          <img src="/images/sky_image.png" alt="Leo constellation" className="constellation-bg" />
          {showLeoConstellation && (
            <div className="leo-constellation">
              <div className="constellation-lines">
                <svg width="400" height="500" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Lines for Leo */}
                  {isStartSpawned && 
                  <>
                  <line x1="30" y1="230" x2="110" y2="140" stroke="#ffd700" strokeWidth="2" filter="url(#glow)" />
                  <line x1="30" y1="230" x2="120" y2="200" stroke="#ffd700" strokeWidth="2" filter="url(#glow)" />
                  <line x1="120" y1="200" x2="260" y2="190" stroke="#ffd700" strokeWidth="2" filter="url(#glow)" />
                  <line x1="260" y1="190" x2="255" y2="140" stroke="#ffd700" strokeWidth="2" filter="url(#glow)" />
                  <line x1="255" y1="140" x2="210" y2="120" stroke="#ffd700" strokeWidth="2" filter="url(#glow)" />
                  <line x1="110" y1="140" x2="210" y2="120" stroke="#ffd700" strokeWidth="2" filter="url(#glow)" />
                  <line x1="205" y1="80" x2="210" y2="120" stroke="#ffd700" strokeWidth="2" filter="url(#glow)" />
                  <line x1="205" y1="80" x2="250" y2="30" stroke="#ffd700" strokeWidth="2" filter="url(#glow)" />
                  <line x1="280" y1="65" x2="250" y2="30" stroke="#ffd700" strokeWidth="2" filter="url(#glow)" />
                  </>}
                  
                  

                  {/* Stars - Bigger size */}
                  {polygonPoints.slice(0, visibleCount).map((point, idx) => (
      <polygon key={idx} points={point} fill="#fff099ff" filter="url(#glow)" className="heartbeat-glow"  />
    ))}
                  

                </svg>


              </div>
            </div>
          )}
        </div>
        <div className="panel-content">
          <h2 className="panel-title">Leo Season ♌</h2>
          <p className="panel-text">
            {showLeoConstellation
              ? "Born under the sign of the Lion - brave, passionate, and radiant. Just like you."
              : "Tap to reveal your constellation"}
          </p>
          {!showLeoConstellation && <div className="tap-hint">👆 Tap anywhere</div>}
        </div>
      </div>

      {/* Panel 4: Moon Phase */}
      <div
        className={`story-panel panel-moon ${moonVisible ? "fade-in" : "fade-out"}`}
        onClick={handlePanelTap}
        ref={moonRef}
      >
        <div className="moon-container">
          <div className={`moon-phase ${showMoonPhase ? "revealed" : ""}`}>
            <img
              src="/images/waning-2.png"
              alt="Moon phase on your birth night"
              className="moon-image"
            />
            <label>Udaipur, India</label>
            <label>1:45 AM | 18th August, 2025.</label>
            {showMoonPhase && <div className="moon-glow"></div>}

            {!showMoonPhase && currentPanel >= 3 &&
            <CSSTransition
              in={!showMoonPhase}
              timeout={500}
              classNames="fade"
              unmountOnExit
            >
              <div className="moon">
                <Suspense fallback={<div>Loading Moon...</div>}>
                  <MoonEmbed />
                </Suspense>
              </div>
            </CSSTransition>
             
            }
             

          </div>
        </div>
        <div className="panel-content">
          <h2 className="panel-title">The Moon's Blessing</h2>
          <p className="panel-text">
            {showMoonPhase
              ? "The moon was waning, making space for new beginnings. It knew you were coming."
              : "Tap to see the moon phase from that night"}
          </p>
          {!showMoonPhase && <div className="tap-hint">👆 Tap to reveal</div>}
        </div>
      </div>

      {/* Panel 5: Shooting Star & Message */}
      <div
        className={`story-panel panel-finale ${finaleVisible ? "fade-in" : "fade-out"}`}
        onClick={handlePanelTap}
        ref={finaleRef}
      >
        <div className="finale-sky">
          {showShootingStar && (
            <div className="shooting-star-container">
              <div className="shooting-star"></div>
              <FaStar className="star-trail"></FaStar>
            </div>
          )}
        </div>

        {showMessage && (
          <div className="love-message">
            <div className="message-content">
              <h2>✨ My Shooting Star ✨</h2>
              <p>
                On this exact moment, 18 years ago, you streaked into my universe like the most beautiful shooting star.
                You lit up everything around you and made all my wishes come true.
              </p>
              <p>
                Every night since then, I look up at the stars and think of you. You are my constellation, my moon, my
                entire night sky.
              </p>
              <p className="birthday-wish">
                Happy Birthday, my beautiful star. May this new year bring you all the magic you bring to my world.
              </p>
              <p className="signature">Forever yours, under these same stars 🌟</p>
              {isBirthdayTime() && <div className="special-moment">🎉 It's exactly 1:45 AM on August 18th! 🎉</div>}
            </div>
          </div>
        )}

        {!showShootingStar && (
          <div className="panel-content">
            <h2 className="panel-title">A Shooting Star</h2>
            <p className="panel-text">
              {isBirthdayTime() ? "It's time! Make a wish..." : "Tap to make a wish come true"}
            </p>
            {!isBirthdayTime() && <div className="tap-hint" onClick={() => setShowShootingStar(true)}>👆 Tap for magic</div>}
          </div>
        )}
      </div>
    </div>
  )
}

export default StarryNight
