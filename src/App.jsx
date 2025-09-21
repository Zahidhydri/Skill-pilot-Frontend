import React, { useState } from 'react';
import './App.css'; // Make sure this line is here

function App() {
  const [subjects, setSubjects] = useState('')
  const [interests, setInterests] = useState('')
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const API_ENDPOINT = `${import.meta.env.VITE_REACT_APP_BACKEND_URL}/generate`

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setRecommendations([])

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subjects, interests }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      const data = await response.json()

      if (data && Array.isArray(data.recommendations)) {
        setRecommendations(data.recommendations)
      } else {
        throw new Error('Received an invalid response from the server.')
      }
    } catch (err) {
      setError('Failed to fetch recommendations. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Skill Pilot AI 🚀</h1>
        <p>Enter your details to get personalized career advice.</p>
      </div>

      <form onSubmit={handleSubmit} className="profile-form">
        <div className="form-group">
          <label>Your Main Subjects</label>
          <input
            type="text"
            value={subjects}
            onChange={(e) => setSubjects(e.target.value)}
            placeholder="e.g., Computer Science, Physics"
            required
          />
        </div>
        <div className="form-group">
          <label>Your Hobbies & Interests</label>
          <input
            type="text"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            placeholder="e.g., Gaming, Reading, Coding"
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Generating...' : 'Get Recommendations'}
        </button>
      </form>

      {error && <p className="error-message">{error}</p>}

      <div className="results-container">
        {loading && (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Our AI is thinking...</p>
          </div>
        )}

        {recommendations.length > 0 && (
          <div className="recommendations-list">
            <h2>Here are your recommendations:</h2>
            {recommendations.map((rec, index) => (
              <div key={index} className="card">
                <h3>{rec.title}</h3>
                <p>{rec.description}</p>
                <h4>Essential Skills:</h4>
                <ul>
                  {rec.skills.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* --- ADDED FOOTER --- */}
      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Zahid Hydri. All Rights Reserved.</p>
      </footer>
      
    </div>
  )
}

export default App