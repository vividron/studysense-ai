import Document from "../models/document.js";
import Quiz from "../models/quiz.js";

export const getActivity = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const quizzes = await Quiz.find({ userId });

        const totalDocuments = await Document.countDocuments({ userId });
        const totalQuizzes = quizzes.length;
        const completedQuiz = await Quiz.countDocuments({ userId, completedAt: { $ne: null } });

        // Average quiz score
        const averageScore = Math.round(quizzes.reduce((scoreSum, quiz) => scoreSum + quiz.score, 0) / totalQuizzes);

        // recent activity
        const recentDocuments = await Document.find({ userId }).sort({ lastAccessed: -1 }).limit(5).select("title filename lastAccessed status");
        // get quizzes based on there completion then creation
        const recentQuizzes = await Quiz.aggregate([
            { $match: { userId } },

            {
                $addFields: {
                    lastActivityAt: { $ifNull: ["$completedAt", "$createdAt"] }
                }
            },

            { $sort: { lastActivityAt: -1 } },

            { $limit: 5 },

            {
                $project: {
                    title: 1,
                    score: 1,
                    completedAt: 1,
                    createdAt: 1
                }
            }
        ]);


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