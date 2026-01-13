import { FileText, LayoutGrid, User } from "lucide-react";
import { NavLink } from "react-router-dom";

const NavItem = ({ variant }) => {
    const navlinks = [
        { to: '/activity', icon: LayoutGrid, text: 'My Activity' },
        { to: '/documents', icon: FileText, text: 'Documents' },
        { to: '/profile', icon: User, text: 'Profile' }
    ];

    if (variant === "desktop") {
        return (<nav className="flex items-center gap-6 font-semibold text-sm text-white/70 mx-2">
            {navlinks.map((link) => (
                <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) => `flex items-center gap-2 px-4 py-2 rounded-xl cursor-pointer 
                ${isActive ? "bg-purple-600/10 text-purple-400" : "hover:text-white hover:bg-(--bg-surface)"}`}
                >
                    <link.icon className="w-4 h-4" /> {link.text}
                </NavLink>
            ))}
        </nav>)
    }
    return (<nav className="fixed bottom-0 inset-x-0 bg-(--bg-main) border-t border-white/10 flex justify-around py-2 tablet:hidden">
        {navlinks.map((link) => (
            <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) => `flex flex-col gap-1 items-center text-xs font-semibold ${isActive ? "text-purple-400" : "text-white/60"}`}
            >
                <link.icon className="w-5 h-5" /> {link.text}
            </NavLink>
        ))}
    </nav>);
}

export default NavItem;