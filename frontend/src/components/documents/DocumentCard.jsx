import { FileText, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const DocumentCard = ({ doc, handleDelete }) => {
    const navigate = useNavigate();

    const formatFileSize = (bytes) => {
        if (!bytes) return "N/A";
        const units = ["B", "KB", "MB", "GB", "TB"];
        let size = bytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${Math.round(size)} ${units[unitIndex]}`;
    };

    return (
        <div
            onClick={() => navigate(`/documents/${doc._id}`)}
            className="relative group rounded-xl bg-(--bg-surface) border border-white/10 p-5 transition hover:bg-(--bg-surface-hover) 
            hover:border-white/20 hover:scale-95 ease-in-out duration-300">
            <div className="space-y-3">
                <div className="flex items-start gap-3">
                    <FileText className="text-blue-400" />
                    <div className="flex-1 min-w-0 space-y-3">
                        <p className="text-sm font-semibold mr-4 truncate">{doc.title}</p>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-xs text-gray-400">{formatFileSize(doc.size)}
                            </span>
                            <div className="text-xs rounded-full px-3 py-0.5 bg-blue-500/10 text-blue-400 border border-blue-400/20">
                                {doc.quizCount > 1 ? `${doc.quizCount} Quizzes` : `${doc.quizCount} Quiz`}</div>
                        </div>
                    </div>
                </div>
                <div className='mt-2 h-px gradient bg-linear-to-r from-white/10 via-white/20 to-white/10' />
                <div className="text-xs text-gray-400">Uploaded on {new Date(doc.time).toLocaleString()}</div>
            </div>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(doc);
                }}
                className="absolute top-4 right-4 text-red-300 tablet:text-white/60 hover:text-red-400 transition">
                <Trash2 className="size-3.5 desktop:size-4" />
            </button>
        </div>
    )
}

export default DocumentCard;