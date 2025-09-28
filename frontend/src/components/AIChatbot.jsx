import React, { useState, useEffect, useRef } from "react";

const AIChatbot = ({ user }) => {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      content: "👋 Hi! I'm Athena, your AI leave assistant. I can help you with:\n\n• Check your leave balance\n• Find your last vacation\n• Suggest best dates for leave\n• Answer any leave-related questions\n\nWhat would you like to know?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      type: "user",
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/api/chatbot/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: user.email,
          query: inputMessage
        })
      });

      const data = await response.json();
      
      const botMessage = {
        type: "bot",
        content: data.response || "Sorry, I couldn't process your request right now.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        type: "bot",
        content: "I'm having trouble connecting right now. Please try again later.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickQuestions = [
    "How many personal leaves do I have left?",
    "When was my last vacation?",
    "What are the best dates for my leave?",
    "How many sick days have I used this year?",
    "Suggest me some good weeks for vacation"
  ];

  const handleQuickQuestion = (question) => {
    setInputMessage(question);
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="ai-chatbot">
      <div className="chatbot-header">
        <div className="bot-avatar">🤖</div>
        <div className="bot-info">
          <h3>Athena AI Assistant</h3>
          <p>Your intelligent leave management helper</p>
        </div>
        <div className="chat-status">
          <span className={`status-indicator ${isLoading ? 'loading' : 'online'}`}></span>
          {isLoading ? 'Typing...' : 'Online'}
        </div>
      </div>

      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            <div className="message-content">
              {message.type === 'bot' && (
                <div className="message-avatar">🤖</div>
              )}
              <div className="message-bubble">
                <p>{message.content}</p>
                <span className="message-time">{formatTime(message.timestamp)}</span>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message bot">
            <div className="message-content">
              <div className="message-avatar">🤖</div>
              <div className="message-bubble loading">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="quick-questions">
        <h4>💡 Quick Questions</h4>
        <div className="quick-buttons">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuickQuestion(question)}
              className="quick-question-btn"
              disabled={isLoading}
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSendMessage} className="chat-input">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask me anything about your leaves..."
          disabled={isLoading}
          className="message-input"
        />
        <button 
          type="submit" 
          disabled={!inputMessage.trim() || isLoading}
          className="send-button"
        >
          {isLoading ? "⏳" : "🚀"}
        </button>
      </form>
    </div>
  );
};

export default AIChatbot;
