import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { AuthProvider } from 'react-oidc-context';
import './index.css';

const cognitoAuthConfig = {
  authority: 'https://cognito-idp.us-east-1.amazonaws.com/us-east-1_acNhSXVnt',
  client_id: '1c8stjovflaui8kgmmljpl3n1h',
  redirect_uri: 'http://localhost:5173/callback',
  response_type: 'code',
  scope: 'email openid phone',
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </StrictMode>,
);
