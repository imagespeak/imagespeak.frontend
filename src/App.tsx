import { useRef, useState } from 'react'
import './App.css'

function App() {
  const [image, setImage] = useState<string | null>(null)
  const [imageName, setImageName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImage(URL.createObjectURL(file))
      setImageName(file.name)
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleLogin = () => {
    setIsLoggedIn(true)
    // TODO: Add real login logic
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    // TODO: Add real logout logic
  }

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo-title">
          <h1>ImageSpeak</h1>
        </div>
        <div className="auth-buttons">
          {isLoggedIn ? (
            <button onClick={handleLogout}>Logout</button>
          ) : (
            <button onClick={handleLogin}>Login</button>
          )}
        </div>
      </header>
      <main>
        <section className="upload-section">
          <h2>Upload an Image</h2>
          <div className="upload-preview">
            {image ? (
              <img src={image} alt="Preview" className="image-preview" />
            ) : (
              <div className="image-placeholder">No image selected</div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleImageChange}
          />
          <button className="upload-btn" onClick={handleUploadClick}>
            Select Image
          </button>
          {imageName && <div className="image-name">{imageName}</div>}
        </section>
        <section className="form-section">
          <div className="caption-form">
            <label htmlFor="caption">Caption</label>
            <div className="readonly-box" id="caption">Caption will appear here</div>
          </div>
          <div className="description-form">
            <label htmlFor="visual-description">Visual Description</label>
            <div className="readonly-box" id="visual-description">Visual description will appear here</div>
          </div>
          <button className="generate-btn">Generate</button>
        </section>
      </main>
    </div>
  )
}

export default App
