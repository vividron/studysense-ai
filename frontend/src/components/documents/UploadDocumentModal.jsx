import { Upload, X } from "lucide-react";
import Button from "../Button";
import { useForm } from "react-hook-form";

const UploadDocumentModal = ({ onClose, handleUpload }) => {
    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
    const file = watch("file")?.[0];
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/5 backdrop-blur-xs p-4">
            <form
                onSubmit={handleSubmit(handleUpload)}
                className="w-full max-w-sm tablet:max-w-md rounded-2xl space-y-5 border border-white/10 bg-(--bg-surface) p-6">

                {/*Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">
                        Upload Document
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white/60 hover:text-white transition"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/**document title */}
                <div className="space-y-2">
                    <input
                        type="text"
                        {...register("title", {
                            required: "Title is required",
                            minLength: {
                                value: 3,
                                message: "Title must be at least 3 characters",
                            },
                        })}
                        placeholder="Document Title"
                        className={`w-full placeholder:text-white/50 bg-transparent border focus:outline-none ${errors.title ? "border-red-400 focus:border-red-400"
                            : "border-white/20 focus:border-white/80"} rounded-xl px-5 py-2`}
                    />
                    {errors.title && (
                        <p className="text-red-400 text-sm ml-1">{errors.title.message}</p>
                    )}
                </div>

                {/*Uplaod document section */}
                <label className="group flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/20 
                bg-black/20 p-6 text-center hover:border-white/40 transition cursor-pointer">

                    {!file ? (
                        <>
                            <Upload size={30} className="text-white/60 group-hover:text-white transition" />

                            <p className="text-sm text-white/80">
                                Click to select the document
                            </p>
                            <p className="text-xs text-white/50">
                                (PDF · max 10MB)
                            </p>
                        </>
                    ) : (
                        <>
                            <p className="text-sm text-white/80 font-medium w-full truncate">
                                {file.name}
                            </p>
                            <p className="text-xs text-white/50">
                                Click to change file
                            </p>
                        </>
                    )}

                    <input
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        {...register("file", { required: "File is required" })}
                    />
                    {errors.file && <p className="text-red-400 text-sm">{errors.file.message}</p>}
                </label>

                <Button
                    label={"Upload Document"}
                    shrinkText={false}
                    className="w-full"
                    type={"submit"}
                    isSubmitting={isSubmitting}
                    onSubmittingText={"Uploading..."}
                />
            </form>
        </div>
    );
};

export default UploadDocumentModal;
