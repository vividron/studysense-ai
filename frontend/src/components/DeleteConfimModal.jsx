const DeleteConfirmationModal = ({ title, message, onCancel, onConfirm, isDeleting }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
            <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-(--bg-surface) p-6 shadow-xl">

                <h2 className="text-lg font-semibold text-white">
                    {title}
                </h2>

                <p className="text-sm text-white/70 leading-relaxed">
                    {message}
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
                        className={`rounded-lg ${isDeleting? "bg-red-400 cursor-not-allowed" : "hover:bg-red-400 active:scale-[0.98] transition"} bg-red-500 px-4 py-2 text-sm font-medium text-white`}
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmationModal;
