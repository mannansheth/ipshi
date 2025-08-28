
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

export const getAllMemories = async () => {
  try {
    const memories = await axios.get(`${backendUrl}/api/memories/getMemories`)
    return memories.data || []
  } catch (error) {
    console.error("Error loading memories:", error)
    return []
  }
}

// Get memories for a specific date
export const getMemoryByDate = async (date)  => {
  const memories = await getAllMemories()
  return memories.find((memory) => memory.DateOfMemory === date)
}

// Get memories for a specific month/year
export const getMemoriesForMonth = async  (year, month) => {
  const memories = await getAllMemories()
  return memories.filter((memory) => {
    const memoryDate = new Date(memory.DateOfMemory)
    return memoryDate.getFullYear() === year && memoryDate.getMonth() === month
  })
}

// Add a new memory
export const addMemory = async (memoryData) => {
  try {
    console.log(memoryData);
    const newMemory = new FormData();
    newMemory.append("DateOfMemory", memoryData.date);
    newMemory.append("Title", memoryData.title);
    newMemory.append("Description", memoryData.description);
    newMemory.append("Location", memoryData.location);
    newMemory.append("CreatedDate", new Date().toISOString());
    newMemory.append("CreatedBy", "Mannan")
    memoryData.imageUrl.forEach((file) => {
      newMemory.append("files", file); 
    });

      const response = await axios.post(`${backendUrl}/api/memories/addMemory`, newMemory);
      if (response.data && response.data.success) {
      return { ...memoryData, postId: response.data.postId, imageUrl: response.data.files };
    }
    return memoryData;
  } catch (error) {
    console.error("Error saving memory:", error)
    throw error
  }
}

// Update an existing memory
export const updateMemory = (id, memoryData) => {
  try {
    const memories = this.getAllMemories()
    const index = memories.findIndex((memory) => memory.id === id)

    if (index !== -1) {
      memories[index] = { ...memories[index], ...memoryData }
      localStorage.setItem(this.storageKey, JSON.stringify(memories))
      return memories[index]
    }

    throw new Error("Memory not found")
  } catch (error) {
    console.error("Error updating memory:", error)
    throw error
  }
}

// Delete a memory
export const deleteMemory = async (id) => {
  try {
    console.log(id)
    const response = await axios.delete(`${backendUrl}/api/memories/deleteMemory/${id}`);
    if (response.status === 200) {
      return true

    }
  } catch (error) {
    console.error("Error deleting memory:", error)
    throw error
  }
}

// Get memories count for each day in a month (for calendar display)
// getMemoryCountsForMonth(year, month) {
//   const memories = this.getMemoriesForMonth(year, month)
//   const counts = {}

//   memories.forEach((memory) => {
//     const day = new Date(memory.date).getDate()
//     counts[day] = (counts[day] || 0) + 1
//   })

//   return counts
// }



