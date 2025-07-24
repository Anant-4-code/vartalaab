import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSend, FiMoon, FiSun, FiMessageSquare, FiUsers, FiPlus, FiLogOut } from 'react-icons/fi';

// Determine the server URL based on environment
const SERVER_URL = import.meta.env.VITE_APP_SERVER_URL || 'http://localhost:3001';

// Initialize socket connection
const socket = io(SERVER_URL, { autoConnect: false });

const ChatApp = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [rooms, /**/ ] = useState(['general', 'random', 'help']);
  const [currentRoom, setCurrentRoom] = useState('general');
  const [showSidebar, setShowSidebar] = useState(true);
  const [showUserList, setShowUserList] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };

  // Load dark mode preference
  useEffect(() => {
    const savedDarkMode = JSON.parse(localStorage.getItem('darkMode'));
    if (savedDarkMode !== null) {
      setDarkMode(savedDarkMode);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  // Connect to socket when component mounts
  useEffect(() => {
    let savedUsername = localStorage.getItem('username');
    // If no username is found, use a default one for testing
    if (!savedUsername) {
      savedUsername = `Guest_${Math.floor(Math.random() * 1000)}`;
      localStorage.setItem('username', savedUsername);
    }
    setUsername(savedUsername);
    
    // Connect to socket
    socket.connect();
    
    // Join default room
    socket.emit('join', { username: savedUsername, room: currentRoom });
    
    // Set up event listeners
    socket.on('message', (message) => {
      // Ensure message has required fields and valid timestamp
      const validatedMessage = {
        ...message,
        username: message.username || 'Unknown',
        text: message.text || '',
        time: message.time || new Date().toISOString()
      };
      setMessages((prevMessages) => [...prevMessages, validatedMessage]);
    });
    
    socket.on('roomData', ({ room, users }) => {
      setUsers(users || []);
    });
    
    // Clean up on unmount
    return () => {
      socket.off('message');
      socket.off('roomUsers');
      socket.disconnect();
    };
  }, [currentRoom, navigate]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message
  const sendMessage = (e) => {
    e.preventDefault();
    
    if (message.trim() === '') return;
    
    // Emit message to server
    socket.emit('sendMessage', {
      text: message
    });
    
    // Clear input
    setMessage('');
  };

  // Change room
  const changeRoom = (room) => {
    if (room === currentRoom) return;
    
    // Leave current room
    socket.emit('leaveRoom', { username, room: currentRoom });
    
    // Join new room
    setCurrentRoom(room);
    setMessages([]);
    socket.emit('join', { username, room });
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('username');
    socket.disconnect();
    navigate('/login');
  };

  return (
    <div className={`flex h-screen ${darkMode ? 'dark' : ''}`}>
      {/* Sidebar */}
      <div 
        className={`${showSidebar ? 'translate-x-0' : '-translate-x-full'} 
                  md:translate-x-0 fixed md:static z-10 w-64 h-full bg-white dark:bg-gray-800 
                  shadow-lg md:shadow-none transition-transform duration-300 ease-in-out`}
      >
        <div className="p-4 h-full flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white">ChatFlow</h1>
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {darkMode ? (
                <FiSun className="w-5 h-5 text-yellow-400" />
              ) : (
                <FiMoon className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
          
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Rooms
              </h2>
              <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <FiPlus className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1">
              {rooms.map((room) => (
                <button
                  key={room}
                  onClick={() => changeRoom(room)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
                    room === currentRoom
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-200'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  # {room}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-auto">
            <div className="flex items-center space-x-2 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center text-white font-semibold">
                {username.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {username}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  Online
                </p>
              </div>
              <button 
                onClick={handleLogout}
                className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                title="Logout"
              >
                <FiLogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-4">
            <div className="flex items-center">
              <button 
                onClick={() => setShowSidebar(!showSidebar)}
                className="md:hidden p-2 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
              >
                <FiMessageSquare className="w-5 h-5" />
              </button>
              <div className="flex items-center">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  #{currentRoom}
                </h2>
                <span className="ml-2 px-2 py-0.5 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                  {users.length} {users.length === 1 ? 'member' : 'members'}
                </span>
              </div>
            </div>
            <button 
              onClick={() => setShowUserList(!showUserList)}
              className="md:hidden p-2 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <FiUsers className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto space-y-4">
            {messages.map((msg, idx) => (
              <AnimatePresence key={idx}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.username === username ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-xs md:max-w-md rounded-lg p-3 ${
                      msg.username === username
                        ? 'bg-primary-500 text-white rounded-br-none'
                        : 'bg-white dark:bg-gray-800 shadow rounded-bl-none'
                    }`}
                  >
                    {msg.username !== username && (
                      <p className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                        {msg.username}
                      </p>
                    )}
                    <div className="prose dark:prose-invert max-w-none">
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                    </div>
                    <p className="text-xs mt-1 opacity-70 text-right">
                      {msg.time ? format(new Date(msg.time), 'h:mm a') : 'Just now'}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4">
          <form onSubmit={sendMessage} className="max-w-3xl mx-auto flex space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type a message..."
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
              <button
                type="button"
                onClick={() => {
                  // Implement smart reply
                  const smartReplies = [
                    "That's interesting!",
                    "I agree with you.",
                    "Let me think about that...",
                    "Thanks for sharing!",
                    "I'll get back to you on that.",
                  ];
                  setMessage(smartReplies[Math.floor(Math.random() * smartReplies.length)]);
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary-500"
                title="Smart Reply"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-500 text-white rounded-full hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
            >
              <FiSend className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* User List */}
      <div 
        className={`${showUserList ? 'translate-x-0' : 'translate-x-full'} 
                  md:translate-x-0 fixed right-0 top-0 h-full w-64 bg-white dark:bg-gray-800 
                  shadow-lg md:shadow-none transition-transform duration-300 ease-in-out z-10`}
      >
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Online Users</h2>
            <button 
              onClick={() => setShowUserList(false)}
              className="md:hidden p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          <div className="space-y-2">
            {users.map((user, idx) => (
              <div key={idx} className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
                <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center text-primary-700 dark:text-primary-200 font-semibold">
                  {user.username.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {user.username}
                </span>
                {user.username === username && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">(You)</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Overlay for mobile */}
      {(showSidebar || showUserList) && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden"
          onClick={() => {
            setShowSidebar(false);
            setShowUserList(false);
          }}
        />
      )}
    </div>
  );
};

export default ChatApp;
