# ChatFlow - Setup Guide

This guide will help you set up and run the ChatFlow application on your local machine.

## Prerequisites

- Node.js (v16 or later)
- npm (comes with Node.js)
- A Google Gemini API key (for AI features)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd chat-app
```

### 2. Set Up the Server

1. Open a terminal and navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory with the following content:
   ```env
   PORT=3001
   NODE_ENV=development
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   
   Replace `your_gemini_api_key_here` with your actual Gemini API key.

4. Start the server:
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:3001`

### 3. Set Up the Client

1. Open a new terminal and navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The client will start on `http://localhost:3000`

## Using the Application

1. Open your browser and go to `http://localhost:3000`
2. Enter a username when prompted
3. Start chatting in the default room or create/join other rooms
4. Use the theme toggle to switch between light and dark mode
5. Click the AI button to generate smart replies

## Troubleshooting

### Common Issues

1. **CORS Errors**: 
   - Ensure the server is running and the CORS origin is correctly set in `server.js`
   - Make sure the client is making requests to the correct server URL

2. **Socket.IO Connection Issues**:
   - Check that the server is running and accessible
   - Verify that the client is connecting to the correct server URL

3. **AI Features Not Working**:
   - Ensure you've set a valid Gemini API key in the `.env` file
   - Check the server logs for any API errors

4. **Styling Issues**:
   - Make sure all client dependencies are installed
   - Check the browser console for any CSS-related errors

## Development

### Available Scripts

#### Server
- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with nodemon

#### Client
- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build

## Deployment

### Server

1. Build the client application:
   ```bash
   cd client
   npm run build
   ```

2. Copy the `dist` folder to your server.

3. Configure your production environment variables.

4. Start the server:
   ```bash
   NODE_ENV=production node server.js
   ```

### Client

The client can be deployed to any static file hosting service (Vercel, Netlify, GitHub Pages, etc.) by building the application and uploading the contents of the `dist` directory.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
