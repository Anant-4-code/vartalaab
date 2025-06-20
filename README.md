# ChatFlow - Real-time Chat Application with AI

A modern, real-time chat application with AI-powered smart replies using the Gemini API. Built with Node.js, Express, Socket.IO, React, and Tailwind CSS.

## Features

- Real-time messaging with Socket.IO
- AI-powered smart replies using Google's Gemini API
- Dark/light theme with smooth transitions
- Responsive design for all screen sizes
- Markdown support in messages
- Multiple chat rooms
- User presence indicators
- Mobile-friendly interface

## Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Google Gemini API key (for AI features)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd chat-app
```

### 2. Set up the server

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory with your Gemini API key:
   ```env
   PORT=3001
   NODE_ENV=development
   GEMINI_API_KEY=your_gemini_api_key_here
   ```

4. Start the server:
   ```bash
   npm start
   # or for development with auto-reload:
   npm run dev
   ```

### 3. Set up the client

1. Open a new terminal and navigate to the client directory:
   ```bash
   cd ../client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
chat-app/
├── client/                 # React frontend
│   ├── public/             # Static files
│   └── src/                # React source code
│       ├── App.jsx         # Main App component
│       ├── main.jsx        # Entry point
│       └── index.css       # Global styles
├── server/                 # Node.js backend
│   ├── server.js          # Express server setup
│   └── package.json       # Server dependencies
└── README.md              # This file
```

## Environment Variables

### Server

- `PORT` - Port for the server to run on (default: 3001)
- `NODE_ENV` - Node environment (development/production)
- `GEMINI_API_KEY` - Your Google Gemini API key

## Available Scripts

### Server

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with nodemon

### Client

- `npm run dev` - Start the development server
- `npm run build` - Build for production
- `npm run preview` - Preview the production build

## Customization

### Colors

You can customize the color scheme by editing the `tailwind.config.js` file in the client directory. The application uses a primary color palette that can be easily modified.

### Features

- To enable/disable features, modify the respective components in the `src/components` directory.
- The AI smart reply feature can be toggled by commenting out the relevant code in the `App.jsx` file.

## Deployment

### Server

1. Build the client application:
   ```bash
   cd client
   npm run build
   ```

2. Copy the `build` folder to your server.

3. Configure your production environment variables.

4. Start the server:
   ```bash
   NODE_ENV=production node server.js
   ```

### Client

The client can be deployed to any static file hosting service (Vercel, Netlify, GitHub Pages, etc.) by building the application and uploading the contents of the `dist` directory.

## Contributing

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Socket.IO](https://socket.io/) for real-time communication
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [React](https://reactjs.org/) for building user interfaces
- [Gemini API](https://ai.google.dev/) for AI-powered smart replies
#   v a r t a l a a b  
 