import React from 'react'
import { Link } from 'react-router'

const Valentines = () => {
  return (
    <div style={{display:"flex", backgroundColor:"#ffd6e7", flexDirection:"column", justifyContent:"center", alignItems:"center", position:"relative"}}>
      <Link to="/" className="back-button">
        ← Back Home
      </Link>

      <iframe src="/valentines.html" width="100%" height="800px" />
      <iframe src="/valentines.pdf" width="40%" height="800px"/>
    </div>
  )
}

export default Valentines
