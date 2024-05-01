import { useState, useEffect } from "react";

const App = () => {
  const [inputValue, setInputValue] = useState('');
  const [respondMessage, setRespondMessage] = useState(null);

  const [chatHistory, setChatHistory] = useState([[]]);
  const [currentChatIndex, setCurrentChatIndex] = useState(0);

  const clearMessage = () => {
    setInputValue('')
    setRespondMessage(null)
  }

  const startNewChat = () => {
    clearMessage()
    if (chatHistory[currentChatIndex] && chatHistory[currentChatIndex].length > 0) {
      setCurrentChatIndex(chatHistory.length)
      setChatHistory(prevChatHistory => [...prevChatHistory, []])
    }
  }

  const restoreChat = (chatIndex) => {
    clearMessage()
    setCurrentChatIndex(chatIndex)
  }

  const getMessages = async () => {
    const options = {
      method: 'POST',
      body: JSON.stringify({
        message: inputValue,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    }
    try {
      const response = await fetch('http://localhost:8000/completions', options)
      const data = await response.json()
      setRespondMessage(data.choices[0].message)
    } catch (error) {
      console.error(error)
    }
  }

  const storeChatHistory = () => {
    if (inputValue && respondMessage) {
      const newChatHistory = chatHistory.map((chat, index) => {
        if (index === currentChatIndex) {
          return chat.concat([
            {
              role: 'user',
              content: inputValue,
            },
            {
              role: respondMessage.role,
              content: respondMessage.content,
            },
          ])
        } else {
          return chat
        }
      })
      setChatHistory(newChatHistory)
    }
  }

  useEffect(() => {
    storeChatHistory()
  }, [respondMessage]);

  useEffect(() => {
    clearMessage()
    console.log(chatHistory)
  }, [chatHistory]);

  return (
      <div className="app">
        <section className="side-bar">
          <button onClick={startNewChat}>+ New Chat</button>
          <ul className="history">
            {chatHistory.map((chats, index) =>
              <li key={index} onClick={() => restoreChat(index)}>{chats[0]?.content}</li>
            )}
          </ul>
          <nav>
            <p>Made by Liwei</p>
          </nav>
        </section>
        <section className="main">
            <h1>LiweiGPT</h1>
            <ul className="feed">
              {chatHistory[currentChatIndex].map((chat, index) =>
                <li key={index}>
                  <p className="role">{chat.role}</p>
                  <p>{chat.content}</p>
                </li>
              )}
            </ul>
            <div className="bottom-section">
                <div className="input-container">
                    <input value={inputValue} onChange={e => setInputValue(e.target.value)}
                           onKeyDown={e => e.key === 'Enter' && getMessages()}/>
                    <div id="submit" onClick={getMessages}>➢</div>
                </div>
                <p className="info">
                    LiweiGPT can make mistakes. Consider checking important information.
                    Our goal is to make AI systems more natural and safe to interact with.
                    Your feedback will help us improve.
                </p>
            </div>
        </section>
      </div>
  )
}

export default App;
