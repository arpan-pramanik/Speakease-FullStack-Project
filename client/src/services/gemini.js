// Mistral AI Service — Seamlessly replacing Gemini
const MISTRAL_KEY = import.meta.env.VITE_MISTRAL_API_KEY;
const MISTRAL_URL = 'https://api.mistral.ai/v1/chat/completions';

export const chatWithGemini = async (messages, systemPrompt = '') => {
    const mistralMessages = [];

    if (systemPrompt) {
        mistralMessages.push({ role: 'system', content: systemPrompt });
    }

    for (const msg of messages) {
        mistralMessages.push({
            role: msg.role === 'model' ? 'assistant' : 'user',
            content: msg.text
        });
    }

    try {
        const res = await fetch(MISTRAL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MISTRAL_KEY}`
            },
            body: JSON.stringify({
                model: 'mistral-small-latest',
                messages: mistralMessages,
                temperature: 0.8,
                max_tokens: 1024
            })
        });

        if (!res.ok) throw new Error(`Mistral API error: ${res.status}`);
        const data = await res.json();
        return data.choices?.[0]?.message?.content || 'No response from AI.';
    } catch (err) {
        console.error('AI Error:', err);
        throw err;
    }
};

// Quick single-prompt helper
export const askGemini = async (prompt, systemPrompt = '') => {
    return chatWithGemini([{ role: 'user', text: prompt }], systemPrompt);
};

// Verify connection before enabling AI mode
export const verifyGeminiConnection = async () => {
    try {
        const res = await fetch(MISTRAL_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MISTRAL_KEY}`
            },
            body: JSON.stringify({
                model: 'mistral-small-latest',
                messages: [{ role: 'user', content: 'hi' }],
                max_tokens: 1
            })
        });
        return res.ok;
    } catch {
        return false;
    }
};

// Global state for continuous mic tracking
let isGlobalListening = false;
let globalRecognition = null;

// Text-to-Speech
export const speakText = (text, lang = 'en-US') => {
    return new Promise((resolve) => {
        if (!('speechSynthesis' in window)) { resolve(); return; }

        // Strip out markdown tokens and special formats that crash TTS parsers
        const cleanText = text.replace(/[*_#`~]+/g, '').trim();
        if (!cleanText) { resolve(); return; }

        window.speechSynthesis.cancel(); // Flush queue

        setTimeout(() => {
            const utter = new SpeechSynthesisUtterance(cleanText);
            utter.lang = lang;
            utter.rate = 1.0;
            utter.pitch = 1.0;

            let resolved = false;
            const finish = () => { if (!resolved) { resolved = true; resolve(); } };

            utter.onend = finish;
            utter.onerror = finish;

            window.speechSynthesis.speak(utter);
            setTimeout(finish, Math.max(10000, cleanText.length * 100)); // Failsafe
        }, 50);
    });
};

export const stopSpeechRecognition = () => {
    isGlobalListening = false;
    if (globalRecognition) {
        try { globalRecognition.stop(); } catch (e) { }
    }
};

export const listenForSpeech = (lang = 'en-US', onInterim = null) => {
    return new Promise((resolve, reject) => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) { reject(new Error('Speech recognition not supported in this browser.')); return; }

        stopSpeechRecognition(); // Clean slate
        isGlobalListening = true;
        let cumulativeTranscript = '';

        const setupRecognition = () => {
            const recognition = new SR();
            globalRecognition = recognition;
            recognition.lang = lang;
            recognition.continuous = true;
            recognition.interimResults = !!onInterim;
            recognition.maxAlternatives = 1;

            recognition.onresult = (event) => {
                let tempInterim = '';
                let newFinals = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        newFinals += event.results[i][0].transcript + ' ';
                    } else {
                        tempInterim += event.results[i][0].transcript;
                    }
                }
                if (newFinals) cumulativeTranscript += newFinals;
                if (onInterim) onInterim(cumulativeTranscript + tempInterim);
            };

            recognition.onerror = (event) => {
                console.warn('[Speech API] Error:', event.error);
                if (event.error === 'not-allowed' || event.error === 'audio-capture') {
                    isGlobalListening = false;
                    reject(new Error(event.error));
                }
                // We ignore 'no-speech' or 'network' errors to let the auto-restart catch it
            };

            recognition.onend = () => {
                // If it ended automatically (browser killed it), we immediately restart it if we are still meant to be listening
                if (isGlobalListening) {
                    console.log('[Speech API] Auto-restarting hook...');
                    try { setupRecognition(); } catch (e) { }
                } else {
                    // Manual stop was clicked
                    globalRecognition = null;
                    resolve(cumulativeTranscript.trim());
                }
            };

            try {
                recognition.start();
            } catch (e) {
                if (isGlobalListening) {
                    setTimeout(() => { if (isGlobalListening) setupRecognition(); }, 500);
                }
            }
        };

        setupRecognition();
    });
};
