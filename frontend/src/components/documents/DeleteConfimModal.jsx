const DeleteConfirmationModal = ({ fileName, onCancel, onConfirm, isDeleting }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/5 backdrop-blur-sm px-4">
            <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-(--bg-surface) p-6 shadow-xl">

                <h2 className="text-lg font-semibold text-white">
                    Delete Document
                </h2>

                <p className="text-sm text-white/70 leading-relaxed">
                    Are you sure you want to delete{" "}
                    <span className="font-medium text-white">
                        "{fileName}"
                    </span>
                    ? This will also delete all associated quizzes and chat history. This action cannot be undone.
                </p>

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onCancel}
                        className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 hover:bg-white/10 transition"
                    >
                        Cancel
                    </button>
                    <button
                        disabled={isDeleting}
                        onClick={onConfirm}
                        className="rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-400 active:scale-[0.98] transition"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
