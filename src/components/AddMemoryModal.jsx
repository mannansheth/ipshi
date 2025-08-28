"use client"

import { useEffect, useRef, useState, Fragment } from "react"
import * as memoriesService from "../services/memoriesService"
import "../styles/AddMemoryModal.css"
import { FaTrash, FaX } from "react-icons/fa6"
import { FaSave } from "react-icons/fa"

const AddMemoryModal = ({ isOpen, onClose, selectedDate, onMemoryAdded, memory }) => {  

  const [formData, setFormData] = useState({
    date: selectedDate ,
    title: memory?.Title || "",
    description: "",
    imageUrl: [],
    location: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})
  const [filePreviews, setFilePreviews] = useState([])
  const fileInputRef = useRef(null);
  // Reset form when modal opens/closes or selectedDate changes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        date: selectedDate || new Date().toISOString().split("T")[0],
        title: memory?.Title || "",
        description: "",
        imageUrl: [],
        location: "",
      })
      setErrors({})
      setFilePreviews([])
    }
  }, [isOpen])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }   

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.date) {
      newErrors.date = "Date is required"
    }

    if (formData.imageUrl.length === 0) {
      newErrors.imageUrl = "Please choose an image/video"
    }
    setErrors(newErrors)
    console.log(newErrors);
    return Object.values(newErrors).filter(v => v !== "").length === 0
  }

  const handleImageChange = e => {
    const allowedExtensions = "mp4, jpg, png, webp, jpeg"
    setErrors(prev => ({
        ...prev,
        "imageUrl" : ""
    }))
    const files = e.target.files;
    const {name} = e.target
    if (files) {
        const renamedFiles = Object.values(files).map((file, i) => {
            const ext = file.name.split('.').pop();
            if (!allowedExtensions.includes(ext)) {
                setErrors(prev => ({
                    ...prev,
                    "imageUrl" : "Only photos and videos allowed."
                }))
            }
            const newFileName = formData.date + `(${i+1})` + "." + ext; 
            return new File([file], newFileName, { type: file.type });
        })
        setFormData(prev => ({
            ...prev,
            [name] : renamedFiles
        }))
        
       const previewPromises = Object.values(files).map((file) => {
            return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.readAsDataURL(file);
            });
        });

        Promise.all(previewPromises).then((results) => {
            setFilePreviews(results); // all previews loaded
        });
    }
  }
  const handleInputChange = (e) => {

    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      console.log(errors)
      return
    }
    setIsSubmitting(true)

    try {
      const newMemory = await memoriesService.addMemory(formData)
      onMemoryAdded && onMemoryAdded(newMemory)
      onClose()

      // Reset form
      setFormData({
        date: new Date().toISOString().split("T")[0],
        title: "",
        description: "",
        imageUrl: "",
        location: "",
      })
    } catch (error) {
      console.error("Error adding memory:", error)
      setErrors({ submit: "Failed to save memory. Please try again." })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="add-memory-overlay" onClick={handleBackdropClick}>
      <div className="add-memory-container">
        <div className="add-memory-header">
          <h2 className="add-memory-title">{memory?.Title ? "Update Memory" : "Create New Memory"}</h2>
          <button className="add-memory-close" onClick={onClose} aria-label="Close modal">
            <FaX />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-memory-form">
          <div className="form-group">
            <label htmlFor="date" className="form-label">
              Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData?.date || new Date()}
              onChange={handleInputChange}
              className={`form-input ${errors.date ? "error" : ""}`}
              required
            />
            {errors.date && <span className="error-message timeline">{errors.date}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="title" className="form-label">
              What did we do?
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="kya kiya hamne"
              className={`form-input ${errors.title ? "error" : ""}`}

            />
            {errors.title && <span className="error-message timeline">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Tell me more about this memory
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="bigger description"
              className={`form-textarea ${errors.description ? "error" : ""}`}
              rows="4"  

            />
            {errors.description && <span className="error-message timeline">{errors.description}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="imageUrl" className="form-label">
              Upload Memories
            </label>
            <input
              type="file"
              id="imageUrl"
              accept="image/*, video/*"
              multiple
              name="imageUrl"
              ref={fileInputRef}
              style={{display:"none"}}
              onChange={handleImageChange}
            />
            <div className="custom-file-input">
                <button type="button" onClick={() => fileInputRef.current.click()} className={`form-input ${errors.imageUrl ? "error" : ""}`}>Choose File</button>
                {formData.imageUrl.length === 0  ? 
                <span>No image chosen</span>  
                :
                    <span>
                        {formData?.imageUrl?.map((f, i) => (
                            <Fragment key={i}>
                            {f.name}
                            <br />
                            </Fragment>
                        ))}
                    </span>
            }
                
                {filePreviews.length > 0 && 
                <FaTrash onClick={() => {
                    setFilePreviews([]);
                    setFormData(prev => ({
                        ...prev,
                        "imageUrl" : []
                    }))
                    document.getElementById("imageUrl").value = null
                }} className="trash-icon"/>}
                
            </div>
            {errors.imageUrl && <span className="error-message timeline">{errors.imageUrl}</span>}
            
            {/* {errors.imageUrl && <span className="error-message timeline">{errors.imageUrl}</span>} */}
            {filePreviews.length > 0 &&  
                <>
                    {filePreviews.map((p, i) => (
                        <div className="image-preview" key={i}>
                            {p.includes("video") ? 
                            <video controls src={p} alt="Preview"  muted loop/>
                            :
                            <img
                            src={p|| "/placeholder.svg"}
                            alt="Preview"
                            
                            />
                            }
                        </div>
                    ))}
                </>
            }
          </div>

          <div className="form-group">
            <label htmlFor="location" className="form-label">
              Location 
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Where did we meet?"
              className="form-input"
            />
          </div>

          {errors.submit && <div className="error-message timeline submit-error">{errors.submit}</div>}

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn" disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="loading-spinner"></div>
                  Saving...
                </>
              ) : (
                
                  <FaSave />
                  

              )}
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

export default AddMemoryModal
