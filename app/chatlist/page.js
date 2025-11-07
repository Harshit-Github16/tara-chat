"use client";
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "../contexts/AuthContext";
import TaraChat from "../components/TaraChat";
import ProtectedRoute from "../components/ProtectedRoute";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChartLine,
  faBookOpen,
  faComments,
  faUser,
  faPlus,
  faPaperPlane,
  faSmile,
  faMicrophone,
  faStop,
  faPlay,
  faPause,
  faTimes,
  faBars,
  faNewspaper,
  faBullseye,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";





const POPULAR_EMOJIS = ["😀", "😂", "😍", "😊", "😎", "🤔", "👍", "❤️", "🔥", "💯"]

const SUGGESTED_MESSAGES = [
  "How are you feeling today?",
  "What's on your mind?",
  "Tell me something good that happened today",
  "I need some motivation",
  "Can you help me with something?",
  "What should I do next?"
]

const EMOJIS = [
  "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "😘",
  "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🤓", "😎", "🤩", "😏", "😒", "😞", "😔",
  "😟", "😕", "🙁", "😣", "😖", "😫", "😩", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "😱",
  "😨", "😰", "😥", "😓", "🤗", "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄", "😯", "😦",
  "😧", "😮", "😲", "😴", "🤤", "😪", "😵", "🤐", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠",
  "😈", "👿", "👹", "👺", "🤡", "💩", "👻", "💀", "👽", "👾", "🤖", "🎃", "😺", "😸", "😹", "😻",
  "😼", "😽", "🙀", "😿", "😾", "❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "💕",
  "💞", "💓", "💗", "💖", "💘", "💝", "💟", "👋", "🤚", "✋", "🖖", "👌", "🤏", "✌️", "🤞", "🤟",
  "🤘", "🤙", "👈", "👉", "👆", "👇", "☝️", "👍", "👎", "👊", "✊", "🤛", "🤜", "👏", "🙌", "👐",
  "🤲", "🤝", "🙏", "✍️", "💅", "🤳", "💪", "👂", "👃", "👀", "👅", "👄", "💋", "👶", "🧒", "👦",
  "👧", "👨", "👩", "👴", "👵", "🙍", "🙎", "🙅", "🙆", "💁", "🙋", "🙇", "🤦", "🤷", "👮", "👷",
  "🤴", "👸", "👳", "👲", "🤵", "👰", "🤰", "🤱", "👼", "🎅", "🤶", "💆", "💇", "🚶", "🏃", "💃",
  "🕺", "👯", "🧘", "🛀", "🛌", "👭", "👫", "👬", "💏", "💑", "👪", "👤", "👥", "👣", "🐵", "🐒",
  "🐶", "🐕", "🐩", "🐺", "🦊", "🐱", "🐈", "🦁", "🐯", "🐅", "🐆", "🐴", "🐎", "🦄", "🦓", "🦌",
  "🐮", "🐂", "🐃", "🐄", "🐷", "🐖", "🐗", "🐽", "🐏", "🐑", "🐐", "🐪", "🐫", "🐘", "🐭", "🐁",
  "🐀", "🐹", "🐰", "🐇", "🐻", "🐨", "🐼", "🐾", "🦃", "🐔", "🐓", "🐣", "🐤", "🐥", "🐦", "🐧",
  "🦅", "🦆", "🦢", "🦉", "🐸", "🐊", "🐢", "🦎", "🐍", "🐲", "🐉", "🐳", "🐋", "🐬", "🐟", "🐠",
  "🐡", "🦈", "🐙", "🐚", "🐌", "🦋", "🐛", "🐜", "🐝", "🐞", "💐", "🌸", "🌹", "🌺", "🌻", "🌼",
  "🌷", "🌱", "🌲", "🌳", "🌴", "🌵", "🍄", "🌰", "🍞", "🥐", "🥖", "🥨", "🥯", "🥞", "🧇", "🧀",
  "🍖", "🍗", "🥩", "🥓", "🍔", "🍟", "🍕", "🌭", "🥪", "🌮", "🌯", "🥙", "🧆", "🥚", "🍳", "🥘",
  "🍲", "🥣", "🥗", "🍿", "🧈", "🧂", "🥫", "🍱", "🍘", "🍙", "🍚", "🍛", "🍜", "🍝", "🍠", "🍢",
  "🍣", "🍤", "🍥", "🥮", "🍡", "🥟", "🥠", "🥡", "🦀", "🦞", "🦐", "🦑", "🦪", "🍦", "🍧", "🍨",
  "🍩", "🍪", "🎂", "🍰", "🧁", "🥧", "🍫", "🍬", "🍭", "🍮", "🍯", "🍼", "🥛", "☕", "🍵", "🧃",
  "🥤", "🍶", "🍾", "🍷", "🍸", "🍹", "🍺", "🍻", "🥂", "🥃", "🧋", "🧉", "🧊", "⚽", "🏀", "🏈",
  "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🪃", "🥅",
  "⛳", "🪁", "🏹", "🎣", "🤿", "🥊", "🥋", "🎽", "🛹", "🛷", "⛸️", "🥌", "🎿", "⛷️", "🏂", "🪂",
  "🏋️", "🤼", "🤸", "⛹️", "🤺", "🤾", "🏌️", "🏇", "🧘", "🏄", "🏊", "🤽", "🚣", "🧗", "🚵", "🚴",
  "🏆", "🥇", "🥈", "🥉", "🏅", "🎖️", "🏵️", "🎗️", "🎫", "🎟️", "🎪", "🤹", "🎭", "🩰", "🎨", "🎬",
  "🎤", "🎧", "🎼", "🎵", "🎶", "🥇", "🥈", "🥉", "🏆", "🏅", "🎖️", "🏵️", "🎗️", "🎫", "🎟️", "🎪"
];

