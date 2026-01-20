import { X } from "lucide-react";
import Button from "../Button";

const QuizGenerateModal = ({ onClose, handleGenerate, numOfQuestions, setNumOfQuestions, quizTitle, setQuizTitle, isGenerating, numQuesError }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div
                className="w-full max-w-sm tablet:max-w-md rounded-2xl space-y-5 border border-white/10 bg-(--bg-surface) p-6">

                {/*Header */}
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-white">
                        Generate Quiz
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-white/60 hover:text-white transition"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form
                    onSubmit={handleGenerate}
                    className="space-y-5">

                    {/**Quiz title */}
                    <input
                        type="text"
                        value={quizTitle || ""}
                        onChange={(e) => setQuizTitle(e.target.value)}
                        placeholder="Quiz title"
                        className="w-full placeholder:text-white/50 bg-transparent border focus:outline-none border-white/20
                         focus:border-white/80 rounded-xl px-5 py-2"
                    />

                    {/* Number of question */}
                    <div className="space-y-2">
                        <input
                            type="number"
                            value={numOfQuestions || ""}
                            onChange={(e) => setNumOfQuestions(e.target.value)}
                            placeholder="Number of Questions"
                            className={`w-full placeholder:text-white/50 bg-transparent border focus:outline-none ${numQuesError ? "border-red-400 focus:border-red-400 appearance-none" : "border-white/20 focus:border-white/80"} rounded-xl px-5 py-2`}
                        />
                        {numQuesError && (<p className="text-red-400 text-sm ml-1">{numQuesError}</p>)}
                    </div>

                    <Button
                        label={"Generate Quiz"}
                        shrinkText={false}
                        className="w-full"
                        type={"submit"}
                        isSubmitting={isGenerating}
                        onSubmittingText={"Generating..."}
                    />
                </form>
            </div>
        </div>
    );
};

export default QuizGenerateModal;
