"use client"

import { useState } from "react"
import "../styles/MemoryDisplayModal.css"
import { FaArrowDown, FaLocationArrow, FaLocationCrosshairs, FaLocationDot, FaLocationPin, FaLocationPinLock, FaTrashCan } from "react-icons/fa6"
import { FaEdit } from "react-icons/fa"

const MemoryDisplayModal = ({ memory, isOpen, onClose, onEdit, onDelete }) => {
  const [imageLoaded, setImageLoaded] = useState(false)

  if (!isOpen || !memory) return null

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  return (
    <div className="memory-modal-overlay" onClick={handleBackdropClick}>
      <div className="memory-modal-container">
        <div className="memory-modal-header">
          <button className="memory-modal-close" onClick={onClose} aria-label="Close modal">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="memory-modal-content">
          {memory.files && (
            <div className="memory-image-container">
              <div className={`memory-image-wrapper ${imageLoaded ? "loaded" : ""}`}>
                {memory.files.map((f, i) => {
                  return f.type.includes("image") ? (
                    <img
                      src={f.url}
                      alt={memory.Title}
                      key={i}
                      onLoad={() => setImageLoaded(true)}
                      onError={(e) => {
                        e.target.src = "/placeholder-qohtu.png"
                      }}
                    />
                  ) : (
                    <>
                    <h5><FaArrowDown/> Tap to play! <FaArrowDown/></h5>
                    <video src={f.url}  onLoad={() => setImageLoaded(true)} key={i} onClick={e => e.target.paused ? e.target.play() : e.target.pause()}/>
                    </>
                  )
                })}

              </div>
              <div className="memory-image-overlay"></div>
            </div>
          )}

          <div className="memory-details-container">
            <div className="memory-header-info">
              <h2 className="memory-title">{memory.Title}</h2>
              <p className="memory-date">{formatDate(memory.DateOfMemory)}</p>
            </div>

            {memory.Location && (
              <div className="memory-location">
                <FaLocationDot />

                <span>{memory.Location}</span>
              </div>
            )}

            <div className="memory-description">
              <p>{memory.Description}</p>
            </div>

            <div className="memory-metadata">
              <div className="memory-created">
                <span className="metadata-label">Added on:</span>
                <span className="metadata-value">{new Date(memory.CreatedDate).toLocaleDateString()}</span>
              </div>
              <div className="memory-created">
                <span className="metadata-label">Added by:</span>
                <span className="metadata-value">{memory.CreatedBy}</span>
              </div>
            </div>

            {(onEdit || onDelete) && (
              <div className="memory-actions">
                {onEdit && (
                  <button className="memory-action-btn edit-btn" onClick={() => onEdit(memory)}>
                    <FaEdit />
                    Edit Memory
                  </button>
                )}
                {onDelete && (
                  <button className="memory-action-btn delete-btn" onClick={() => onDelete(memory.ID)}>
                    <FaTrashCan />
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default MemoryDisplayModal
