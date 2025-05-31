import { useRef, useState, useEffect } from 'react';
import { useAuth } from 'react-oidc-context';
import './App.css';
import settings from './settings';

function App() {
  const [image, setImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [messageTimeout, setMessageTimeout] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const auth = useAuth();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageName(file.name);
      setImage(URL.createObjectURL(file));
      setImageName(file.name);
    }
  };
};

const handleUploadClick = () => {
  fileInputRef.current?.click();
};

const handleGenerate = async () => {
  setMessage(null);
  if (!auth.isAuthenticated || !auth.user?.access_token) {
    setMessage('Please log in to generate a caption and description.');
    return;
  }
  if (!image) {
    setMessage('Please select an image to upload.');
    return;
  }
  setUploading(true);
  try {
    // Get file and content type
    const file = fileInputRef.current?.files?.[0];
    if (!file) throw new Error('No file selected');
    // Get presigned URL with contentType as query param
    const res = await fetch(
      `${settings.api.presignedUrl}?contentType=${encodeURIComponent(file.type)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${auth.user.access_token}`,
        },
      }
    );
    if (!res.ok) throw new Error('Failed to get presigned URL');
    const apiData = await res.json();
    // Handle the case where uploadUrl is inside a JSON string in the 'body' property
    let uploadUrl = '';
    if (apiData.uploadUrl) {
      uploadUrl = apiData.uploadUrl;
    } else if (apiData.body) {
      try {
        const bodyObj = JSON.parse(apiData.body);
        uploadUrl = bodyObj.uploadUrl;
      } catch {
        throw new Error('Invalid presigned URL response format');
      }
    }
    if (!uploadUrl) throw new Error('Presigned URL not found in response');
    // Upload file to S3
    const uploadRes = await fetch(uploadUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': 'application/octet-stream'
      }
    });
    if (!uploadRes.ok) throw new Error('Failed to upload image to S3');
    setMessage('Image uploaded successfully!');
  } catch (err: any) {
    setMessage(err.message || 'An error occurred during upload.');
  } finally {
    setUploading(false);
  }
};

// Cognito logout redirect
const signOutRedirect = () => {
  const { clientId, logoutUri, cognitoDomain } = settings.cognito;
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

// Auto-remove message after 5 minutes
useEffect(() => {
  if (message) {
    if (messageTimeout) clearTimeout(messageTimeout);
    const timeout = window.setTimeout(() => setMessage(null), 5 * 60 * 1000);
    setMessageTimeout(timeout);
  }
  // Cleanup on unmount
  return () => {
    if (messageTimeout) clearTimeout(messageTimeout);
  };
}, [message]);

if (auth.isAuthenticated) {
  // Print access token to the console after signing in
  if (auth.user?.access_token) {
    console.log('Access Token:', auth.user.access_token);
  }
}

return (
  <div className="app-container">
    {message && (
      <div className={`message-card${(
        message === 'Please log in to generate a caption and description.' ||
        message === 'Please select an image to upload.' ||
        message === 'Failed to fetch' ||
        message.toLowerCase().includes('error')
      ) ? ' error' : ''}`}>
        <span>{message}</span>
        <button className="close-btn" onClick={() => setMessage(null)} title="Close">&times;</button>
      </div>
    )}
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
        <button className="generate-btn" onClick={handleGenerate} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Generate'}
        </button>
      </section>
    </main>
    <footer className="footer">
      <div>Contact: info@imagespeak.ai | &copy; 2025 ImageSpeak</div>
    </footer>
  </div>
);
}

export default App;
export default App;
