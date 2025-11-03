"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faChartLine,
  faBookOpen,
  faComments,
  faUser,
  faPlus,
  faPaperPlane,
} from "@fortawesome/free-solid-svg-icons";

const INITIAL_CHATS = [
  { id: "c1", name: "Calm Coach", last: "How was your day?", unread: 2 },
  { id: "c2", name: "Gratitude Guru", last: "One win today?", unread: 0 },
  { id: "c3", name: "Motivation Buddy", last: "Small step next?", unread: 1 },
  { id: "c4", name: "Compassionate Listener", last: "I’m here.", unread: 0 },
];

export default function ChatListPage() {
  const [chats, setChats] = useState(INITIAL_CHATS);
  const [activeId, setActiveId] = useState(INITIAL_CHATS[0].id);
  const [message, setMessage] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const activeChat = useMemo(() => chats.find((c) => c.id === activeId), [chats, activeId]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-rose-50 via-white to-rose-100">
      {/* Optional minimal header (no nav, since nav is at bottom) */}
      <header className="sticky top-0 z-10 border-b border-rose-100 bg-white/60 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="text-lg font-semibold text-rose-600">Tara</div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-4 px-4 py-4 sm:grid-cols-12">
        {/* Sidebar */}
        <aside className="sm:col-span-4 lg:col-span-3">
          <div className="rounded-2xl border border-rose-100 bg-white p-3 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-semibold text-gray-700">Chats</div>
              <button
                onClick={() => setShowAdd(true)}
                className="inline-flex items-center gap-2 rounded-full bg-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-300"
              >
                <FontAwesomeIcon icon={faPlus} /> Add User
              </button>
            </div>
            <div className="space-y-1">
              {chats.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`w-full rounded-xl border px-3 py-3 text-left text-sm transition ${c.id === activeId
                    ? "border-rose-300 bg-rose-200 text-rose-700"
                    : "border-rose-100 bg-white text-gray-700 hover:bg-rose-200"
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{c.name}</span>
                    {c.unread > 0 && (
                      <span className="ml-2 inline-flex items-center rounded-full bg-rose-200 px-2 py-0.5 text-[10px] font-bold text-rose-700">
                        {c.unread}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 truncate text-xs text-gray-500">{c.last}</div>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Chat view */}
        <section className="sm:col-span-8 lg:col-span-9">
          <div className="flex h-[calc(100vh-180px)] flex-col rounded-2xl border border-rose-100 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-rose-100 px-4 py-3">
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  {activeChat?.name}
                </div>
                <div className="text-xs text-gray-500">Today</div>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
              <ChatBubble who="them" text="Hey! How are you feeling after your check-in?" />
              <ChatBubble who="me" text="Better. I chose 'Inspired'." />
              <ChatBubble who="them" text="Great! What’s one small step you can take today?" />
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!message.trim()) return;
                setMessage("");
              }}
              className="flex items-center gap-2 border-t border-rose-100 p-3"
            >
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 rounded-full border border-rose-200 px-4 py-3 text-sm outline-none ring-rose-100 focus:ring"
                placeholder="Write a message..."
              />
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-full bg-rose-200 px-4 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-300"
              >
                <FontAwesomeIcon icon={faPaperPlane} />
                Send
              </button>
            </form>
          </div>
        </section>
      </div>

      {/* Bottom Navbar (all sizes) */}
      <nav className="sticky bottom-0 z-10 border-t border-rose-100 bg-white/90 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-5 px-2 py-2 text-xs text-gray-600 sm:text-sm">
          <MobileNavLink href="/" icon={faHouse} label="Home" />
          <MobileNavLink href="/insights" icon={faChartLine} label="Insights" />
          <MobileNavLink href="/journal" icon={faBookOpen} label="Journal" />
          <MobileNavLink href="/chatlist" icon={faComments} label="Chats" active />
          <MobileNavLink href="/profile" icon={faUser} label="Profile" />
        </div>
      </nav>

      {showAdd && (
        <AddUserModal
          onClose={() => setShowAdd(false)}
          onCreate={(payload) => {
            const id = `c${Date.now()}`;
            const newChat = {
              id,
              name: payload.name,
              last: `${payload.role} • Ready to chat`,
              unread: 0,
              avatar: payload.avatar,
              gender: payload.gender,
              role: payload.role,
            };
            setChats((prev) => [newChat, ...prev]);
            setActiveId(id);
            setShowAdd(false);
          }}
        />
      )}
    </div>
  );
}

function NavLink({ href, icon, label, active }) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-2 ${active ? "bg-rose-200 text-rose-600" : "hover:bg-rose-200"
        }`}
    >
      <FontAwesomeIcon icon={icon} className="h-4 w-4" />
      {label}
    </Link>
  );
}

