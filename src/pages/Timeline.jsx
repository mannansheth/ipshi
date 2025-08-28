"use client"

import { useState, useEffect } from "react"
import * as memoriesService from "../services/memoriesService"
import MemoryDisplayModal from "../components/MemoryDisplayModal"
import AddMemoryModal from "../components/AddMemoryModal"
import "../styles/Timeline.css"
import { FaStar } from "react-icons/fa6"

const Timeline = () => {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [memories, setMemories] = useState([])
  const [selectedMemory, setSelectedMemory] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(null)
  const [showMemoryModal, setShowMemoryModal] = useState(false)

  useEffect(() => {
    loadMemories()
  }, [currentDate])

  const loadMemories = async () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const monthMemories = await memoriesService.getMemoriesForMonth(year, month)
    setMemories(monthMemories)
  }

  const getDaysInMonth = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const getMemoryForDate = (day) => {
    if (!day) return null
    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    return memories.find((memory) => memory.DateOfMemory === dateString)
  }

  const handleMemoryAdded = (newMemory) => {
    loadMemories() // Reload memories to show the new one
  }

  const handleMemoryEdit = (memory) => {
    setSelectedMemory(memory)
    setSelectedDate(memory.DateOfMemory)
    setShowMemoryModal(false)
    setShowAddModal(true)
  }

  const handleMemoryDelete = async (memoryId) => {
    try {
      await memoriesService.deleteMemory(memoryId)
      loadMemories()
      setShowMemoryModal(false)
      setSelectedMemory(null)
    } catch (error) {
      console.error("Error deleting memory:", error)
    }
  }

  const handleDayClick = (day) => {
    if (!day) return

    const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
    console.log(dateString)
    const memory = getMemoryForDate(day)

    if (memory) {
      setSelectedMemory(memory)
      setShowMemoryModal(true)
    } else {
      setSelectedDate(dateString)
      setShowAddModal(true)
    }
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(currentDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  return (
    <div className="timeline-container">
      <div className="timeline-background"></div>

      <header className="timeline-header">
        <h1 className="timeline-title">Our Memory Timeline</h1>
        <p className="timeline-subtitle">Every moment we've shared together</p>
      </header>

      <div className="calendar-container">
        <div className="calendar-navigation">
          <button className="nav-button prev" onClick={() => navigateMonth(-1)}>
            ←
          </button>

          <h2 className="month-year">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>

          <button className="nav-button next" onClick={() => navigateMonth(1)}>
            →
          </button>
        </div>

        <div className="calendar-grid">
          <div className="weekdays">
            {weekDays.map((day) => (
              <div key={day} className="weekday">
                {day}
              </div>
            ))}
          </div>

          <div className="days-grid">
            {getDaysInMonth(currentDate).map((day, index) => {
              const memory = getMemoryForDate(day)
              return (
                <div
                  key={index}
                  className={`day-cell ${day ? "active" : "empty"} ${memory ? "has-memory" : ""}`}
                  style={{border:((day===18) && currentDate.getMonth() === 7) ? "7px solid yellow"
                     : 
                     ((day===21) && currentDate.getMonth() === 9) ? "7px solid blue"
                     :
                     "4px transparent" }}
                  onClick={() => handleDayClick(day)}
                >
                  {day && (
                    <>
                      <span className={`day-number ${memory ? "has-memory" : ""}`}>
                        {
                          ((day===18) && currentDate.getMonth() === 7) ? <FaStar color="yellow"/> 
                          : 
                          ((day===21) && currentDate.getMonth() === 9) ? <FaStar color="blue"/>
                          :
                        ""} {day} {
                          ((day===18) && currentDate.getMonth() === 7) ? <FaStar color="yellow"/> 
                          :
                          ((day===21) && currentDate.getMonth() === 9) ? <FaStar color="blue"/>
                          :
                          ""
                        }
                        </span>
                      {memory && (
                        <div className="memory-preview" >
                          {memory.files && (
                            <div className="memory-image" style={{ backgroundImage: `url(${memory.files.filter(f => f.type.includes("image"))[0].url})`}}></div>
                          )}
                          {/* <div className="memory-indicator"></div> */}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* <button
        className="add-memory-fab"
        onClick={() => {
          setSelectedDate(new Date().toISOString().split("T")[0])
          setShowAddModal(true)
        }}
      >
        +
      </button> */}

      {/* Memory Display Modal */}
      <MemoryDisplayModal
        memory={selectedMemory}
        isOpen={showMemoryModal}
        onClose={() => {
          setShowMemoryModal(false)
          setSelectedMemory(null)
        }}
        onEdit={handleMemoryEdit}
        onDelete={handleMemoryDelete}
      />

      <AddMemoryModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setSelectedDate(null)
          setSelectedMemory(null)
        }}
        memory = {selectedMemory}
        selectedDate={selectedDate}
        onMemoryAdded={handleMemoryAdded}
      />
    </div>
  )
}

export default Timeline
