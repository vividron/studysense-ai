import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import { getQuizById } from "../../api/quiz.api";
import { submitQuiz } from "../../api/quiz.api";
import QuestionCard from "../../components/quizzes/questionCard";
import { useAuth } from "../../context/authContext";

const QuizPage = () => {
  const { quizId } = useParams();
  const {updateUser} = useAuth();
  const navigate = useNavigate();

  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchQuiz = async () => {
    try {
      const { data } = await getQuizById(quizId);
      setQuiz(data);
    } catch (error) {
      toast.error(error.message || "failed to fetch quiz");
      navigate("/documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  const handleSelectOption = (option) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: option,
    }));
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmitQuiz = async () => {
    const answeredCount = Object.keys(answers).length;

    setSubmitting(true);
    try {
      // Format answers
      const formattedAnswers = quiz.questions.map((_, index) => ({
        questionIndex: index,
        selectedAnswer: answers[index],
        answeredAt: new Date(),
      }));

      const {data} = await submitQuiz(quizId, formattedAnswers);
      // update streak count
      updateUser({streak: data.streak, streakDate: data.streakDate});

      toast.success("Quiz submitted successfully!");
      navigate(`/quizzes/${quizId}/results`);
    } catch (error) {
      toast.error(error.message || "Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />

  const currentQuestion = quiz?.questions?.[currentQuestionIndex];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="h-full max-w-5xl mx-auto flex flex-col gap-3">
      {/* Heading */}
      <div className="flex gap-3">
        <Link
          to={`/documents/${quiz?.documentId ?? ""}`}
          className="text-xl font-semibold text-white/80 hover:text-white transition flex items-center gap-1.5 mb-2"
        >
          <ArrowLeft size={18} />
          <h3>Back</h3>
        </Link>
        <h2 className="text-xl font-semibold text-white/80">
          {quiz.title}
        </h2>
      </div>

      {/* Quiz */}
      <div className="h-full overflow-auto flex flex-col gap-6 p-6">
        <p className="text-sm text-white/60">{answeredCount} answered</p>

        {/* Question Card */}
        {currentQuestion && (
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={quiz.questions.length}
            handleSelectOption={handleSelectOption}
            selectedOption={answers[currentQuestionIndex]}
          />
        )}

        {/* navigation */}
        <div className="flex items-center justify-between">

          {/* Previous */}
          <button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          {/* Question switch button */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-xs tablet:max-w-md mx-5">
            {quiz.questions.map((ques, index) => {
              const isActive = index === currentQuestionIndex;
              const isAnswered = answers[index] !== undefined;

              return (
                <button
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={`size-8 flex items-center justify-center rounded-full text-sm font-medium shrink-0 transition ${isActive
                    ? "bg-blue-500 text-white"
                    : isAnswered
                      ? "bg-green-500/10 text-green-300 border border-green-500/40"
                      : "bg-white/10 text-white/60 hover:bg-white/20"
                    }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>

          {/* Next or Submit Button */}
          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <button
              onClick={handleSubmitQuiz}
              disabled={submitting || answeredCount < quiz.questions.length}
              className="px-5 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Submitting..." : "Submit"}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-5 py-2 rounded-lg bg-blue-600/80 text-white font-medium hover:bg-blue-600 transition"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
