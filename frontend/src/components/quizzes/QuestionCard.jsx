const QuestionCard = ({ question, questionNumber, totalQuestions, handleSelectOption, selectedOption }) => {

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "bg-green-500/5 text-green-300 border-green-500/30";
      case "medium":
        return "bg-yellow-500/5 text-yellow-300 border-yellow-500/30";
      case "hard":
        return "bg-red-500/5 text-red-300 border-red-500/30";
      default:
        return "bg-white/5 text-white/60 border-white/20";
    }
  };

  return (
    <div className="flex-1 bg-(--bg-surface) border border-white/10 rounded-xl p-6 tablet:p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* Question no. badge*/}
          <div className="px-5 py-2 rounded-full bg-blue-500/5 text-blue-300 text-xs font-medium border border-blue-500/30">
            Question {questionNumber}
          </div>
          
          {/* difficulty badge*/}
          {question.difficulty && (
            <div className={`px-5 py-2 rounded-full text-xs font-medium border ${getDifficultyColor(question.difficulty)}`}>
              {question.difficulty}
            </div>
          )}
        </div>
        <p className="text-sm text-white/50">{questionNumber} of {totalQuestions}</p>
      </div>

      {/* Question Text */}
      <h2 className="text-lg tablet:text-xl font-semibold text-white">
        {question.question}
      </h2>

      {/* Options */}
      <div className="flex flex-col gap-3 mt-2">
        {question.options?.map((option, index) => {
          const isSelected = selectedOption === option;

          return (
            <button
              key={index}
              onClick={() => handleSelectOption(option)}
              className={`group w-full flex items-center gap-3 px-4 py-3 rounded-lg border transition 
              ${isSelected
                  ? "border-(--primary)/50 bg-blue-800/5 text-blue-200"
                  : "border-white/10 text-white/80 hover:border-white/30 hover:bg-white/5 hover:text-white"
                }`}
            >
              <span
                className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0
                ${isSelected ? "border-blue-500 bg-blue-500/50" : "border-white/30"}
              `}
              >
                {isSelected && <span className="w-2 h-2 rounded-full bg-blue-400" />}
              </span>

              <span className="text-left">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuestionCard;