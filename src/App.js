import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import BirthdayCard from "./pages/BirthdayCard"
import PhotoGallery from "./pages/PhotoGallery"
import StarryNight from "./pages/StarryNight"
import "./App.css"
import { useEffect } from "react"
import Login from "./pages/Login"

function App() {
  useEffect(() => {
    if (localStorage.getItem("code") !== "180421" && window.location.pathname==="/") {
      window.location.href = "login";
    }
  }, [])
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/card" element={<BirthdayCard />} />
          <Route path="/photos" element={<PhotoGallery />} />
          <Route path="/stars" element={<StarryNight />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
