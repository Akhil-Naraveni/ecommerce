import React from "react"

const ChatBot = () => {
    return (
        <div className="chatBotContainer">
            <div className="chatHeader">Chat with us!</div>
            <div className="chatMessages">
                <div className="message botMessage">Hello! How can I assist you today?</div>
                <button>About Order</button>
                <button>Product Inquiry</button>
                <button>Return Policy</button>
            </div>
            <div className="chatInputSection">
                <input type="text" className="chatInput" placeholder="Type your message..." />
                <button className="sendBtn">Send</button>
            </div>
        </div>
    )
}
export default ChatBot;