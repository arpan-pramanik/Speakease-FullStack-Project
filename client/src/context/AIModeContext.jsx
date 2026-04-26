import { createContext, useContext, useState, useCallback } from 'react';
import { verifyGeminiConnection } from '../services/gemini';

const AIModeContext = createContext(null);

export const useAIMode = () => {
    const context = useContext(AIModeContext);
    if (!context) throw new Error('useAIMode must be used within AIModeProvider');
    return context;
};

export const AIModeProvider = ({ children }) => {
    const [isAIMode, setIsAIMode] = useState(false);
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [transitionDirection, setTransitionDirection] = useState(null);

    const toggleAIMode = useCallback(async () => {
        if (!isAIMode) {
            setTransitionDirection('to_ai');
            setIsTransitioning(true);
            const isConnected = await verifyGeminiConnection();
            if (!isConnected) {
                alert('Connection to AI API failed. The API key might be invalid or rate-limited.');
                setIsTransitioning(false);
                setTransitionDirection(null);
                return;
            }
            setTimeout(() => {
                setIsAIMode(true);
                setTimeout(() => { setIsTransitioning(false); setTransitionDirection(null); }, 800);
            }, 600);
        } else {
            setTransitionDirection('to_traditional');
            setIsTransitioning(true);
            setTimeout(() => {
                setIsAIMode(false);
                setTimeout(() => { setIsTransitioning(false); setTransitionDirection(null); }, 800);
            }, 600);
        }
    }, [isAIMode]);

    return (
        <AIModeContext.Provider value={{ isAIMode, isTransitioning, transitionDirection, toggleAIMode }}>
            {children}
        </AIModeContext.Provider>
    );
};
