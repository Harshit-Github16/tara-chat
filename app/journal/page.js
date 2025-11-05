"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faPen, faChartLine, faBookOpen, faComments, faUser, faNewspaper } from "@fortawesome/free-solid-svg-icons";

export default function JournalPage() {
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null); // entry or null

  // Load/save from localStorage (demo persistence)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("journals");
      if (raw) setEntries(JSON.parse(raw));
    } catch { }
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("journals", JSON.stringify(entries));
    } catch { }
  }, [entries]);

  const groups = useMemo(() => groupByDate(entries), [entries]);

  function autoGenerateToday() {
    const key = dateKey(new Date());
    const already = entries.some((e) => dateKey(new Date(e.createdAt || Date.now())) === key);
    if (already) return; // Don't duplicate for today
    const generated = {
      id: `j${Date.now()}`,
      createdAt: new Date().toISOString(),
      title: "Daily Reflection",
      content:
        "Today I took a moment to breathe and check in with myself. I noticed a few emotions come and go, and chose one small step to move forward. Grateful for progress, however small.",
      tags: ["daily", "reflection"],
    };
    setEntries((prev) => [generated, ...prev]);
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-pink-50 via-white to-pink-100">
      <header className="sticky top-0 z-10 border-b border-pink-100 bg-white/60 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <img
              src="/taralogo.jpg"
              alt="Tara Logo"
              className="h-8 w-8 rounded-full object-cover"
            />
            <span className="text-lg font-semibold text-pink-600">Tara</span>
          </div>

        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div className="text-base font-semibold text-gray-800">Your Journal</div>
          <div className="flex items-center gap-2">
            <button
              onClick={autoGenerateToday}
              className="inline-flex items-center gap-2 rounded-full border border-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-200"
            >
              Auto Generate Today
            </button>
            <button
              onClick={() => { setEditing(null); setShowModal(true); }}
              className="inline-flex items-center gap-2 rounded-full bg-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-300 shadow-sm"
            >
              <FontAwesomeIcon icon={faPlus} /> Create Journal
            </button>
          </div>
        </div>
        {groups.length === 0 ? (
          <EmptyState onNew={() => { setEditing(null); setShowModal(true); }} />
        ) : (
          <div className="space-y-8">
            {groups.map(([date, items]) => (
              <section key={date}>
                <h2 className="mb-3 text-xs font-bold uppercase tracking-wide text-pink-600">{date}</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {items.map((e) => (
                    <article key={e.id} className="rounded-2xl border border-pink-100 bg-white p-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold text-gray-900">{e.title || "Untitled"}</div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => { setEditing(e); setShowModal(true); }}
                            className="inline-flex items-center gap-1 rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-200"
                          >
                            <FontAwesomeIcon icon={faPen} /> Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("Delete this journal?")) {
                                setEntries((prev) => prev.filter((x) => x.id !== e.id));
                              }
                            }}
                            className="inline-flex items-center gap-1 rounded-full border border-rose-200 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-50"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">{e.content}</p>
                      {e.tags?.length ? (
                        <div className="mt-3 flex flex-wrap gap-2">
                          {e.tags.map((t) => (
                            <span key={t} className="rounded-full bg-rose-200 px-2 py-1 text-[10px] font-bold text-rose-600">#{t}</span>
                          ))}
                        </div>
                      ) : null}
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      {/* Bottom Navbar (links) */}
      <nav className="sticky bottom-0 z-10 border-t border-pink-100 bg-white/90 backdrop-blur">
        <div className="mx-auto grid max-w-7xl grid-cols-5 px-2 py-2 text-xs text-gray-600 sm:text-sm">
          <BottomNavLink href="/insights" icon={faChartLine} label="Insights" />
          <BottomNavLink href="/journal" icon={faBookOpen} label="Journal" active />
          <BottomNavLink href="/chatlist" icon={faComments} label="Chats" />
          <BottomNavLink href="/blogs" icon={faNewspaper} label="Blogs" />
          <BottomNavLink href="/profile" icon={faUser} label="Profile" />
        </div>
      </nav>

      {showModal && (
        <JournalModal
          initial={editing}
          onClose={() => setShowModal(false)}
          onSave={(payload) => {
            if (editing) {
              setEntries((prev) => prev.map((e) => (e.id === editing.id ? { ...e, ...payload } : e)));
            } else {
              setEntries((prev) => [
                {
                  id: `j${Date.now()}`,
                  createdAt: new Date().toISOString(),
                  ...payload,
                },
                ...prev,
              ]);
            }
            setShowModal(false);
          }}
        />
      )}
    </div>
  );
}

function EmptyState({ onNew }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 text-center">
      <div className="text-xl font-semibold text-gray-800">Start your first journal</div>
      <p className="max-w-md text-sm text-gray-600">Capture thoughts and moments. Entries are grouped by date like a feed.</p>
      <button onClick={onNew} className="rounded-full bg-rose-200 px-5 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-300 shadow-sm">
        <FontAwesomeIcon icon={faPlus} /> New Journal
      </button>
    </div>
  );
}

function BottomNavLink({ href, icon, label, active }) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center gap-1 rounded-xl px-2 py-2 ${active ? "text-pink-600" : "text-gray-600"}`}
    >
      <FontAwesomeIcon icon={icon} className="h-5 w-5" />
      {label}
    </Link>
  );
}

function JournalModal({ initial, onClose, onSave }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [content, setContent] = useState(initial?.content || "");
  const [tags, setTags] = useState(initial?.tags?.join(", ") || "");

  function submit(e) {
    e.preventDefault();
    const payload = {
      title: title.trim(),
      content: content.trim(),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    onSave(payload);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-3xl border border-pink-100 bg-white p-6 shadow-xl">
        <div className="mb-4 text-lg font-bold text-gray-900">{initial ? "Edit Journal" : "New Journal"}</div>
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 w-full rounded-xl border border-pink-200 px-4 py-2 text-sm outline-none ring-pink-100 focus:ring"
              placeholder="Optional title"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Content</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
              className="mt-1 w-full rounded-xl border border-pink-200 px-4 py-2 text-sm outline-none ring-pink-100 focus:ring"
              placeholder="Write your thoughts..."
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
            <input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="mt-1 w-full rounded-xl border border-pink-200 px-4 py-2 text-sm outline-none ring-pink-100 focus:ring"
              placeholder="growth, gratitude, reflection"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-200">
              Cancel
            </button>
            <button type="submit" className="rounded-full bg-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-300 shadow-sm">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function groupByDate(entries) {
  const fmt = (d) => new Date(d).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });
  const map = new Map();
  for (const e of entries) {
    const key = fmt(e.createdAt || Date.now());
    if (!map.has(key)) map.set(key, []);
    map.get(key).push(e);
  }
  return Array.from(map.entries());
}

function dateKey(date) {
  return new Date(date).toISOString().slice(0, 10);
}


