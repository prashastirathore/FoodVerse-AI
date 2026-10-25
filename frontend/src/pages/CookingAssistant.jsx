import React, { useState, useEffect, useRef } from 'react';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Bookmark,
  Sparkles,
  ChefHat,
  Flame,
  Clock,
  Users,
  CheckCircle,
  Lightbulb,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import { assistantApi } from '../api/assistantApi';
import confetti from 'canvas-confetti';

const CookingAssistant = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content:
        "Welcome to the FoodVerse Kitchen! I am your AI Executive Chef & Culinary Nutritionist. Ask me how to cook any dish, request ingredient substitutions, ask for rapid weeknight recipes, or click a quick prompt below.",
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [quickPrompts, setQuickPrompts] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');
  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Fetch quick prompts
    assistantApi.getPrompts().then(setQuickPrompts).catch(() => {});
    // Fetch saved recipes
    loadSavedRecipes();

    // Setup Web Speech API for voice recognition if available
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognitionRef.current = recognition;
    }
  }, []);

  const loadSavedRecipes = async () => {
    try {
      const res = await assistantApi.getSavedRecipes();
      if (res) setSavedRecipes(res);
    } catch (e) {}
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const toggleVoiceInput = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported by your current browser.');
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const speakText = (text) => {
    if (!('speechSynthesis' in window)) return;
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    const cleanText = text.replace(/[#*`_]/g, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (textToSend) => {
    const message = textToSend || inputMessage;
    if (!message.trim() || loading) return;

    const userMsg = { role: 'user', content: message };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await assistantApi.chat({
        message,
        conversation_history: messages.slice(-5),
      });

      const aiMsg = {
        role: 'assistant',
        content: res.reply,
        suggested_recipe: res.suggested_recipe,
        substitutions: res.substitutions,
        follow_up_suggestions: res.follow_up_suggestions,
        is_demo: res.is_demo,
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I encountered an issue connecting to culinary intelligence. Please try again.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveRecipe = async (recipe) => {
    try {
      await assistantApi.saveRecipe(recipe);
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
      setSaveSuccessMsg(`Saved "${recipe.title}" to your cookbook!`);
      loadSavedRecipes();
      setTimeout(() => setSaveSuccessMsg(''), 4000);
    } catch (err) {
      alert('Failed to save recipe: ' + err.message);
    }
  };

  return (
    <div>
      {/* Header bar */}
      <div style={{ marginBottom: '1.2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div>
          <h2 style={{ fontSize: '1.6rem', color: 'var(--forest-900)' }}>
            Smart Culinary Assistant & Recipe Lab
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Voice-enabled culinary guidance, macro-calibrated recipes, and dynamic food substitutions.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <span className="badge badge-mint">
            <ChefHat size={14} /> Head Chef Gemini
          </span>
          {savedRecipes.length > 0 && (
            <span className="badge badge-forest">
              <Bookmark size={14} /> {savedRecipes.length} Saved Recipes
            </span>
          )}
        </div>
      </div>

      {saveSuccessMsg && (
        <div
          style={{
            padding: '0.75rem 1.2rem',
            background: 'var(--mint-100)',
            border: '1.5px solid var(--mint-400)',
            borderRadius: 'var(--radius-md)',
            color: 'var(--mint-700)',
            fontWeight: 700,
            fontSize: '0.9rem',
            marginBottom: '1rem',
            animation: 'slideUp 0.3s ease',
          }}
        >
          ✨ {saveSuccessMsg}
        </div>
      )}

      {/* Main Chat Layout */}
      <div
        className="card"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '660px',
          padding: 0,
          overflow: 'hidden',
          marginBottom: '1.5rem',
        }}
      >
        {/* Messages Feed */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.2rem',
            background: 'linear-gradient(180deg, #FFFFFF 0%, var(--cream-100) 100%)',
          }}
        >
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isUser ? 'flex-end' : 'flex-start',
                }}
              >
                <div className={isUser ? 'chat-bubble-user' : 'chat-bubble-ai'}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.35rem' }}>
                    <span style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.8 }}>
                      {isUser ? 'You' : 'Chef FoodVerse'}
                    </span>
                    {!isUser && (
                      <button
                        onClick={() => speakText(msg.content)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          color: 'var(--forest-800)',
                          opacity: 0.7,
                        }}
                        title={isSpeaking ? 'Stop speaking' : 'Read aloud'}
                      >
                        {isSpeaking ? <VolumeX size={15} /> : <Volume2 size={15} />}
                      </button>
                    )}
                  </div>
                  <div style={{ fontSize: '0.92rem', lineHeight: '1.55', whiteSpace: 'pre-wrap' }}>
                    {msg.content}
                  </div>

                  {/* Render Recipe Card if provided */}
                  {msg.suggested_recipe && (
                    <div
                      style={{
                        marginTop: '1rem',
                        padding: '1.2rem',
                        background: '#FFFFFF',
                        borderRadius: 'var(--radius-lg)',
                        border: '1.5px solid var(--mint-300)',
                        color: 'var(--forest-900)',
                        boxShadow: 'var(--shadow-sm)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.8rem' }}>
                        <div>
                          <span className="badge badge-mint" style={{ marginBottom: '0.4rem' }}>
                            {msg.suggested_recipe.cuisine} • {msg.suggested_recipe.difficulty}
                          </span>
                          <h3 style={{ fontSize: '1.3rem', color: 'var(--forest-900)' }}>
                            {msg.suggested_recipe.title}
                          </h3>
                          <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)' }}>
                            {msg.suggested_recipe.description}
                          </p>
                        </div>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleSaveRecipe(msg.suggested_recipe)}
                        >
                          <Bookmark size={14} /> Save Recipe
                        </button>
                      </div>

                      {/* Recipe Quick Stats */}
                      <div
                        style={{
                          display: 'flex',
                          gap: '1.2rem',
                          margin: '0.9rem 0',
                          padding: '0.6rem 0.9rem',
                          background: 'var(--cream-100)',
                          borderRadius: 'var(--radius-md)',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          flexWrap: 'wrap',
                        }}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Clock size={15} color="var(--mint-600)" /> Prep: {msg.suggested_recipe.prep_time_minutes}m | Cook: {msg.suggested_recipe.cook_time_minutes}m
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Users size={15} color="var(--mint-600)" /> Servings: {msg.suggested_recipe.servings}
                        </span>
                        {msg.suggested_recipe.calories_per_serving && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                            <Flame size={15} color="var(--accent-amber)" /> {msg.suggested_recipe.calories_per_serving} kcal/serv
                          </span>
                        )}
                      </div>

                      {/* Ingredients */}
                      <div style={{ marginBottom: '1rem' }}>
                        <h4 style={{ fontSize: '0.98rem', marginBottom: '0.5rem', color: 'var(--forest-900)' }}>
                          🧂 Ingredients:
                        </h4>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.45rem' }}>
                          {msg.suggested_recipe.ingredients.map((ing, i) => (
                            <div
                              key={i}
                              style={{
                                fontSize: '0.83rem',
                                padding: '0.35rem 0.6rem',
                                background: 'var(--mint-50)',
                                borderRadius: 'var(--radius-sm)',
                                border: '1px solid var(--mint-200)',
                              }}
                            >
                              <strong>{ing.amount}</strong> {ing.name}
                              {ing.substitution && (
                                <span style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                                  Alt: {ing.substitution}
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Step-by-Step Instructions */}
                      <div>
                        <h4 style={{ fontSize: '0.98rem', marginBottom: '0.5rem', color: 'var(--forest-900)' }}>
                          👨‍🍳 Step-by-Step Instructions:
                        </h4>
                        <ol style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.86rem', lineHeight: '1.6' }}>
                          {msg.suggested_recipe.steps.map((st, i) => (
                            <li key={i} style={{ marginBottom: '0.5rem' }}>
                              <span>{st.instruction}</span>
                              {st.tip && (
                                <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--mint-700)', fontStyle: 'italic' }}>
                                  💡 Chef Tip: {st.tip}
                                </span>
                              )}
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  )}

                  {/* Render Substitutions Table if present */}
                  {msg.substitutions && msg.substitutions.length > 0 && (
                    <div style={{ marginTop: '0.9rem' }}>
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--forest-800)' }}>
                        🔄 Recommended Culinary Substitutes:
                      </span>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', marginTop: '0.4rem' }}>
                        {msg.substitutions.map((sub, i) => (
                          <div
                            key={i}
                            style={{
                              fontSize: '0.82rem',
                              padding: '0.5rem 0.8rem',
                              background: '#FFFFFF',
                              borderRadius: 'var(--radius-sm)',
                              border: '1px solid var(--cream-border)',
                            }}
                          >
                            <strong>{sub.original}</strong> ➔ <span style={{ color: 'var(--mint-600)', fontWeight: 600 }}>{sub.substitute}</span>
                            {sub.flavor_profile && (
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                Note: {sub.flavor_profile}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Follow-up Prompts */}
                  {msg.follow_up_suggestions && msg.follow_up_suggestions.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.8rem' }}>
                      {msg.follow_up_suggestions.map((suggestion, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(suggestion)}
                          style={{
                            background: '#FFFFFF',
                            border: '1px solid var(--mint-300)',
                            color: 'var(--forest-900)',
                            padding: '0.25rem 0.65rem',
                            borderRadius: 'var(--radius-pill)',
                            fontSize: '0.76rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                          }}
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--mint-600)', fontSize: '0.88rem', fontWeight: 600 }}>
              <span className="pulse-indicator" />
              Chef Gemini is formulating recipe & culinary advice...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick prompt chips bar */}
        {quickPrompts.length > 0 && (
          <div
            style={{
              padding: '0.6rem 1.2rem',
              background: 'var(--cream-50)',
              borderTop: '1px solid var(--cream-border)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              overflowX: 'auto',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: '0.76rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              Ideas:
            </span>
            {quickPrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(prompt)}
                style={{
                  background: '#FFFFFF',
                  border: '1px solid var(--cream-border)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: 'var(--radius-pill)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  color: 'var(--forest-900)',
                  cursor: 'pointer',
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        )}

        {/* Input Bar */}
        <div
          style={{
            padding: '0.9rem 1.2rem',
            background: '#FFFFFF',
            borderTop: '1px solid var(--cream-border)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
          }}
        >
          {/* Voice Input Mic */}
          <button
            type="button"
            className="btn btn-secondary btn-icon"
            onClick={toggleVoiceInput}
            style={{
              background: isListening ? '#FEE2E2' : 'var(--cream-50)',
              borderColor: isListening ? '#EF4444' : 'var(--cream-border)',
              color: isListening ? '#B91C1C' : 'var(--forest-800)',
            }}
            title={isListening ? 'Listening... click to stop' : 'Click to speak'}
          >
            {isListening ? <MicOff size={19} /> : <Mic size={19} />}
          </button>

          <input
            type="text"
            className="form-input"
            placeholder={isListening ? 'Listening to voice input...' : 'Ask Chef FoodVerse for recipes, substitutions, cooking timers...'}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            disabled={loading}
          />

          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleSendMessage()}
            disabled={loading || !inputMessage.trim()}
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookingAssistant;
