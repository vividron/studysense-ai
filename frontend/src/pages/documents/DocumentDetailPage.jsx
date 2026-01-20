import { useEffect, useState } from "react";
import { FileText, MessageCircle, Sparkles, HelpCircle } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Tabs from "../../components/Tabs";
import { getDocumentById } from "../../api/document.api"
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import ChatUI from "../../components/document-detail/ChatUI";
import SummaryUI from "../../components/document-detail/SummaryUI";
import QuizzesInterface from "../../components/quizzes/QuizzesInterface";

const DocumentDetailPage = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("View");
  const navigate = useNavigate();

  const fetchDocument = async () => {
    try {
      const { data } = await getDocumentById(id);

      if (!data) {
        toast.error("Document not found!");
        navigate("/documents");
        return;
      }
      setDocument(data);
    } catch (error) {
      toast.error(error.message || "failed to fetch document")
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDocument();
  }, [id])

  const renderDocView = () => {
    return (
      <div className="bg-(--bg-surface) border border-white/10 rounded-2xl overflow-hidden shadow-xl h-full">
        <div className="flex justify-between p-5">
          <span className="text-sm font-semibold">{document?.uploadDate && new Date(document.uploadDate).toLocaleString(undefined, {
            dateStyle: "medium", timeStyle: "short"
          })}</span>
          {document?.filePath && <a href={document.filePath} target="_blank" className="text-sm tablet:text-md text-white desktop:text-white/80 hover:text-white">
            Open in new tab
          </a>}
        </div>
        {document?.filePath ? (
          <iframe
            src={document?.filePath}
            title="Document Viewer"
            className="bg-[#151520] border border-none border-white/10 overflow-hidden h-full w-full min-w-0 min-h-0"
          />
        ) : (
          <div className="p-10 flex flex-col justify-center items-center text-red-400/60 gap-4">
            <FileText size={45} />
            <p className="text-sm tablet:text-lg">PDF not found. Invalid pdf path</p>
          </div>
        )}
      </div>
    )
  }

  const renderChat = () => <ChatUI />

  const renderSummary = () => <SummaryUI />
  const renderQuiz = () => <QuizzesInterface />

  const tabs = [
    { label: "View", icon: FileText, content: renderDocView() },
    { label: "Chat", icon: MessageCircle, content: renderChat() },
    { label: "Summary", icon: Sparkles, content: renderSummary() },
    { label: "Quiz", icon: HelpCircle, content: renderQuiz() },
  ];

  if (loading) return <Loader />

  return (
    <div className="h-full flex flex-col gap-4">

      {/* Header */}
      <div className="text-[15-px] tablet:text-lg desktop:text-xl font-semibold tracking-wide flex gap-0.5">
        <Link
          to={"/documents"}
          className="text-blue-500/80 desktop:text-white/80 hover:text-blue-500 hover:underline transition flex items-center gap-2">
          <h1>Documents/</h1>
        </Link>
        <h1>{document?.title ?? "Document"}</h1>
      </div>

      {/* Tabs */}
      <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Content */}
      <div className="flex-1 min-h-0 min-w-0">
        {
          tabs.map((tab) => {
            if (activeTab === tab.label) {
              return <div
                className="h-full w-full"
                key={tab.label}
              >
                {tab.content}
              </div>
            }
          })
        }
      </div>
    </div>
  );
}

export default DocumentDetailPage;
