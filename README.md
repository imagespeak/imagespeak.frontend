# imagespeak.frontend

## Description
A tool that leverages AI to generate insightful captions and detailed descriptions from images, making visual content more accessible and meaningful.

## Architecture Diagram

![High Level Architecture](architecture/hla.svg)

## Sequence Diagram

```mermaid
sequenceDiagram
    participant User as user
    participant Client as clientApp (SPA)
    participant Identity as Identity server
    participant API as Api gateway

    User->>Client: Initiate login
    Client->>Identity: Send login credentials (authorization code flow)
    Identity-->>Client: Exchange code, return token
    Client->>API: API request with token
    API-->>Client: API response
```

## Run Commands

### Start development server
```
npm run dev
```

### Build for production
```
npm run build
```

### Preview production build
```
npm run preview
```
