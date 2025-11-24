import React, { useState, useEffect, useRef } from 'react';

const AICopilot = ({ onCommand, context }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { type: 'ai', text: 'Systems online. I am Orbit AI. How can I assist you?' }
    ]);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Reset chat when closed
    useEffect(() => {
        if (!isOpen) {
            const timer = setTimeout(() => {
                setMessages([
                    { type: 'ai', text: 'Systems online. I am Orbit AI. How can I assist you?' }
                ]);
                setInput('');
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMsg = input;
        setMessages(prev => [...prev, { type: 'user', text: userMsg }]);
        setInput('');
        setIsTyping(true);

        try {
            const apiUrl = import.meta.env.VITE_API_URL || '';
            const response = await fetch(`${apiUrl}/api/ai/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg,
                    context: {
                        tasks: context.tasks,
                        projects: context.projects,
                        members: context.members
                    }
                })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error);
            }

            // Parse response for actions
            const replyText = data.reply;
            const jsonMatch = replyText.match(/\{[\s\S]*\}/);

            let displayText = replyText;

            if (jsonMatch) {
                try {
                    const actionJson = JSON.parse(jsonMatch[0]);
                    displayText = replyText.replace(jsonMatch[0], '').trim();
                    if (actionJson.action) {
                        onCommand({ type: actionJson.action, payload: actionJson.payload });
                    }
                } catch (e) {
                    console.error('Failed to parse AI action:', e);
                }
            }

            setMessages(prev => [...prev, { type: 'ai', text: displayText }]);
        } catch (err) {
            console.error('AI Error:', err);
            setMessages(prev => [...prev, { type: 'ai', text: "I'm having trouble connecting to my neural network. Please check my API key." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <>
            {/* Floating Orb Button */}
            <div
                className={`ai-orb ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="orb-core"></div>
                <div className="orb-ring"></div>
            </div>

            {/* Chat Interface */}
            {isOpen && (
                <div className="ai-interface">
                    <div className="ai-header">
                        <span className="ai-title">ORBIT AI // V2.0</span>
                        <button onClick={() => setIsOpen(false)} className="ai-close">×</button>
                    </div>

                    <div className="ai-messages">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`ai-message ${msg.type}`}>
                                {msg.type === 'ai' && <div className="ai-avatar"></div>}
                                <div className="message-content">{msg.text}</div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="ai-message ai">
                                <div className="ai-avatar"></div>
                                <div className="typing-indicator">
                                    <span></span><span></span><span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSubmit} className="ai-input-area">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Enter command..."
                            className="ai-input"
                            autoFocus
                        />
                        <button type="submit" className="ai-send">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                        </button>
                    </form>
                </div>
            )}
        </>
    );
};

export default AICopilot;
