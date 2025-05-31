# imagespeak.frontend

## Description
A tool that leverages AI to generate insightful captions and detailed descriptions from images, making visual content more accessible and meaningful.

## Architecture

![High Level Architecture](architecture/hla.svg)

### Flow
- **user → clientApp**
- **clientApp → Identity server**: login credential handles, used authorization code flow
- **Identity server → clientApp**: exchange code and receive token from identity server
- **clientApp → Api gateway**: Api request
- **Api gateway → clientApp**: Api response

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
