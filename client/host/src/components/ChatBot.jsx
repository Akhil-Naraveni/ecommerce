import React, { useEffect, useRef, useState } from "react";
import {
    ChatContainer,
    ConversationHeader,
    MainContainer,
    Message,
    MessageInput,
    MessageList,
    TypingIndicator
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { aiAPI } from "../services/apiService";
import chatbotIcon from "../../icons/chatbot.svg";

const QUICK_PROMPTS = [
    "Suggest me good summer wear",
    "Show me footwear under $100",
    "What is best rated?"
];

const renderBoldText = (text) => {
    const parts = String(text || "").split(/(\*\*[^*]+\*\*)/g);

    return parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
            return <strong key={index}>{part.slice(2, -2)}</strong>;
        }

        return <React.Fragment key={index}>{part}</React.Fragment>;
    });
};

const ChatMessageContent = ({ text }) => (
    <div style={{ whiteSpace: "pre-wrap" }}>
        {renderBoldText(text)}
    </div>
);

const QuickPromptButtons = ({ isLoading, onPromptClick }) => (
    <div
        aria-label="Suggested questions"
        style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 8,
            maxWidth: 260
        }}
    >
        {QUICK_PROMPTS.map((prompt) => (
            <button
                key={prompt}
                type="button"
                onClick={() => onPromptClick(prompt)}
                disabled={isLoading}
                style={{
                    minHeight: 34,
                    border: "1px solid #dedede",
                    borderRadius: 18,
                    background: "#fff8f0",
                    cursor: isLoading ? "not-allowed" : "pointer",
                    padding: "7px 10px",
                    fontSize: 12
                }}
            >
                {prompt}
            </button>
        ))}
    </div>
);


const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: "Hi! Ask me for outfit ideas, product comparisons, or budget-friendly picks from the catalog."
        }
    ]);
    const panelRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!isOpen) return;
            if (!panelRef.current) return;
            if (panelRef.current.contains(event.target)) return;
            if (event.target.closest?.(".ai-chat-launcher")) return;
            setIsOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const sendMessage = async (messageText) => {
        const trimmedMessage = messageText.trim();
        if (!trimmedMessage || isLoading) return;

        setMessages((currentMessages) => [
            ...currentMessages,
            { role: "user", content: trimmedMessage }
        ]);
        setIsLoading(true);

        try {
            const response = await aiAPI.askShoppingAssistant(trimmedMessage);
            const reply = response?.data?.reply || "I could not find a helpful recommendation right now.";
            setMessages((currentMessages) => [
                ...currentMessages,
                { role: "assistant", content: reply }
            ]);
        } catch (error) {
            const errorMessage = error?.response?.data?.error || "The assistant is unavailable right now. Please try again.";
            setMessages((currentMessages) => [
                ...currentMessages,
                { role: "assistant", content: errorMessage, isError: true }
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            style={{
                position: "fixed",
                right: 22,
                bottom: 22,
                zIndex: 12000
            }}
        >
            {isOpen && (
                <section
                    ref={panelRef}
                    aria-label="AI shopping assistant"
                    style={{
                        width: "min(390px, calc(100vw - 32px))",
                        height: "min(590px, calc(100vh - 110px))",
                        marginBottom: 14,
                        boxShadow: "0 18px 40px rgba(0, 0, 0, 0.22)"
                    }}
                >
                    <MainContainer responsive>
                        <ChatContainer>
                            <ConversationHeader>
                                <ConversationHeader.Content
                                    userName="AI Shopping Assistant"
                                    info="Catalog recommendations"
                                />
                                <ConversationHeader.Actions>
                                    <button
                                        type="button"
                                        onClick={() => setIsOpen(false)}
                                        aria-label="Close chat"
                                        style={{
                                            width: 32,
                                            height: 32,
                                            border: "1px solid #d8d8d8",
                                            borderRadius: "50%",
                                            background: "#fff",
                                            cursor: "pointer"
                                        }}
                                    >
                                        X
                                    </button>
                                </ConversationHeader.Actions>
                            </ConversationHeader>

                            <MessageList
                                typingIndicator={
                                    isLoading ? <TypingIndicator content="Finding products..." /> : null
                                }
                            >
                                 <Message
                                    model={{
                                        direction: "incoming",
                                        position: "single",
                                        type: "custom"
                                    }}
                                >
                                    <Message.CustomContent>
                                        <QuickPromptButtons
                                            isLoading={isLoading}
                                            onPromptClick={sendMessage}
                                        />
                                    </Message.CustomContent>
                                </Message>
                                {messages.map((message, index) => {
                                    const direction = message.role === "user" ? "outgoing" : "incoming";

                                    return (
                                        <Message
                                            key={`${message.role}-${index}`}
                                            model={{
                                                sentTime: "just now",
                                                sender: message.role === "user" ? "You" : "Assistant",
                                                direction,
                                                position: "single",
                                                type: "custom"
                                            }}
                                        >
                                            <Message.CustomContent>
                                                <ChatMessageContent text={message.content} />
                                            </Message.CustomContent>
                                        </Message>
                                    );
                                })}
                            </MessageList>

                            <MessageInput
                                placeholder="Ask for product suggestions..."
                                attachButton={false}
                                disabled={isLoading}
                                onSend={sendMessage}
                            />
                        </ChatContainer>
                    </MainContainer>
                </section>
            )}

            <button
                type="button"
                className="ai-chat-launcher"
                onClick={() => setIsOpen((currentValue) => !currentValue)}
                aria-label={isOpen ? "Close AI shopping assistant" : "Open AI shopping assistant"}
                style={{
                    borderRadius: "50%",
                    border: "2px solid #fff",
                    background: "darkOrange",
                    color: "#fff",
                    fontWeight: 800,
                    cursor: "pointer",
                    boxShadow: "0 10px 24px rgba(0, 0, 0, 0.24)"
                }}
            >
                <img
                    src={chatbotIcon}
                    alt="Chatbot Icon"
                    style={{ width: 62, height: 62 }}
                />
            </button>
        </div>
    );
};

export default ChatBot;
