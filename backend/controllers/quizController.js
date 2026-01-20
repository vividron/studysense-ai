import Quiz from "../models/quiz.js";
import User from "../models/user.js";
import { updateQuizStreak } from "../utils/quizStreakHelper.js";

export const getQuizzes = async (req, res, next) => {
    try {
        const quizzes = await Quiz.find({
            userId: req.user._id,
            documentId: req.params.documentId
        }).select("-userId -documentId").sort({ createdAt: -1 });

        if (!quizzes) {
            return res.status(400).json({
                success: false,
                error: 'No quizzes available for this document',
                statusCode: 400
            });
        }

        res.status(200).json({
            success: true,
            count: quizzes.length,
            data: quizzes
        });
    } catch (error) {
        next(error);
    }
}

export const getQuizById = async (req, res, next) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(400).json({
                success: false,
                error: 'Quiz not found',
                statusCode: 400
            });
        }

        res.status(200).json({
            success: true,
            data: quiz
        });
    } catch (error) {
        next(error);
    }
}

export const submitQuiz = async (req, res, next) => {
    try {
        const { answers } = req.body;

        if (!answers && !Array.isArray(answers)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid answer format',
                statusCode: 400
            });
        }
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(400).json({
                success: false,
                error: 'Quiz not found',
                statusCode: 400
            });
        }

        let correctCount = 0;
        const userAnswers = [];

        answers.forEach(answer => {
            const { questionIndex, selectedAnswer } = answer;

            if (quiz.questions.length > questionIndex) {
                // Get the question object from questions array using question index 
                const question = quiz.questions[questionIndex];
                const isCorrect = selectedAnswer === question.correctAnswer;

                if (isCorrect) correctCount++;

                userAnswers.push({
                    questionIndex,
                    selectedAnswer,
                    isCorrect
                });
            }
        });

        // Calculate score
        const score = Math.round((correctCount / quiz.questions.length) * 100);

        quiz.userAnswers = userAnswers;
        quiz.score = score;
        quiz.completedAt = new Date();

        await quiz.save();

        // Update Quiz streak count
        const user = await User.findById(req.user._id);
        await updateQuizStreak(user);

        res.status(200).json({
            success: true,
            data: {
                quizId: quiz._id,
                title: quiz.title,
                score,
                totalQuestions: quiz.questions.length,
                correctCount,
                userAnswers
            },
            message: "Quiz submitted successfully"
        });
    } catch (error) {
        next(error);
    }
}

export const getQuizResult = async (req, res, next) => {
    try {
        const quiz = await Quiz.findById(req.params.id);

        if (!quiz) {
            return res.status(400).json({
                success: false,
                error: 'Quiz not found',
                statusCode: 400
            });
        }

        let correctCount = 0;
        // Create detailed Result
        const results = quiz.questions.map((question, index) => {
            const answer = quiz.userAnswers.find(answer => answer.questionIndex === index);
            if (answer?.isCorrect) correctCount++;

            return {
                question: question.question,
                options: question.options,
                isCorrect: answer?.isCorrect || false,
                selectedAnswer: answer?.selectedAnswer || null,
                correctAnswer: question.correctAnswer,
                explanation: question.explanation
            }
        });

        res.status(200).json({
            success: true,
            data: {
                quiz: {
                    quizId: quiz._id,
                    documentId: quiz.documentId,
                    title: quiz.title,
                    score: quiz.score,
                    totalQuestions: quiz.questions.length,
                    correctCount,
                    completedAt: quiz.completedAt
                },
                results
            }
        });

    } catch (error) {
        next(error);
    }
}

export const deleteQuiz = async (req, res, next) => {
    try {
        const quiz = await Quiz.findOneAndDelete({ _id: req.params.id });

        if (!quiz) {
            return res.status(400).json({
                success: false,
                error: 'Quiz not found',
                statusCode: 400
            });
        }

        res.status(200).json({
            success: true,
            message: "Quiz deleted successfully"
        })
    } catch (error) {
        next(error);
    }
}