export default function ChatListPage() {
  const { user, loading } = useAuth();
  const defaultTaraChat = { id: "tara-ai", name: "TARA AI", last: "", unread: 0, avatar: "/taralogo.jpg" };
  const [chats, setChats] = useState([defaultTaraChat]);

  // Debug: Log user state
  useEffect(() => {
    console.log('ChatList - User:', user);
    console.log('ChatList - Loading:', loading);
    console.log('ChatList - User UID:', user?.uid);
  }, [user, loading]);
  const [activeId, setActiveId] = useState("tara-ai");
  const [message, setMessage] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAllCelebrities, setShowAllCelebrities] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  // Store messages per chat ID
  const [chatMessages, setChatMessages] = useState({});

  // Initialize TaraChat component
  const taraChat = TaraChat({
    userId: user?.uid,
    onMessagesUpdate: (messages) => {
      setChatMessages(prev => ({
        ...prev,
        "tara-ai": messages
      }));
      // Update last message in chat list
      if (messages.length > 0) {
        const lastMessage = messages[messages.length - 1];
        setChats(prev => prev.map(chat =>
          chat.id === "tara-ai"
            ? { ...chat, last: lastMessage.content.substring(0, 50) + "..." }
            : chat
        ));
      }
    }
  });

  // Load custom users from DB when user is available
  useEffect(() => {
    if (user?.uid) {
      loadCustomUsers();
    }
  }, [user?.uid]);

  // Load chat history when user is available
  useEffect(() => {
    if (user?.uid && activeId === "tara-ai") {
      taraChat.loadChatHistory();
    }
  }, [user?.uid]);

  // Load conversations when switching to any chat user (except TARA which uses its own system)
  useEffect(() => {
    if (user?.uid && activeId && activeId !== "tara-ai") {
      // Only load if not already loaded
      if (!chatMessages[activeId] || chatMessages[activeId].length === 0) {
        loadConversations(activeId);
      }
    }
  }, [user?.uid, activeId]);

  // Load all chat users from database (includes TARA by default)
  const loadCustomUsers = async () => {
    if (!user?.uid) return;

    try {
      const response = await fetch(`/api/users?userId=${user.uid}`);
      const data = await response.json();

      if (data.success && data.chatUsers) {
        const allChats = data.chatUsers.map(u => ({
          id: u.id,
          name: u.name,
          last: u.conversations?.length > 0
            ? u.conversations[u.conversations.length - 1].content.substring(0, 50) + "..."
            : u.type === 'ai' ? 'Your AI companion' : `${u.role || 'Ready to chat'}`,
          unread: 0,
          avatar: u.avatar,
          gender: u.gender,
          role: u.role,
          type: u.type
        }));

        setChats(allChats);

        // Load conversations for all chat users
        data.chatUsers.forEach(u => {
          if (u.conversations && u.conversations.length > 0) {
            setChatMessages(prev => ({
              ...prev,
              [u.id]: u.conversations
            }));
          }
        });
      }
    } catch (error) {
      console.error('Failed to load chat users:', error);
    }
  };

  // Load conversations for a specific chat user
  const loadConversations = async (chatUserId) => {
    if (!user?.uid) return;

    try {
      const response = await fetch(`/api/users/conversations?userId=${user.uid}&chatUserId=${chatUserId}`);
      const data = await response.json();

      if (data.success) {
        setChatMessages(prev => ({
          ...prev,
          [chatUserId]: data.conversations
        }));
      }
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  // Save message to database for chat users
  const saveMessageToDB = async (chatUserId, messageContent, sender, type = 'text') => {
    if (!user?.uid) return false;

    try {
      const response = await fetch('/api/users/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          chatUserId,
          message: messageContent,
          sender,
          type
        })
      });

      const data = await response.json();
      return data.success;
    } catch (error) {
      console.error('Failed to save message:', error);
      return false;
    }
  };

  // Get messages for current active chat
  const messages = chatMessages[activeId] || [];
  const activeChat = useMemo(() => chats.find((c) => c.id === activeId), [chats, activeId]);

  // Audio recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  const sendAudioMessage = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob);
      const newMessage = {
        id: Date.now(),
        type: 'audio',
        content: audioUrl,
        sender: 'me',
        timestamp: new Date(),
        duration: '0:05'
      };

      // Add audio message to the specific chat
      setChatMessages(prev => ({
        ...prev,
        [activeId]: [...(prev[activeId] || []), newMessage]
      }));
      setAudioBlob(null);
    }
  };

  const cancelAudio = () => {
    if (audioBlob) {
      URL.revokeObjectURL(URL.createObjectURL(audioBlob));
    }
    setAudioBlob(null);
    if (isRecording) {
      stopRecording();
    }
  };

  // Emoji handling
  const addEmoji = (emoji) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || isSendingMessage) return;

    const messageText = message.trim();
    setMessage("");

    // If chatting with TARA AI, use the TARA chat component
    if (activeId === "tara-ai" && user?.uid) {
      setIsSendingMessage(true);
      try {
        await taraChat.sendMessage(messageText);
      } catch (error) {
        console.error('Failed to send message to TARA:', error);
        // Fallback: add message locally if API fails
        const newMessage = {
          id: Date.now(),
          type: 'text',
          content: messageText,
          sender: 'user',
          timestamp: new Date()
        };
        setChatMessages(prev => ({
          ...prev,
          [activeId]: [...(prev[activeId] || []), newMessage]
        }));
      } finally {
        setIsSendingMessage(false);
      }
    } else {
      // For all other chat users (custom + celebrities), save to database
      const newMessage = {
        id: Date.now(),
        type: 'text',
        content: messageText,
        sender: 'user',
        timestamp: new Date()
      };

      // Add to local state immediately
      setChatMessages(prev => ({
        ...prev,
        [activeId]: [...(prev[activeId] || []), newMessage]
      }));

      // Save to database
      await saveMessageToDB(activeId, messageText, 'user', 'text');

      // Update last message in chat list
      setChats(prev => prev.map(chat =>
        chat.id === activeId
          ? { ...chat, last: messageText.substring(0, 50) + "..." }
          : chat
      ));
    }
  };

  const sendSuggestedMessage = async (suggestedText) => {
    if (isSendingMessage) return;

    // If chatting with TARA AI, use the TARA chat component
    if (activeId === "tara-ai" && user?.uid) {
      setIsSendingMessage(true);
      try {
        await taraChat.sendMessage(suggestedText);
      } catch (error) {
        console.error('Failed to send suggested message to TARA:', error);
      } finally {
        setIsSendingMessage(false);
      }
    } else {
      // For all other chat users, save to database
      const newMessage = {
        id: Date.now(),
        type: 'text',
        content: suggestedText,
        sender: 'user',
        timestamp: new Date()
      };

      setChatMessages(prev => ({
        ...prev,
        [activeId]: [...(prev[activeId] || []), newMessage]
      }));

      await saveMessageToDB(activeId, suggestedText, 'user', 'text');

      setChats(prev => prev.map(chat =>
        chat.id === activeId
          ? { ...chat, last: suggestedText.substring(0, 50) + "..." }
          : chat
      ));
    }
  };

  const addCelebrityToChat = async (celebrity) => {
    if (!user?.uid) {
      alert('Please log in to chat with celebrities.');
      return;
    }

    const newChatId = `celebrity-${celebrity.id}`;

    // Check if celebrity is already in chat list
    const existingChat = chats.find(chat => chat.id === newChatId);
    if (existingChat) {
      setActiveId(existingChat.id);
      setShowAllCelebrities(false);
      return;
    }

    try {
      // Add celebrity to database
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.uid,
          name: celebrity.name,
          avatar: `/celebrities/${celebrity.image_url}`,
          type: 'celebrity',
          role: 'Celebrity',
          celebrityId: newChatId
        })
      });

      const data = await response.json();

      if (data.success || data.alreadyExists) {
        const chatUser = data.chatUser || data.chatUser;

        const newChat = {
          id: chatUser.id,
          name: chatUser.name,
          last: "Ready to chat with you!",
          unread: 0,
          avatar: chatUser.avatar,
          role: chatUser.role,
          type: chatUser.type
        };

        // Initialize welcome message
        const welcomeMessage = {
          id: Date.now(),
          type: 'text',
          content: `Hello! I'm ${celebrity.name}. How can I help you today?`,
          sender: 'them',
          timestamp: new Date()
        };

        setChatMessages(prev => ({
          ...prev,
          [chatUser.id]: [welcomeMessage]
        }));

        // Save welcome message to DB
        await saveMessageToDB(chatUser.id, welcomeMessage.content, 'them', 'text');

        setChats(prev => [...prev, newChat]);
        setActiveId(chatUser.id);
        setShowAllCelebrities(false);
      }
    } catch (error) {
      console.error('Failed to add celebrity:', error);
      alert('Failed to add celebrity. Please try again.');
    }
  };

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-rose-50 via-white to-rose-100 pb-20">
        {/* Header */}
        <header className="sticky top-0 z-10 border-b border-rose-100 bg-white/60 backdrop-blur">
          <div className="mx-auto flex max-w-9xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setShowMobileSidebar(true)}
                className="sm:hidden rounded-lg p-2 text-rose-600 hover:bg-rose-100 transition-colors"
              >
                <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
              </button>

              <img
                src="/taralogo.jpg"
                alt="Tara Logo"
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="text-lg font-semibold text-rose-600">Tara</span>
            </div>

            {/* Profile Icon */}
            <Link href="/profile" className="rounded-full p-2 text-rose-600 hover:bg-rose-100 transition-colors">
              <FontAwesomeIcon icon={faUser} className="h-5 w-5" />
            </Link>

          </div>
        </header>

        <div className="mx-auto flex w-full max-w-9xl flex-1 relative px-1 sm:px-3 gap-0 sm:gap-2">
          {/* Mobile Sidebar Overlay */}
          {showMobileSidebar && (
            <div
              className="fixed inset-0 bg-black/50 z-40 sm:hidden"
              onClick={() => setShowMobileSidebar(false)}
            />
          )}


          <aside className={`
          fixed sm:relative top-0 left-0 h-[calc(100vh-4rem)] sm:h-auto w-80 sm:w-auto
          transform transition-transform duration-300 ease-in-out z-50
          sm:transform-none sm:flex-none sm:w-80 lg:w-96
          ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full sm:translate-x-0'}
        `}>
            <div className="h-full border-r border-rose-100 bg-white/95 backdrop-blur-sm p-2 sm:p-3 shadow-lg overflow-y-auto sm:border sm:bg-white sm:backdrop-blur-none sm:shadow-sm">
              {/* Mobile Close Button */}
              <div className="sm:hidden flex justify-end mb-3">
                <button
                  onClick={() => setShowMobileSidebar(false)}
                  className="rounded-full p-2 text-gray-500 hover:bg-rose-100 hover:text-rose-600 transition-colors"
                >
                  <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                </button>
              </div>

              <div className="mb-3 flex items-center justify-between">
                <div className="text-sm font-semibold text-gray-700">Chats</div>
                <button
                  onClick={() => setShowAdd(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-300 transition-colors"
                >
                  <FontAwesomeIcon icon={faPlus} /> Add User
                </button>
              </div>
              <div className="space-y-1">
                {chats.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveId(c.id);
                      setShowMobileSidebar(false); // Close mobile sidebar when chat is selected
                    }}
                    className={`w-full rounded-xl border px-3 py-3 text-left text-sm transition ${c.id === activeId
                      ? "border-rose-200 bg-rose-100 text-rose-700"
                      : "border-rose-100 bg-white text-gray-700 hover:bg-rose-100"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center flex-shrink-0">
                        {c.avatar ? (
                          <img
                            src={c.avatar}
                            alt={c.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <FontAwesomeIcon icon={faUser} className="h-4 w-4 text-rose-600" />
                        )}
                      </div>

                      {/* Chat Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-medium truncate">{c.name}</span>
                          {c.unread > 0 && (
                            <span className="ml-2 inline-flex items-center rounded-full bg-rose-200 px-2 py-0.5 text-[10px] font-bold text-rose-700 flex-shrink-0">
                              {c.unread}
                            </span>
                          )}
                        </div>
                        <div className="mt-1 truncate text-xs text-gray-500">{c.last}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Celebrities Section at Bottom */}
              <div className="mt-4 pt-3 border-t border-rose-100">
                <div className="mb-3 flex items-center justify-between">
                  <div className="text-xs font-semibold text-gray-600">Celebrities</div>
                </div>

                {/* Horizontal Celebrities List */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1">
                  {CELEBRITIES.slice(0, 3).map((celebrity) => (
                    <button
                      key={celebrity.id}
                      onClick={() => addCelebrityToChat(celebrity)}
                      className="shrink-0 group cursor-pointer"
                    >
                      <div className="flex flex-col items-center gap-1">
                        {/* Rounded Avatar */}
                        <div className="w-12 h-12 bg-linear-to-br from-rose-100 to-rose-200 rounded-full flex items-center justify-center text-xl group-hover:scale-105 transition-transform border border-rose-200 overflow-hidden">
                          <Image
                            src={`/celebrities/${celebrity.image_url}`}
                            alt={celebrity.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        {/* Name */}
                        <div className="text-xs font-medium text-gray-700 text-center leading-tight max-w-[48px] truncate">
                          {celebrity.name}
                        </div>
                      </div>
                    </button>
                  ))}

                  {/* View More Button */}
                  <button
                    onClick={() => setShowAllCelebrities(true)}
                    className="shrink-0 group cursor-pointer ml-1"
                  >
                    <div className="flex flex-col items-center gap-1">
                      {/* Plus Button */}
                      <div className="w-12 h-12 bg-linear-to-br from-rose-200 to-rose-300 rounded-full flex items-center justify-center group-hover:scale-105 transition-transform border border-rose-300">
                        <FontAwesomeIcon icon={faPlus} className="h-4 w-4 text-rose-700" />
                      </div>
                      {/* View More Text */}
                      <div className="text-xs font-medium text-rose-600 text-center leading-tight">
                        More
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Chat view */}
          <section className="flex-1">
            {chats.length === 0 ? (
              <div className="flex h-[calc(100vh-140px)] flex-col items-center justify-center border border-rose-100 bg-white shadow-sm">
                <div className="text-center">
                  <FontAwesomeIcon icon={faComments} className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No chats yet</h3>
                  <p className="text-gray-500 mb-4">Start a conversation with one of our AI coaches</p>
                  <button
                    onClick={() => setShowAdd(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-300"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    Start Chat
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex h-[calc(100vh-140px)] flex-col border border-rose-100 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-rose-100 px-4 py-3">
                  <div className="flex items-center gap-3">
                    {/* Active Chat Avatar */}
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center">
                      {activeChat?.avatar ? (
                        <img
                          src={activeChat.avatar}
                          alt={activeChat.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FontAwesomeIcon icon={faUser} className="h-4 w-4 text-rose-600" />
                      )}
                    </div>

                    {/* Chat Info */}
                    <div>
                      <div className="text-sm font-semibold text-gray-900">
                        {activeChat?.name}
                      </div>
                      <div className="text-xs text-gray-500">Today</div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
                  {messages.length === 0 && activeChat?.id === "tara-ai" ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-8">
                      <img
                        src="/taralogo.jpg"
                        alt="TARA AI"
                        className="w-16 h-16 rounded-full object-cover mb-4"
                      />
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Welcome to TARA AI</h3>
                      <p className="text-gray-600 text-sm max-w-sm">
                        Hi! I'm TARA, your AI companion. I'm here to support your mental wellness journey.
                        Start a conversation by typing a message below.
                      </p>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <ChatBubble
                        key={msg.id}
                        who={msg.sender}
                        type={msg.type}
                        content={msg.content}
                        duration={msg.duration}
                      />
                    ))
                  )}

                  {/* TARA Typing Indicator */}
                  {isSendingMessage && activeChat?.id === "tara-ai" && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-2xl px-4 py-3 max-w-xs shadow-sm">
                        <div className="flex items-center gap-2">
                          <img
                            src="/taralogo.jpg"
                            alt="TARA"
                            className="w-6 h-6 rounded-full object-cover"
                          />
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Recording Indicator in Chat - WhatsApp Style */}
                  {isRecording && (
                    <div className="flex justify-end">
                      <div className="bg-red-500 text-white rounded-2xl px-4 py-3 max-w-xs shadow-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                          <FontAwesomeIcon icon={faMicrophone} className="h-4 w-4" />
                          <span className="text-sm">Recording...</span>
                          <button
                            onClick={stopRecording}
                            className="ml-2 bg-white/20 hover:bg-white/30 rounded-full p-1 transition-colors"
                          >
                            <FontAwesomeIcon icon={faStop} className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Audio Recording Preview */}
                {audioBlob && (
                  <div className="border-t border-rose-100 p-3 bg-rose-50">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <FontAwesomeIcon icon={faMicrophone} className="text-rose-500" />
                          <span>Audio message recorded</span>
                          <audio controls className="flex-1">
                            <source src={URL.createObjectURL(audioBlob)} type="audio/wav" />
                          </audio>
                        </div>
                      </div>
                      <button
                        onClick={sendAudioMessage}
                        className="rounded-full bg-rose-200 px-4 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-300"
                      >
                        Send
                      </button>
                      <button
                        onClick={cancelAudio}
                        className="rounded-full border border-rose-200 px-3 py-2 text-rose-600 hover:bg-rose-50"
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Suggested Messages */}
                {messages.length <= 3 && (
                  <div className=" p-3 ">

                    <div className="flex flex-wrap gap-2">
                      {SUGGESTED_MESSAGES.slice(0, 3).map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => sendSuggestedMessage(suggestion)}
                          className="inline-flex items-center rounded-full border border-rose-200 bg-white px-3 py-1.5 text-xs text-gray-700 hover:bg-rose-100 hover:border-rose-300 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <form
                  onSubmit={sendMessage}
                  className="relative border-t border-rose-100 p-3"
                >
                  {/* Emoji Picker */}
                  {showEmojiPicker && (
                    <div className="absolute bottom-full left-3 right-3 mb-2 rounded-2xl border border-rose-100 bg-white shadow-xl z-50">
                      {/* Header */}
                      <div className="flex items-center justify-between p-3 border-b border-rose-100">
                        <span className="text-sm font-medium text-gray-700">Choose Emoji</span>
                        <button
                          type="button"
                          onClick={() => setShowEmojiPicker(false)}
                          className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                          <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Emoji Grid with Scroll */}
                      <div className="h-48 overflow-y-auto p-3">
                        <div className="grid grid-cols-30 max-md:grid-cols-10 gap-1">
                          {EMOJIS.map((emoji, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => addEmoji(emoji)}
                              className="aspect-square flex items-center justify-center text-lg rounded-lg hover:bg-rose-50 transition-colors"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Popular Emojis Quick Access */}
                      <div className="border-t border-rose-100 p-2">
                        <div className="flex gap-1 justify-center">
                          {POPULAR_EMOJIS.map((emoji, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => addEmoji(emoji)}
                              className="w-8 h-8 flex items-center justify-center text-lg rounded-lg hover:bg-rose-50 transition-colors"
                            >
                              {emoji}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    {/* Emoji Button */}
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="rounded-full p-2 text-rose-600 hover:bg-rose-50 transition-colors"
                    >
                      <FontAwesomeIcon icon={faSmile} className="h-5 w-5" />
                    </button>

                    {/* Message Input */}
                    <input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex-1 rounded-full border border-rose-200 px-4 py-3 text-sm outline-none ring-rose-100 focus:ring"
                      placeholder="Write a message..."
                    />

                    {/* Audio Recording Button */}
                    <button
                      type="button"
                      onClick={isRecording ? stopRecording : startRecording}
                      className={`rounded-full p-3 transition-colors ${isRecording
                        ? 'bg-red-500 text-white animate-pulse'
                        : 'text-rose-600 hover:bg-rose-50'
                        }`}
                    >
                      <FontAwesomeIcon icon={isRecording ? faStop : faMicrophone} className="h-5 w-5" />
                    </button>

                    {/* Send Button */}
                    <button
                      type="submit"
                      disabled={!message.trim() || isSendingMessage}
                      className="inline-flex items-center gap-2 rounded-full bg-rose-200 px-4 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FontAwesomeIcon icon={faPaperPlane} />
                      {isSendingMessage ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </section>
        </div>

        {/* Bottom Navbar */}
        <nav className="fixed bottom-0 left-0 right-0 z-30 border-t border-rose-100 bg-white/90 backdrop-blur">
          <div className="mx-auto grid max-w-7xl grid-cols-5 px-2 py-2 text-xs text-gray-600 sm:text-sm">
            <MobileNavLink href="/journal" icon={faBookOpen} label="Journal" />
            <MobileNavLink href="/chatlist" icon={faComments} label="Chats" active />
            <MobileNavLink href="/blogs" icon={faNewspaper} label="Blogs" />
            <MobileNavLink href="/insights" icon={faChartLine} label="Insights" />
            <MobileNavLink href="#" icon={faBullseye} label="Goals" disabled />
          </div>
        </nav>

        {
          showAdd && (
            <AddUserModal
              onClose={() => setShowAdd(false)}
              onCreate={async (payload) => {
                try {
                  // Check if user is logged in
                  if (!user || !user.id) {
                    console.error('User not logged in:', user);
                    alert('Please log in to create a user.');
                    return;
                  }

                  console.log('Creating user with firebaseUid:', user.firebaseUid);

                  // Save to database
                  const response = await fetch('/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      userId: user.firebaseUid || user.uid,
                      name: payload.name,
                      avatar: payload.avatar,
                      gender: payload.gender,
                      role: payload.role
                    })
                  });

                  console.log('API Response status:', response.status);

                  const data = await response.json();

                  if (data.success) {
                    const chatUser = data.chatUser;
                    const newChat = {
                      id: chatUser.id,
                      name: chatUser.name,
                      last: `${chatUser.role} • Ready to chat`,
                      unread: 0,
                      avatar: chatUser.avatar,
                      gender: chatUser.gender,
                      role: chatUser.role,
                      type: chatUser.type
                    };

                    // Initialize messages for this new chat
                    const welcomeMessage = {
                      id: Date.now(),
                      type: 'text',
                      content: `Hi! I'm ${chatUser.name}, your ${chatUser.role}. How can I assist you today?`,
                      sender: 'them',
                      timestamp: new Date()
                    };

                    setChatMessages(prev => ({
                      ...prev,
                      [chatUser.id]: [welcomeMessage]
                    }));

                    // Save welcome message to DB
                    await saveMessageToDB(chatUser.id, welcomeMessage.content, 'them', 'text');

                    setChats((prev) => [...prev, newChat]);
                    setActiveId(chatUser.id);
                    setShowAdd(false);
                  } else {
                    alert('Failed to create user. Please try again.');
                  }
                } catch (error) {
                  console.error('Failed to create user:', error);
                  alert('Failed to create user. Please try again.');
                }
              }}
            />
          )
        }

        {/* All Celebrities Modal */}
        {showAllCelebrities && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
            <div className="w-full max-w-2xl rounded-3xl border border-rose-100 bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-lg font-bold text-gray-900">Choose Celebrity</div>
                <button
                  onClick={() => setShowAllCelebrities(false)}
                  className="rounded-full p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                >
                  <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4">Select a celebrity to start chatting with them.</p>

              {/* Scrollable Celebrities Grid */}
              <div className="h-80 overflow-y-auto border border-rose-100 rounded-2xl p-4">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {CELEBRITIES.map((celebrity) => (
                    <button
                      key={celebrity.id}
                      onClick={() => addCelebrityToChat(celebrity)}
                      className="flex flex-col items-center gap-2 rounded-2xl border border-rose-100 bg-white p-3 text-sm hover:bg-rose-50 hover:border-rose-200 transition-colors"
                    >
                      <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-br from-rose-100 to-rose-200">
                        <Image
                          src={`/celebrities/${celebrity.image_url}`}
                          alt={celebrity.name}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-medium text-gray-800 text-center leading-tight">{celebrity.name}</span>
                      <span className="text-xs text-rose-600">Start Chat</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={() => setShowAllCelebrities(false)}
                  className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </ProtectedRoute>
  );
}

function MobileNavLink({ href, icon, label, active, disabled }) {
  if (disabled) {
    return (
      <div className="flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-gray-400 opacity-50 cursor-not-allowed">
        <FontAwesomeIcon icon={icon} className="h-5 w-5" />
        {label}
      </div>
    );
  }

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

function ChatBubble({ who, type = 'text', content, duration }) {
  const isMe = who === "me" || who === "user";
  const [isPlaying, setIsPlaying] = useState(false);

  const toggleAudio = () => {
    const audio = document.getElementById(`audio-${content}`);
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[70%] rounded-2xl px-4 py-3 text-sm shadow ${isMe
          ? "rounded-br-sm bg-rose-100 text-rose-700"
          : "rounded-bl-sm bg-rose-100 text-gray-800"
          }`}
      >
        {type === 'text' ? (
          <span>{content}</span>
        ) : (
          <div className="flex items-center gap-3 min-w-[200px]">
            <button
              onClick={toggleAudio}
              className="rounded-full bg-white/20 p-2 hover:bg-white/30 transition-colors"
            >
              <FontAwesomeIcon
                icon={isPlaying ? faPause : faPlay}
                className="h-3 w-3"
              />
            </button>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <FontAwesomeIcon icon={faMicrophone} className="h-3 w-3 opacity-70" />
                <span className="text-xs opacity-70">Audio message</span>
              </div>
              <div className="text-xs opacity-70 mt-1">{duration || '0:05'}</div>
            </div>
            <audio
              id={`audio-${content}`}
              onEnded={() => setIsPlaying(false)}
              className="hidden"
            >
              <source src={content} type="audio/wav" />
            </audio>
          </div>
        )}
      </div>
    </div>
  );
}

function AddUserModal({ onClose, onCreate }) {
  const [tab, setTab] = useState("user");
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
      <div className={`w-full rounded-3xl border border-rose-100 bg-white p-4 sm:p-6 shadow-xl
         h-auto ${tab === "celebs" ? "max-w-5xl " : "max-w-5xl sm:max-w-md  max-md:overflow-auto"}`}>
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
          <form onSubmit={submit} className="space-y-3 sm:space-y-4">
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
              <div className="mt-2 grid grid-cols-4 sm:grid-cols-5 gap-2">
                {AVATARS.map((a) => (
                  <button
                    type="button"
                    key={a}
                    onClick={() => setAvatar(a)}
                    className={`aspect-square w-full h-20 sm:h-16 overflow-hidden rounded-xl border ${avatar === a ? "border-rose-500 ring-2 ring-rose-200" : "border-rose-100"
                      }`}
                  >
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
                className="rounded-full bg-rose-200 px-4 py-2 text-sm font-bold text-rose-700 hover:bg-rose-300 shadow-sm"
              >
                Create
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Pick a celebrity character to start chatting instantly.</p>
            {/* Fixed height container with scroll */}
            <div className="h-96 overflow-y-auto border border-rose-100 rounded-2xl p-3">
              <div className="grid grid-cols-2 gap-2 sm:gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {CELEBRITIES.map((person) => (
                  <button
                    key={person.id}
                    type="button"
                    onClick={() => {
                      const id = `celebrity-${person.id}`;
                      const newChat = {
                        name: person.name,
                        gender: "other",
                        avatar: `/celebrities/${person.image_url}`,
                        role: "Celebrity",
                      };

                      // Check if celebrity already exists
                      const existingChat = chats.find(chat => chat.id === id);
                      if (existingChat) {
                        setActiveId(id);
                        onClose();
                        return;
                      }

                      // Initialize messages for celebrity
                      setChatMessages(prev => ({
                        ...prev,
                        [id]: [
                          {
                            id: Date.now(),
                            type: 'text',
                            content: `Hello! I'm ${person.name}. How can I help you today?`,
                            sender: 'them',
                            timestamp: new Date()
                          }
                        ]
                      }));

                      onCreate({
                        ...newChat,
                        id
                      });
                    }}
                    className="flex flex-col items-center gap-2 rounded-2xl border border-rose-100 bg-white p-3 text-sm hover:bg-rose-200"
                  >
                    <img
                      src={`/celebrities/${person.image_url}`}
                      alt={person.name}
                      className="h-16 w-16 rounded-xl object-cover"
                    />
                    <span className="font-semibold text-gray-800 text-center leading-tight">{person.name}</span>
                    <span className="text-[10px] text-rose-600">Start chat</span>
                  </button>
                ))}
              </div>
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
  { id: "shahrukh", name: "Shahrukh Khan", image_url: "shahrukh.jpeg", role: 'you are famous superstar shahrukh khan talk like shahrukh khan' },
  { id: "elonmusk", name: "Elon Musk", image_url: "elonmusk.jpeg" },
  { id: "amitabh", name: "Amitabh Bachchan", image_url: "amitabh.jpeg" },
  { id: "premanandji", name: "Premanand Ji Maharaj", image_url: "premanandji.jpeg" },
  { id: "Rashmika", name: "Rashmika mandhana", image_url: "crush.jpeg" },
  { id: "deepika", name: "Deepika Padukone", image_url: "deepika.jpeg" },
  { id: "gaurgopal", name: "Gaur Gopal Das", image_url: "gaurgopal.jpeg" },
  { id: "ambani", name: "Mukesh Ambani", image_url: "ambani.jpeg" },

  { id: "guthi", name: "Guthi", image_url: "guthi.jpeg" },
  { id: "aasharam", name: "Aasharam Bapu", image_url: "aasharam.jpeg" },
  { id: "baburao", name: "Baburao Ganpatrao", image_url: "baburao.jpeg" },
  { id: "pushpa", name: "Pushpa Raj", image_url: "pushpa.jpeg" },
  { id: "honeysingh", name: "Honey Singh", image_url: "honeysingh.jpeg" },
  { id: "jahanvikapoor", name: "Janhvi Kapoor", image_url: "jahanvikapoor.jpeg" },
  { id: "katrina", name: "Katrina Kaif", image_url: "katrina.jpeg" },
  { id: "modi", name: "Narendra Modi", image_url: "modi.jpeg" },
  { id: "nora", name: "Nora Fatehi", image_url: "nora.jpeg" },

  { id: "priyanka", name: "Priyanka Chopra", image_url: "priyanka.jpeg" },

  { id: "ranbir", name: "Ranbir Kapoor", image_url: "ranbir.jpeg" },
  { id: "sachin", name: "Sachin Tendulkar", image_url: "sachin.jpeg" },
  { id: "salman", name: "Salman Khan", image_url: "salman.jpeg" },

  { id: "shraddha", name: "Shraddha Kapoor", image_url: "shraddha.jpeg" },
  { id: "tammanna", name: "Tamannaah Bhatia", image_url: "tammanna.jpeg" },
  { id: "trump", name: "Donald Trump", image_url: "trump.jpeg" },
  { id: "virat", name: "Virat Kohli", image_url: "virat.jpeg" },
];
