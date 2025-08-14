"use client"

import { useEffect, useState, useRef } from "react"
import { Link } from "react-router-dom"
import "../styles/PhotoGallery.css"
import HoverVideoMobileFirst from "../components/VideoOnHover"
import { FaHeart, FaHeartBroken } from "react-icons/fa"

const PhotoGallery = () => {
  const [scrollY, setScrollY] = useState(0)
  const [liked, setLiked] = useState(JSON.parse(localStorage.getItem("liked") || "[]"))
   const containerRefs = useRef([]);
  // Sample photos - replace with your actual photos
  const photos = [
    { id: 1, src: `/images/us/image11.jpg`, caption: "OUR FIRST", videoUrl:null },
    { id: 2, src: `/images/us/image9.jpg`, caption: "Favourite picture. Your smile is perfect.",videoUrl:null },
    { id: 3, src: `/images/us/image12.jpg`, caption: "How can i not love this cutie",videoUrl:null },
    { id: 15, src: `/images/us/image17.jpg`, caption: "I LOVE KISSING YOU",videoUrl:"/videos/video3.mp4" },
    { id: 4, src: `/images/us/image6.jpg`, caption: "THE perfect night together.",videoUrl:null },
    { id: 5, src: `/images/us/image14.jpg`, caption: "Our BEST tradition. I love when we're yapping.",videoUrl:"/videos/video4.mp4" },
    { id: 14, src: `/images/us/image18.jpg`, caption: "Will forever be recreating trends.",videoUrl:"/videos/video6.mp4" },
    { id: 6, src: `/images/us/image5.jpg`, caption: "Navratri has always been so special.",videoUrl:null },
    { id: 7, src: `/images/us/image7.jpg`, caption: "Your kisses mean the world to me.",videoUrl:null },
    { id: 8, src: `/images/us/image13.jpg`, caption: "Drivin and vibin.",videoUrl:"/videos/video1.mp4" },
    { id: 9, src: `/images/us/image8.jpg`, caption: "I can't wait to spend my whole life with you." , videoUrl:null},
    { id: 10, src: `/images/us/image15.jpg`, caption: "YES IT IS A THING WE ALWAYS DO" , videoUrl:"/videos/video2.mp4"},
    { id: 11, src: `/images/us/image1.jpg`, caption: "😒🙄. Bro taught me so well.", videoUrl:null },
    { id: 12, src: `/images/us/image16.jpg`, caption: "Matching outfits with you is the CUTEST thing ever", videoUrl:"/videos/video5.mp4" },
    { id: 13, src: `/images/us/image10.jpg`, caption: "Keep holding onto me. Forever and always", videoUrl:null },
  ]

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])
  const handleLike = (id) => {
    console.log(id);
    liked.includes(id) ?setLiked([...liked].filter(i => i!==id))  : setLiked([...liked, id]);
    localStorage.setItem("liked", JSON.stringify(liked))
  }

  const makeItRain = (emoji, count = 50, index) => {
    const container = containerRefs.current[index]
    if (!container) return;

    const rect = container.getBoundingClientRect();

    for (let i = 0; i < count; i++) {
      const span = document.createElement("span");
      span.className = "rain";
      span.innerText = emoji;
      span.style.left = Math.random() * 100 + "%";
      const size = Math.floor(Math.random() * 24) + 16; 
      span.style.fontSize = size + "px";
      const dur = (Math.random() * 2.5 + 1.8).toFixed(2); 
      span.style.animationDuration = `${dur}s`;

      // small random delay so they don't all drop at once
      span.style.animationDelay = (Math.random() * 0.6).toFixed(2) + "s";

      // prevent pointer blocking if you want clicks through emojis
      span.style.pointerEvents = "none";

      // append and remove when animation ends
      container.appendChild(span);
      span.addEventListener("animationend", () => span.remove(), { once: true });

      // safety fallback to remove
      setTimeout(() => {
        if (span.parentNode) span.remove();
      }, 6000);
    }
  };
  return (
    <div className="photo-gallery-page">
      <Link to="/" className="back-button">
        ← Back Home
      </Link>

      <div className="film-strip-container">
        <div className="film-header">
          <h1>Mini photo gallery</h1>
          <p>Every photo is so special 📸</p>
        </div>

        <div className="film-strip">
          <div className="film-holes film-holes-left">
            {[...Array(photos.length*12)].map((_, i) => (
              <div key={i} className="film-hole"></div>
            ))}
          </div>

          <div className="photos-container">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="photo-frame"
                style={{
                  //transform: `translateY(${scrollY * 0.5 * (index % 2 === 0 ? 1 : -1)}px)`,
                  opacity: 1 - Math.abs(scrollY - index * 470) / 1000,
                }}
              >
                
                <div className="photo-polaroid" ref={el => containerRefs.current[index] = el}>
                  {liked.includes(photo.id) ? 
                <FaHeart onClick={(e) => {e.stopPropagation(); handleLike(photo.id)}} className="heart-icon left filled" ></FaHeart> : <FaHeart onClick={(e) => {e.stopPropagation(); handleLike(photo.id)}} className="heart-icon left unfilled"></FaHeart>}
                  {liked.includes(photo.id) ? 
                <FaHeart onClick={(e) => {e.stopPropagation(); handleLike(photo.id)}} className="heart-icon right filled" ></FaHeart> : <FaHeart onClick={(e) => {e.stopPropagation(); handleLike(photo.id)}} className="heart-icon right unfilled"></FaHeart>} 
                  {photo.videoUrl === null ? 
                   <img src={photo.src || "/placeholder.svg"} alt={photo.caption} />
                  :
                  <>
                  
                  <HoverVideoMobileFirst
                    src={photo.videoUrl}
                    poster={photo.src}
                    frameTime={3.5}
                  />
                  </>

                  }
                 <div className="photo-hearts" >
                  <span onClick={() => makeItRain("🫶", 50, index)}>🫶</span>
                  <span onClick={() => makeItRain("❤️", 50, index)}>❤️</span>
                  <span onClick={() => makeItRain("😘", 50, index)}>😘</span>
                </div>
                  <div className="photo-caption">{photo.caption}</div>
                </div>
                
              </div>
            ))}

            <div className="end-message">
              <h2>To many more beautiful memories together</h2>
              <p>I love you</p>
            </div>
          </div>

          <div className="film-holes film-holes-right">
            {[...Array(photos.length*12)].map((_, i) => (
              <div key={i} className="film-hole"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PhotoGallery
