import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Home from "./pages/Home"
import BirthdayCard from "./pages/BirthdayCard"
import PhotoGallery from "./pages/PhotoGallery"
import StarryNight from "./pages/StarryNight"
import "./App.css"

function App() {
  
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/card" element={<BirthdayCard />} />
          <Route path="/photos" element={<PhotoGallery />} />
          <Route path="/stars" element={<StarryNight />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
