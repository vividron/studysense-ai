import { useState, useEffect } from "react";
import { generateSummary } from "../../api/ai.api";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../Loader";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

const SummaryUI = () => {

    const { id } = useParams();

    const [summary, setSummary] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchSummary = async () => {
        try {
            const { data } = await generateSummary(id)
            setSummary(data);
        } catch (error) {
            toast.error(error.message || "Failed to load Summary")
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchSummary();
    }, [id]);

    return (
        <div className="h-full flex bg-(--bg-surface) border border-white/10 rounded-2xl overflow-hidden">
            {loading ?
                // Loading chat history
                <div className="relative flex-1 flex items-center justify-center">
                    <Loader />
                    <p className="text-sm mt-20 text-white/50">Getting document summary...</p>
                </div> :
                // Chat messages
                <div className="flex-1 overflow-y-auto px-5 py-6 select-text">
                    {
                        !summary ? <div className="h-full flex justify-center items-center">
                            <p className="text-lg text-white/50">Error generating summary!</p>
                        </div> :

                        <div className="prose prose-invert prose-sm max-w-none overflow-auto">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeRaw]}>
                                {summary}
                            </ReactMarkdown>
                    </div>}
                </div>}
        </div>
    );
};

export default SummaryUI;
