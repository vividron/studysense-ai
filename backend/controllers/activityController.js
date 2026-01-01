import Document from "../models/document.js";
import Quiz from "../models/quiz.js";

export const getActivity = async(req, res, next) => {
    try {
        const userId = req.user._id;
        const quizzes = await Quiz.find({userId});

        const totalDocuments = Document.countDocuments({userId});
        const totalQuizzes = quizzes.length;
        const completedQuiz = await Quiz.find({userId}, {completedAt: {$ne:null}});

        // Average quiz score
        const averageScore = Math.round(quizzes.reduce((scoreSum, quiz) => scoreSum + quiz.score,0) / totalQuizzes);

        // recent activity
        const recentDocuments = Document.find({userId}).sort({lastAccessed: -1}).limit(5).select("title filename lastAccessed status");
        const recentQuizzes = Quiz.find({userId}).sort({createdAt: -1}).limit(5).select("title score completedAt");

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalDocuments,
                    totalQuizzes,
                    completedQuiz,
                    averageScore
                },
                recentActivity: {
                    documents: recentDocuments,
                    quizzes: recentQuizzes
                }
            }
        });
    } catch (error) {
        next(error);
    }
}