import { CircleQuestionMark, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../Button";

const QuizCard = ({ quiz, handleDelete }) => {

    return (
        <div className="relative group rounded-xl bg-(--bg-surface) border border-(--primary)/50 desktop:border-white/10 p-5 transition hover:shadow-lg hover:border-(--primary)/40">
            <div className="space-y-3">
                <div className="flex items-start gap-3">
                    <CircleQuestionMark className="text-(--primary)" />
                    <div className="flex-1 min-w-0 space-y-3">
                        <p className="text-[15px] font-bold mr-4 truncate">{quiz.title}</p>
                        <div className="flex items-center gap-3">
                            <span className="text-sm font-semibold text-white/80 mb-1">{`Score: ${quiz.score}`}
                            </span>
                            <span className="text-xs rounded-full px-4 py-1 bg-black/10 font-semibold text-white/80 border border-white/20">
                                {`${quiz.questions?.length} Questions`}</span>
                        </div>
                    </div>
                </div>
                <div className='mt-2 h-px gradient bg-linear-to-r from-white/10 via-white/20 to-white/10' />

                {quiz?.completedAt ? (
                    <div className="flex flex-col gap-3">
                        <Link to={`/quizzes/${quiz._id}`}>
                            <Button
                                label="Reattempt"
                                className="w-full text-white/80 hover:text-white bg-linear-to-r from-(--primary)/70 to-blue-600/70 hover:from-(--primary) hover:to-blue-600"
                            />
                        </Link>
                        <Link to={`/quizzes/${quiz._id}/results`}>
                            <Button
                                label="View Result"
                                className="w-full text-white/80 hover:text-white border border-white/10 bg-linear-to-r from-(--bg-surface-hover)! desktop:from-(--bg-surface)! to-(--bg-surface)! hover:from-white/10! hover:to-(--bg-surface-hover)!"
                            />
                        </Link>
                    </div>
                ) : (
                    <Link to={`/quizzes/${quiz._id}`}>
                        <Button
                            label="Start Quiz"
                            className="w-full bg-linear-to-r from-(--primary)/70 to-blue-600/70 hover:from-(--primary) hover:to-blue-600"
                        />
                    </Link>
                )}
            </div>
            <button
                onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(quiz);
                }}
                className="absolute top-4 right-4 text-red-300 tablet:text-white/60 hover:text-red-400 transition">
                <Trash2 className="size-3.5 desktop:size-4" />
            </button>
        </div>
    )
}

export default QuizCard;