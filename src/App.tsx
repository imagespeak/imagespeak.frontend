import { useRef, useState } from 'react';
import { useAuth } from 'react-oidc-context';
import './App.css';

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const auth = useAuth();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageName(file.name);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  // Cognito logout redirect
  const signOutRedirect = () => {
    const clientId = "1c8stjovflaui8kgmmljpl3n1h";
    const logoutUri = "http://localhost:5173/";
    const cognitoDomain = "https://us-east-1acnhsxvnt.auth.us-east-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  const handleLogout = () => {
    // Remove user from OIDC context
    auth.removeUser();
    // Remove access token from localStorage and sessionStorage
    localStorage.removeItem('access_token');
    sessionStorage.removeItem('access_token');
    // Remove all OIDC-related storage (for oidc-client-ts)
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('oidc.')) localStorage.removeItem(key);
    });
    Object.keys(sessionStorage).forEach((key) => {
      if (key.startsWith('oidc.')) sessionStorage.removeItem(key);
    });
    // Clear UI state
    setImage(null);
    setImageName(null);
    // Clear caption and description boxes (if you later store them in state, clear those too)
    const captionBox = document.getElementById('caption');
    if (captionBox) captionBox.textContent = '(Caption will appear here)';
    const descBox = document.getElementById('visual-description');
    if (descBox) descBox.textContent = '(Visual description will appear here)';
  };

  if (auth.isAuthenticated) {
    // Print access token to the console after signing in
    if (auth.user?.access_token) {
      console.log('Access Token:', auth.user.access_token);
    }
  }

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo-title">
          <h1>ImageSpeak</h1>
        </div>
        <div className="auth-buttons">
          {auth.isLoading ? (
            <span>Loading...</span>
          ) : auth.isAuthenticated ? (
            <>
              <span style={{ marginRight: 8 }}>Hello, {auth.user?.profile.email}</span>
              <button onClick={() => { handleLogout(); signOutRedirect(); }}>Logout</button>
            </>
          ) : (
            <button onClick={() => auth.signinRedirect()}>Login</button>
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
            <div className="readonly-box" id="caption">(Caption will appear here)</div>
          </div>
          <div className="description-form">
            <label htmlFor="visual-description">Visual Description</label>
            <div className="readonly-box" id="visual-description">(Visual description will appear here)</div>
          </div>
          <button className="generate-btn">Generate</button>
        </section>
      </main>
      <footer className="footer">
        <div>Contact: info@imagespeak.ai | &copy; 2025 ImageSpeak</div>
      </footer>
    </div>
  );
}

export default App;
