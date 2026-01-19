import { useState, useEffect, useRef } from "react";
import { ArrowUp, Ellipsis } from "lucide-react";
import * as chatService from "../../api/ai.api";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../Loader";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const ChatUI = () => {

  const { id } = useParams();

  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [isWaitingForRes, setIsWaitingForRes] = useState(false);
  const chatEndRef = useRef(null);

  // Initial response when no chat history avialable  
  const initialChatRes = {
    role: "ai",
    content: "Hi! Ask me questions about this document, and I’ll answer based on its content. <br/><b>Type /clear to delete chat history.</b>"
  }

  const fetchHistory = async () => {
    try {
      const { data } = await chatService.getChatHistory(id)

      if (data?.length === 0) {
        setMessages([initialChatRes]);
        return
      }
      setMessages(data);
    } catch (error) {
      toast.error(error.message || "Failed to load history")
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleSend = async () => {

    const userMsg = userInput;
    setUserInput("");

    if (!userMsg.trim()) return;
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);

    try {
      //Handle delte chat history
      if (userMsg.trim() === "/clear") {
        await chatService.deleteChatHistory(id);
        setMessages([initialChatRes]);
        return
      }

      setIsWaitingForRes(true);
      const { data } = await chatService.chat(id, userMsg);
      setMessages((prev) => [...prev, data]);
    } catch (error) {
      toast.error(error.message || "Failed to process chat request");
      setMessages((prev) => [...prev,
      {
        role: "ai",
        content: "Sorry, Something went wrong while generating the response. Please try again later.",
      },
      ]);
    } finally {
      setIsWaitingForRes(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="h-full flex flex-col bg-(--bg-surface) border border-white/10 rounded-2xl overflow-hidden">


      {loading ?
        // Loading chat history
        <div className="relative flex-1 flex items-center justify-center">
          <Loader />
          <p className="text-sm mt-20 text-white/50">Loading chat history...</p>
        </div> :
        // Chat messages
        <div className="flex-1 min-h-0 overflow-y-auto px-5 py-6 space-y-5">

          {messages.map((msg, index) => {
            const content = msg.content;
            console.log(content)
            const isUser = msg.role === "user";
            return (
              <div
                key={index}
                className={`flex ${isUser ? "justify-end" : "justify-start"} items-center`}
              >
                {/* Message */}
                <div
                  className={`max-w-[50%] tablet:max-w-[70%] px-4 py-3 text-xs tablet:text-sm rounded-2xl leading-relaxed ${isUser
                    ? "bg-(--primary-soft) text-white rounded-br-sm"
                    : "bg-white/5 text-white/80 rounded-bl-sm border border-white/10"
                    }`}
                >

                  {isUser ? content :
                    <div className="prose prose-invert prose-sm max-w-none overflow-auto">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeRaw]}
                      >
                        {content}
                      </ReactMarkdown>
                    </div>}
                </div>
              </div>
            )
          })}

          {isWaitingForRes && (
            <div className="flex justify-start">
              <div className="bg-white/5 border border-white/10 text-white/60 px-4 py-2 rounded-2xl rounded-bl-sm text-sm">
                <Ellipsis className="animate-pulse" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>}

      {/* Quesiton input bar */}
      <div className="border-t border-white/10 p-4 bg-(--bg-surface)">
        <div className="flex items-center gap-3">
          <input
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask from this document only."
            className="flex-1 bg-transparent border border-white/10 rounded-full px-5 py-3 text-sm text-white/80 placeholder:text-white/40 
            focus:outline-none focus:border-white/50"
          />

          <button
            onClick={handleSend}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 hover:border-white/20 flex items-center 
            justify-center text-white/80 hover:bg-white/10 transition"
          >
            <ArrowUp size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatUI;
