import { useEffect, useState } from "react";
import Button from "../../components/Button";
import { FileText, Upload } from "lucide-react";
import * as documentService from "../../api/document.api"
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import UploadDocumentModal from "../../components/documents/UploadDocumentModal";
import DeleteConfirmationModal from "../../components/DeleteConfimModal";
import DocumentCard from "../../components/documents/DocumentCard";

const DocumentListPage = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      const data = await documentService.getDocuments();
      setDocuments(data.documents)
    } catch (error) {
      toast.error(error.message || "Failed to fetch documents");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDocuments();
  }, []);

  // UploadDocument modal 
  const [showUploadModal, setShowUploadModal] = useState(false);

  const handleUpload = async (data) => {
    const title = data.title;
    const file = data.file[0];

    const formData = new FormData();
    formData.append("title", title);
    formData.append("document", file);
    setLoading(true);

    try {
      const data = await documentService.uploadDocument(formData);
      toast.success("Document uploaded successfully!");
      console.log(data)
      setDocuments(prev => [...prev, data.document].sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate)));
      setShowUploadModal(false)
    } catch (error) {
      toast.error(error.message || "Upload failed")
    } finally {
      setLoading(false);
    }

  }

  // delete document confirmation modal
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = (doc) => {
    setDocToDelete(doc);
    setIsDeleteConfirmOpen(true);
  }

  const handleConfirmDelete = async () => {
    setIsDeleting(true)
    try {
      await documentService.deleteDocument(docToDelete._id);
      toast.success(`${docToDelete.title} deleted`);
      setIsDeleteConfirmOpen(false);
      setDocuments(documents.filter((doc) => doc._id !== docToDelete._id));
      setDocToDelete(null);
    } catch (error) {
      toast.error(error.message || `Failed to delete ${docToDelete.title}`)
    } finally {
      setIsDeleting(false);
    }
  }

  const handleCancelDelete = () => {
    setIsDeleteConfirmOpen(false);
    setDocToDelete(null);
  }

  if (loading) return <Loader />

  return (
    <div className="h-full flex flex-col gap-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1 mr-4">
            <h1 className="text-2xl font-bold text-white">Documents</h1>
            <p className="text-sm text-white/60">
              Upload and click the card to begin
            </p>
          </div>
          <Button
            label={"Upload Document"}
            onClick={() => setShowUploadModal(true)}
            icon={Upload}
            shrinkText={true}
          />
        </div>
        <div className='tablet:hidden h-px gradient bg-linear-to-r from-white/10 via-white/20 to-white/10' />
      </div>

      {/*Upload modal*/}
      {showUploadModal && (
        <UploadDocumentModal
          onClose={() => setShowUploadModal(false)}
          handleUpload={handleUpload}
        />
      )}

      {/*Delete confirm modal*/}
      {isDeleteConfirmOpen && (
        <DeleteConfirmationModal
          isDeleting={isDeleting}
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          title={"Delete Document"}
          message={`Are you sure you want to delete "${docToDelete?.title ?? "the document"}"? This will also delete all associated quizzes and chat history. This action cannot be undone.`}
        />
      )}


      {documents.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 text-center p-5 gap-4 bg-(--bg-surface) rounded-xl border border-white/10">
          <div className="w-20 h-20 rounded-full bg-black/30 flex items-center justify-center border border-white/10">
            <FileText className="w-10 h-10 text-white/80" />
          </div>
          <h2 className="text-xl font-bold text-white">No documents yet</h2>
          <p className="text-[15px] text-white/60">
            Upload your first study document to get started
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto">
          <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 desktop:grid-cols-4">
            {documents.map((doc) => (
              <DocumentCard
                key={doc._id}
                doc={doc}
                handleDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentListPage;