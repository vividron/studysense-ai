const Tabs = ({tabs, activeTab, setActiveTab}) => {
  return (
    <div className="flex gap-3 bg-(--bg-surface) p-2 rounded-full shadow-lg w-full max-w-fit">
        {tabs.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => setActiveTab(label)}
            className={`min-w-0 flex items-center justify-center gap-2 px-5 py-2 rounded-full text-[12px] tablet:text-sm font-medium transition duration-300
                ${activeTab === label
                ? "bg-linear-to-r from-(--primary) to-indigo-500 text-white scale-105"
                : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
          >
            <Icon size={16} className={"hidden tablet:inline"}/>
            {label}
          </button>
        ))}
      </div>
  )
}

export default Tabs