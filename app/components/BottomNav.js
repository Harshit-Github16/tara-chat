"use client";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faBookOpen,
    faComments,
    faNewspaper,
    faChartLine,
    faBullseye,
    faUserShield
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../contexts/AuthContext";

const ADMIN_EMAILS = [
    "harshit0150@gmail.com",
    "hello.tara4u@gmail.com",
    "ruchika.dave91@gmail.com"
];

export default function BottomNav({ activePage }) {
    const { user } = useAuth();
    const isAdmin = user?.email && ADMIN_EMAILS.includes(user.email);

    return (
        <nav className="sticky bottom-0 z-10 border-t border-rose-100 bg-white/90 backdrop-blur">
            <div className={`mx-auto grid max-w-7xl ${isAdmin ? 'grid-cols-6' : 'grid-cols-5'} px-2 py-2 text-xs text-gray-600 sm:text-sm`}>
                <NavLink href="/journal" icon={faBookOpen} label="Journal" active={activePage === "journal"} />
                <NavLink href="/chatlist" icon={faComments} label="Chats" active={activePage === "chatlist"} />
                <NavLink href="/blogs" icon={faNewspaper} label="Blogs" active={activePage === "blogs"} />
                <NavLink href="/insights" icon={faChartLine} label="Insights" active={activePage === "insights"} />
                <NavLink href="/goals" icon={faBullseye} label="Goals" active={activePage === "goals"} />
                {isAdmin && (
                    <NavLink href="/admin" icon={faUserShield} label="Admin" active={activePage === "admin"} />
                )}
            </div>
        </nav>
    );
}

function NavLink({ href, icon, label, active }) {
    return (
        <Link
            href={href}
            className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 transition-colors ${active ? "text-rose-600 font-semibold" : "text-gray-600 hover:text-rose-500"
                }`}
        >
            <FontAwesomeIcon icon={icon} className="h-5 w-5" />
            <span className="text-[10px] sm:text-xs">{label}</span>
        </Link>
    );
}
