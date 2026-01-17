const StatCard = ({ label, value, icon: Icon, iconColor }) => {
    return (
        <div className="group rounded-xl bg-(--bg-surface) border border-white/10 p-5 transition hover:bg-(--bg-surface-hover) 
        hover:border-white/20 hover:scale-105 ease-in-out duration-300">
            <div className="flex items-center justify-between mb-4">
                <div className="text-white text-sm font-semibold pr-2">
                    {label}
                </div>
                <Icon size={22} className={iconColor} />
            </div>

            <div className="text-3xl font-semibold text-white">
                {value}
            </div>
        </div>
    );
};

export default StatCard;
