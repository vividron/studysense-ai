import { useEffect, useState } from "react";
import { ArrowLeft, CircleCheck, CircleQuestionMark, CircleX } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../../components/Loader";
import { getQuizResult } from "../../api/quiz.api";
import QuizResultQuestionCard from "../../components/quizzes/QuizResultQuestionCard";

const QuizResultPage = () => {
  const { quizId } = useParams();
  const navigate = useNavigate();

  const [quizResult, setQuizResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchQuizResult = async () => {
    try {
      const { data } = await getQuizResult(quizId);

      if (!data?.quiz && !data?.results) {
        toast.error(error.message || "failed to fetch result");
        navigate("/documents");
      }
      setQuizResult(data);
    } catch (error) {
      toast.error(error.message || "failed to fetch result");
      navigate("/documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizResult();
  }, [quizId]);

  if (loading) return <Loader />

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-400"
    else if (score >= 50) return "text-yellow-400"
    return "text-red-400"
  }

  return (
    <div className="h-full max-w-5xl mx-auto flex flex-col gap-3">

      {/* Heading */}
      <div className="flex gap-3">
        <Link
          to={`/documents/${quizResult.quiz?.documentId ?? ""}`}
          className="text-xl font-semibold text-white/80 hover:text-white transition flex items-center gap-1.5 mb-2"
        >
          <ArrowLeft size={18} />
          <h3>Back</h3>

        </Link>
        <h2 className="text-xl font-semibold text-white/80">
          {quizResult.quiz.title}
        </h2>
      </div>

      {/* Quiz Result*/}
      <div className="h-full overflow-auto flex flex-col gap-6">

        {/* Summary Card */}
        <div className="bg-(--bg-surface) border border-white/10 rounded-2xl p-6 w-full flex flex-col items-center justify-center gap-5">

          <div className="flex flex-col space-y-2 items-center">
            <h1 className={`text-4xl font-bold ${getScoreColor(quizResult.quiz.score)}`}>
              {quizResult.quiz.score}%
            </h1>
            <h2 className="text-lg text-white/80 font-bold mr-3">Score</h2>
          </div>

          <div className="flex flex-col sm:flex-row justify-center gap-3">

            <div className="px-4 py-1.5 w-fit rounded-full bg-blue-500/5 border border-blue-500/10 text-sm text-blue-300 flex items-center gap-2">
              <CircleQuestionMark size={18} />
              Total Questions {quizResult.quiz.totalQuestions}
            </div>

            <div className="px-4 py-1.5 w-fit rounded-full bg-green-500/5 border border-green-500/10 text-sm text-green-300 flex items-center gap-2">
              <CircleCheck size={18} />
              {quizResult.quiz.correctCount} Correct
            </div>

            <div className="px-4 py-1.5 w-fit rounded-full bg-red-500/5 border border-red-500/10 text-sm text-red-300 flex items-center gap-2">
              <CircleX size={18} />
              {quizResult.quiz.totalQuestions - quizResult.quiz.correctCount} Wrong
            </div>

          </div>
        </div>

        <h2 className="text-xl font-semibold text-white/80">
          Detail review
        </h2>

        {/* Question Results */}
        <QuizResultQuestionCard results={quizResult.results} />
      </div>
    </div>
  );
};

export default QuizResultPage;
