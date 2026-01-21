const QuizResultQuestionCard = ({results}) => {
  return (
    <div className="flex flex-col gap-4">
          {results.map((result, index) => (
            <div
              key={index}
              className="bg-(--bg-surface) border border-white/10 rounded-xl p-5 flex flex-col gap-4">
              {/* Question Header */}
              <div className="flex items-start justify-between">
                <h3 className="mt-3 text-lg text-white">
                  <span className="font-semibold">Question no.{index + 1} </span>
                  {result.question}
                </h3>
              </div>

              {/* Options */}
              <div className="flex flex-col gap-2">
                {result.options.map((opt, i) => {
                  const isCorrect = opt === result.correctAnswer;
                  const isSelected = opt === result.selectedAnswer;

                  return (
                    <div
                      key={i}
                      className={`px-4 py-3 rounded-lg border flex justify-between items-center
                      ${isCorrect? "border-green-500/40 bg-green-500/5 text-green-300"
                          : isSelected
                            ? "border-red-500/40 bg-red-500/5 text-red-300"
                            : "border-white/10 text-white/70"}`}>
                      <span className='mr-2'>{opt}</span>

                      {isCorrect && (
                        <span className="text-xs font-semibold whitespace-nowrap">Correct</span>
                      )}
                      {isSelected && !isCorrect && (
                        <span className="text-xs font-semibold whitespace-nowrap">Your Answer</span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Explanation */}
              {result.explanation && (
                <div className="text-[15px] border border-white/10 rounded-lg p-3 bg-white/5 text-white/90">
                  <span className="font-semibold">Explanation: </span>
                  {result.explanation}
                </div>
              )}
            </div>
          ))}
    </div>
  )
}

export default QuizResultQuestionCard