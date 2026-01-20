import { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
import { generateQuiz } from '../../api/ai.api';
import { useParams } from 'react-router-dom';
import QuizGenerateModal from './QuizGenerateModal';
import { deleteQuiz, getQuizzes } from '../../api/quiz.api';
import { BadgeQuestionMark, Sparkle } from 'lucide-react';
import Button from '../Button';
import DeleteConfirmationModal from '../DeleteConfimModal';
import QuizCard from './QuizCard';
import Loader from '../Loader';

const QuizzesInterface = () => {

    const { id } = useParams();

    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchQuizzes = async () => {
        try {
            const { data } = await getQuizzes(id);
            setQuizzes(data);
        } catch (error) {
            toast.error(error.message || "Failed to fetch Quizzes");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchQuizzes();
    }, [id]);

    // Generate quiz modal
    const [isQuizGenModalOpen, setIsQuizGenModalOpen] = useState(false);
    const [numOfQuestions, setNumOfQuestions] = useState(null);
    const [quizTitle, setQuizTitle] = useState(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [numQuesError, setNumQuesError] = useState(null);

    // Delete confirmation modal
    const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
    const [quizToDelete, setquizToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = (doc) => {
        setquizToDelete(doc);
        setIsDeleteConfirmOpen(true);
    }

    const handleConfirmDelete = async () => {
        setIsDeleting(true)
        try {
            await deleteQuiz(quizToDelete._id);
            toast.success(`${quizToDelete.title} deleted`);
            setIsDeleteConfirmOpen(false);
            setQuizzes(quizzes.filter((quiz) => quiz._id !== quizToDelete._id));
            setquizToDelete(null);
        } catch (error) {
            toast.error(error.message || `Failed to delete ${quizToDelete.title}`)
        } finally {
            setIsDeleting(false);
        }
    }

    const handleCancelDelete = () => {
        setIsDeleteConfirmOpen(false);
        setquizToDelete(null);
    }

    const handleGenerate = async (e) => {
        e.preventDefault();

        const count = Number(numOfQuestions);

        if (!count || count <= 0) {
            setNumQuesError("Enter a valid number");
            return;
        }
        if (count > 25) {
            setNumQuesError("Can't generate more than 25 quizzes");
            return;
        }

        setNumQuesError(null);
        try {
            setIsGenerating(true);
            const { data } = await generateQuiz(id, numOfQuestions, quizTitle);
            toast.success("Quiz generated successfully!");
            setQuizzes(prev => [...prev, data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
            setIsQuizGenModalOpen(false)
        } catch (error) {
            toast.error(error.message || "Failed to generate quiz!");
        } finally {
            setIsGenerating(false);
        }
    }
    return (
        <div className="h-full flex flex-col bg-(--bg-surface) border border-white/10 rounded-2xl p-5 gap-8">
            {/* Header */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold text-white">Quizzes</h1>
                    <Button
                        label={"Generate Quiz"}
                        onClick={() => setIsQuizGenModalOpen(true)}
                        icon={Sparkle}
                        shrinkText={false}
                    />
                </div>
            </div>

            {/*Generate quiz modal*/}
            {isQuizGenModalOpen && (
                <QuizGenerateModal
                    onClose={() => setIsQuizGenModalOpen(false)}
                    handleGenerate={handleGenerate}
                    numOfQuestions={numOfQuestions}
                    setNumOfQuestions={setNumOfQuestions}
                    quizTitle={quizTitle}
                    setQuizTitle={setQuizTitle}
                    isGenerating={isGenerating}
                    numQuesError={numQuesError}
                />
            )}

            {/*Delete confirm modal*/}
            {isDeleteConfirmOpen && (
                <DeleteConfirmationModal
                    isDeleting={isDeleting}
                    onCancel={handleCancelDelete}
                    onConfirm={handleConfirmDelete}
                    title={"Delete Quiz"}
                    message={`Are you sure you want to delete "${quizToDelete?.title ?? "the Quiz"}"? This action cannot be undone.`}
                />
            )}

            {/* Loading quizzes */}
            {loading &&
                <div className="relative h-full flex items-center justify-center">
                    <Loader />
                    <p className="text-sm mt-20 text-white/50">Loading Quizzes...</p>
                </div>
            }

            {/* Quizzes */}
            {quizzes.length === 0 && !loading ? (
                <div className="flex flex-col items-center justify-center flex-1 text-center p-5 gap-4 bg-(--bg-surface) rounded-xl border border-white/10">
                    <div className="w-20 h-20 rounded-full bg-black/30 flex items-center justify-center border border-white/10">
                        <BadgeQuestionMark className="w-10 h-10 text-white/80" />
                    </div>
                    <h2 className="text-xl font-bold text-white">No Quiz Generated</h2>
                    <p className="text-[15px] text-white/60">
                        Generate your first quiz to get started
                    </p>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto">
                    <div className="grid gap-4 grid-cols-1 xs:grid-cols-2 desktop:grid-cols-4">
                        {quizzes.map((quiz) => (
                            <QuizCard
                                key={quiz._id}
                                quiz={quiz}
                                handleDelete={handleDelete}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default QuizzesInterface