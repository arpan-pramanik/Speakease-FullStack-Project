import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { AIModeProvider } from './context/AIModeContext';
import { AudioProvider } from './context/AudioContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter>
            <AuthProvider>
                <AIModeProvider>
                    <AudioProvider>
                        <App />
                    </AudioProvider>
                </AIModeProvider>
            </AuthProvider>
        </BrowserRouter>
    </React.StrictMode>
);
