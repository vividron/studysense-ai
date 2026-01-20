const Button = ({
    label,
    onClick,
    icon: Icon,
    shrinkText = false,
    type = "button",
    isSubmitting = false,
    onSubmittingText,
    className = ""
}) => {

    const handleClick = (e) => {
        if (type === "submit") return;
        if (onClick) onClick(e)
    };

    return (
        <button
            type={type}
            disabled={isSubmitting}
            onClick={handleClick}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r
             from-(--primary) to-blue-500 transition tablet:px-5 tablet:py-2.5
            ${isSubmitting? "opacity-60 cursor-not-allowed" : "hover:opacity-90 active:opacity-90 cursor-pointer"} ${className}`}
        >
            {Icon && <Icon size={20} />}

            {isSubmitting ? (
                <span className="text-sm font-medium">
                    {onSubmittingText ?? "Submitting..."}
                </span>
            ) : (
                <span className={`text-sm font-medium ${shrinkText && "hidden sm:inline"}`}>
                    {label}
                </span>
            )}
        </button>
    );
};

export default Button;