function MobileNavLink({ href, icon, label, active }) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 ${active ? "text-rose-600" : "text-gray-600"
        }`}
    >
      <FontAwesomeIcon icon={icon} className="h-5 w-5" />
      {label}
    </Link>
  );
}

function ChatBubble({ who, text }) {
  const isMe = who === "me";
  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm shadow ${isMe
          ? "rounded-br-sm bg-rose-200 text-rose-700"
          : "rounded-bl-sm bg-rose-200 text-gray-800"
          }`}
      >
        {text}
      </div>
    </div>
  );
}

function AddUserModal({ onClose, onCreate }) {
  const [tab, setTab] = useState("user"); // 'user' | 'celebs'
  const [name, setName] = useState("");
  const [gender, setGender] = useState("male");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [role, setRole] = useState(ROLES[0]);

  function submit(e) {
    e.preventDefault();
    if (!name.trim()) return;
    onCreate({ name, gender, avatar, role });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-rose-100 bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-lg font-bold text-gray-900">{tab === "user" ? "Add New User" : "Talk with Celebrities"}</div>
          <div className="flex gap-2 rounded-full bg-rose-200 p-1 text-xs font-semibold text-rose-600">
            <button
              className={`rounded-full px-3 py-1 ${tab === "user" ? "bg-white shadow" : ""}`}
              onClick={() => setTab("user")}
              type="button"
            >
              Create User
            </button>
            <button
              className={`rounded-full px-3 py-1 ${tab === "celebs" ? "bg-white shadow" : ""}`}
              onClick={() => setTab("celebs")}
              type="button"
            >
              Celebrities
            </button>
          </div>
        </div>

        {tab === "user" ? (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded-xl border border-rose-200 px-4 py-2 text-sm outline-none ring-rose-100 focus:ring"
                placeholder="Enter name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Gender</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="mt-1 w-full rounded-xl border border-rose-200 px-4 py-2 text-sm outline-none ring-rose-100 focus:ring"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Choose Avatar</label>
              <div className="mt-2 grid grid-cols-5 gap-2">
                {AVATARS.map((a) => (
                  <button
                    type="button"
                    key={a}
                    onClick={() => setAvatar(a)}
                    className={`aspect-square w-full overflow-hidden rounded-xl border ${avatar === a ? "border-rose-500 ring-2 ring-rose-200" : "border-rose-100"
                      }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={a} alt="avatar" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 w-full rounded-xl border border-rose-200 px-4 py-2 text-sm outline-none ring-rose-100 focus:ring"
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-full bg-rose-200 px-4 py-2 text-sm foink-500bold text-rose-700 hover:bg-rose-300 shadow-sm"
              >
                Create
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Pick a celebrity character to start chatting instantly.</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {CELEBRITIES.map((person) => (
                <button
                  key={person}
                  type="button"
                  onClick={() =>
                    onCreate({
                      name: person,
                      gender: "other",
                      avatar: `https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(person)}`,
                      role: "Celebrity",
                    })
                  }
                  className="flex flex-col items-center gap-2 rounded-2xl border border-rose-100 bg-white p-3 text-sm hover:bg-rose-200"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(person)}`}
                    alt={person}
                    className="h-16 w-16 rounded-xl"
                  />
                  <span className="font-semibold text-gray-800 text-center leading-tight">{person}</span>
                  <span className="text-[10px] text-rose-600">Start chat</span>
                </button>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-200"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const AVATARS = [
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Alex",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Nova",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Kai",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Rin",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Zara",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Yuki",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Aria",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Kenji",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Hikari",
  "https://api.dicebear.com/9.x/adventurer/svg?seed=Sora",
];

const ROLES = [
  "Chill Friend",
  "Supportive Teacher",
  "Mindful Coach",
  "Career Mentor",
  "Fitness Buddy",
  "Creative Muse",
  "Compassionate Listener",
  "Tough-Love Trainer",
  "Study Partner",
  "Wisdom Sage",
  "Motivational Speaker",
  "Therapist-like Guide",
];

const CELEBRITIES = [
  "Sachin Tendulkar",
  "Amitabh Bachchan",
  "Cristiano Ronaldo",
  "Lionel Messi",
  "Katrina Kaif",
  "Elon Musk",
  "Donald Trump",
  "Narendra Modi",
  "Dwene Johnson",
  "Sunidhi chouhan",
  "Rahul gandhi",
  "Virat kohli",
];


