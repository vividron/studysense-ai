const Button = ({ label, onClick, icon: Icon, shrinkText, style, type, isSubmitting }) => (
    <button
        onClick={onClick}
        disabled={isSubmitting}
        type={type ?? "button"}
        className={`${style} flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-linear-to-r from-(--primary) to-purple-500 
        hover:opacity-90 active:opacity-90 transition tablet:px-5 tablet:py-2.5 cursor-pointer`}>
        {Icon ? <Icon size={20} /> : <></>}
        {isSubmitting ? <span className="text-sm font-medium">Submitting...</span> : <span className={`text-sm font-medium ${shrinkText ? "hidden sm:block" : ""}`}>{label}</span>}
    </button>
);

export default Button