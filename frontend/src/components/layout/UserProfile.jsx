import { Flame } from "lucide-react"
import { useAuth } from "../../context/authContext"

const UserProfile = () => {
    const {user} = useAuth();
    
    return (
        <div className="flex items-center gap-7">
            {/*User quiz streak*/}
            <div className="relative group cursor-pointer flex items-center gap-1 text-orange-500">
                <Flame className="w-5 h-5" />
                <span className="text-[15px] mt-1 font-semibold">{user.streak ?? 0}</span>
                {/* Tooltip */}
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-black px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100
                transition pointer-events-none">
                    Quiz Streak
                </span>
            </div>
            {/*User info*/}
            <div className="flex gap-2 items-center">
                <div className="flex h-8.5 w-8.5 items-center justify-center rounded-full 
                border-2 border-(--primary)
                text-sm font-semibold text-(--primary)">
                    {user.username ? user.username[0].toUpperCase() : "U"}
                </div>
                <div className="hidden desktop:flex flex-col justify-center">
                    <p className="text-sm text-white/90">{user.username ?? ""}</p>
                    <p className="text-xs text-white/60">{user.email ?? ""}</p>
                </div>
            </div>
        </div>
    )
}

export default UserProfile