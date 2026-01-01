"use client";
import { useMemo, useState, useEffect, useRef } from "react";
import Link from "next/link";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useAuth } from "../contexts/AuthContext";
import TaraChat from "../components/TaraChat";
import LoginModal from "../components/LoginModal";

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
  faTrash,
  faBrain,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import BottomNav from "../components/BottomNav";
import ProfileCompletionCircle from "../components/ProfileCompletionCircle";





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
  const router = useRouter();
  const { user, loading } = useAuth();
  const defaultTaraChat = { id: "tara-ai", name: "TARA AI", last: "", unread: 0, avatar: "/taralogo.jpg" };
  const [chats, setChats] = useState([defaultTaraChat]);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Check if user is logged in
  useEffect(() => {
    if (!loading && !user) {
      setShowLoginModal(true);
    } else {
      setShowLoginModal(false);
    }
  }, [user, loading]);

  const handleLoginSuccess = (isNewUser, userData) => {
    if (isNewUser || !userData.isOnboardingComplete) {
      router.push('/?showOnboarding=true');
    } else {
      setShowLoginModal(false);
    }
  };
  const [activeId, setActiveId] = useState("tara-ai");
  const [message, setMessage] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  // Store messages per chat ID
  const [chatMessages, setChatMessages] = useState({});
  // Track if mood greeting was sent
  const [moodGreetingSent, setMoodGreetingSent] = useState(false);
  // Track session start time (when user logged in/opened chat)
  const [sessionStartTime, setSessionStartTime] = useState(null);
  // Track if older messages are shown
  const [showOlderMessages, setShowOlderMessages] = useState(false);
  // Store current session messages (mood greeting + new messages) - these should ALWAYS be visible
  const [currentSessionMessages, setCurrentSessionMessages] = useState([]);
  // Track which message is currently typing
  const [typingMessageId, setTypingMessageId] = useState(null);

  // Reset typing state after a delay (when typing animation completes)
  useEffect(() => {
    if (typingMessageId) {
      // Find the message to get its content length
      const typingMessage = currentSessionMessages.find(m => m.id === typingMessageId);
      if (typingMessage && typingMessage.content) {
        // Calculate typing duration (20ms per character + 500ms buffer)
        const typingDuration = (typingMessage.content.length * 20) + 500;
        const timer = setTimeout(() => {
          setTypingMessageId(null);
        }, typingDuration);
        return () => clearTimeout(timer);
      }
    }
  }, [typingMessageId, currentSessionMessages]);

  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // Fetch AI suggestions when the last message is from the AI
  useEffect(() => {
    const fetchSuggestions = async () => {
      // Determine current messages based on activeId
      let currentMsgs = [];
      if (activeId === "tara-ai") {
        currentMsgs = showOlderMessages
          ? [...(chatMessages["tara-ai"] || []), ...currentSessionMessages]
          : currentSessionMessages;
      } else {
        currentMsgs = chatMessages[activeId] || [];
      }

      if (currentMsgs.length === 0) return;

      const lastMsg = currentMsgs[currentMsgs.length - 1];

      // Only generate if last message is from AI/them and we haven't already generated for this ID
      if ((lastMsg.sender === 'them' || lastMsg.sender === 'ai') && !msgIdProcessedRef.current.has(lastMsg.id)) {
        if (loadingSuggestions) return;

        console.log('Fetching suggestions for message:', lastMsg.id);
        setLoadingSuggestions(true);
        // Mark as processed immediately
        msgIdProcessedRef.current.add(lastMsg.id);

        try {
          const response = await fetch('/api/chat/suggestions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              messages: currentMsgs.slice(-5), // Send last 5 messages context
              userDetails: {
                name: user?.name,
                interests: user?.interests
              }
            })
          });

          const data = await response.json();
          if (data.suggestions) {
            setAiSuggestions(data.suggestions);
          }
        } catch (error) {
          console.error("Failed to fetch suggestions:", error);
        } finally {
          setLoadingSuggestions(false);
        }
      } else if (lastMsg.sender === 'user') {
        // Clear suggestions if user replied
        setAiSuggestions([]);
      }
    };

    // Add a small delay to ensure message processing is complete
    const timeout = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(timeout);
  }, [chatMessages, currentSessionMessages, activeId, showOlderMessages]);

  const msgIdProcessedRef = useRef(new Set());

  // Ref for messages container to enable auto-scroll
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Initialize TaraChat component
  // Set session start time when component mounts
  useEffect(() => {
    if (user?.uid && !sessionStartTime) {
      setSessionStartTime(new Date());
    }
  }, [user?.uid]);

  // Reset showOlderMessages when switching chats
  useEffect(() => {
    setShowOlderMessages(false);
  }, [activeId]);

  const taraChat = TaraChat({
    userId: user?.uid,
    onMessagesUpdate: (messages) => {
      console.log('TaraChat onMessagesUpdate called with', messages.length, 'messages');

      // Filter messages based on session start time
      if (sessionStartTime) {
        // Separate old messages (before session) and new messages (during session)
        const oldMessages = messages.filter(msg => {
          const msgTime = msg.timestamp ? new Date(msg.timestamp) : new Date();
          return msgTime < sessionStartTime;
        });

        const newMessages = messages.filter(msg => {
          const msgTime = msg.timestamp ? new Date(msg.timestamp) : new Date();
          return msgTime >= sessionStartTime;
        });

        // Store old messages separately (for "See Older Messages")
        setChatMessages(prev => ({
          ...prev,
          "tara-ai": oldMessages
        }));

        // Add new messages to current session with typing effect for Tara's messages
        if (newMessages.length > 0) {
          setCurrentSessionMessages(prev => {
            // Remove any temporary messages first
            const nonTempMessages = prev.filter(m => !m.isTemp);

            // Avoid duplicates by checking IDs ONLY
            // Content-based deduplication was hiding valid identical responses (e.g., for '?' or '<<')
            const existingIds = new Set(nonTempMessages.map(m => m.id));

            const uniqueNewMessages = newMessages.filter(m => !existingIds.has(m.id));

            // For Tara's messages (sender: 'them'), add typing effect
            uniqueNewMessages.forEach(msg => {
              if (msg.sender === 'them' || msg.sender === 'ai') {
                // Trigger typing animation for this message
                setTypingMessageId(msg.id);
              }
            });

            return [...nonTempMessages, ...uniqueNewMessages];
          });
        }
      } else {
        // No session start time yet, just store all messages
        setChatMessages(prev => ({
          ...prev,
          "tara-ai": messages
        }));
      }

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

  // Load custom users - only once when user is available
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    if (user?.uid && !hasInitialized) {
      loadCustomUsers();
      setHasInitialized(true);
    } else if (!user?.uid) {
      setHasInitialized(false);
    }
  }, [user?.uid, hasInitialized]);

  // Load chat history when user is available (but don't show by default)
  // Wait a bit to let mood greeting load first
  useEffect(() => {
    if (user?.uid && activeId === "tara-ai") {
      // Check if coming from mood selection
      const urlParams = new URLSearchParams(window.location.search);
      const fromMood = urlParams.get('fromMood');

      // If coming from mood, delay loading history to let mood greeting show first
      // Otherwise load immediately
      const delay = fromMood === 'true' ? 1000 : 100;

      const timer = setTimeout(() => {
        taraChat.loadChatHistory();
      }, delay);
      return () => clearTimeout(timer);
    }
  }, [user?.uid]);



  // Send automatic mood-based greeting when user comes from mood selection
  useEffect(() => {
    const sendMoodGreeting = async () => {
      if (!user?.uid) return;

      // Check if user came from mood selection
      const urlParams = new URLSearchParams(window.location.search);
      const fromMood = urlParams.get('fromMood');
      const moodDataParam = urlParams.get('moodData');

      console.log('Mood greeting check:', { fromMood, moodDataParam, activeId });

      if (fromMood === 'true' && moodDataParam) {
        try {
          const moodData = JSON.parse(decodeURIComponent(moodDataParam));
          console.log('Parsed mood data:', moodData);

          // Generate mood-based greeting message (Hinglish style)
          const moodGreetings = {
            calm: `Namaste! 😌 You're feeling calm today. What's helping you stay peaceful?`,
            happy: `Hey there! 😊 So glad to see you happy! What's making you smile today?`,
            grateful: `Hello! 🙏 Gratitude is such a great feeling. What are you grateful for right now?`,
            motivated: `Hi! 💪 Love that energy! What are you planning to achieve today?`,
            healing: `Hello. 🌱 Healing takes time, and that's okay. How can I support you today?`,
            lost: `Hey. 🤔 Feeling lost is normal sometimes. Want to talk about what's on your mind?`,
            lonely: `Hi friend. 😔 I'm here for you. What's making you feel lonely right now?`,
            sad: `Hello. 😢 I'm here if you want to share what's making you sad.`,
            stressed: `Hey. 😰 Take a deep breath with me. What's stressing you out?`,
            anxious: `Hi. 😟 Let's take it slow. What's worrying you at the moment?`,
            overwhelmed: `Hello. 😵 Just take one thing at a time. What's the biggest thing on your mind?`,
            angry: `Hey. 😠 It's okay to be angry. What happened that upset you?`
          };

          const greetingMessage = moodGreetings[moodData.mood] || `Hello! I see you're feeling ${moodData.mood} today. How can I support you?`;

          console.log('Sending mood greeting:', greetingMessage);

          // IMPORTANT: Set session start time to NOW
          const now = new Date();
          setSessionStartTime(now);

          // Ensure older messages are hidden by default
          setShowOlderMessages(false);

          // Add Tara's greeting message
          const taraGreeting = {
            id: Date.now().toString(),
            content: greetingMessage,
            sender: 'them', // Message from Tara
            timestamp: now,
            type: 'text'
          };

          // Mark that mood greeting was sent
          setMoodGreetingSent(true);

          // Add greeting to CURRENT SESSION messages (these will ALWAYS be visible)
          setCurrentSessionMessages([taraGreeting]);

          // Trigger typing effect for mood greeting
          setTypingMessageId(taraGreeting.id);

          // Update last message in chat list
          setChats(prev => prev.map(chat =>
            chat.id === "tara-ai"
              ? { ...chat, last: greetingMessage.substring(0, 50) + "..." }
              : chat
          ));

          // Save to database
          try {
            await fetch('/api/users/conversations', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: user.uid,
                chatUserId: 'tara-ai',
                message: greetingMessage,
                sender: 'them',
                type: 'text'
              })
            });
            console.log('Mood greeting saved to DB');
          } catch (error) {
            console.error('Failed to save mood greeting to DB:', error);
          }

          // Clean up URL params
          window.history.replaceState({}, '', '/chatlist');
        } catch (error) {
          console.error('Failed to send mood greeting:', error);
        }
      }
    };

    // Run when user is available and we're on TARA chat
    if (user?.uid) {
      sendMoodGreeting();
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
  const allMessages = chatMessages[activeId] || [];

  // Filter messages based on session (only for TARA AI)
  let messages = [];
  let olderMessagesCount = 0;

  if (activeId === "tara-ai") {
    if (showOlderMessages) {
      // Show ALL messages (old + current session)
      messages = [...allMessages, ...currentSessionMessages];
    } else {
      // Show ONLY current session messages (mood greeting + new messages)
      messages = currentSessionMessages;
      // Count older messages
      olderMessagesCount = allMessages.length;
    }
  } else {
    // For other chats, show all messages
    messages = allMessages;
  }
  const activeChat = useMemo(() => chats.find((c) => c.id === activeId), [chats, activeId]);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll to bottom when messages change or active chat changes
  useEffect(() => {
    scrollToBottom();
  }, [messages, activeId]);

  // Also scroll when component mounts
  useEffect(() => {
    scrollToBottom();
  }, []);

  // Audio recording functions with live speech recognition
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks = [];

      // Start speech recognition simultaneously
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.lang = 'en-US'; // Change to 'hi-IN' for Hindi
      recognition.interimResults = true;
      recognition.continuous = true;

      let finalTranscript = '';

      recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        console.log('Recognizing:', interimTranscript || finalTranscript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };

      recognition.start();

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/wav' });
        // Store both audio blob and transcript
        blob.transcript = finalTranscript.trim();
        setAudioBlob(blob);
        stream.getTracks().forEach(track => track.stop());
        recognition.stop();
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

  const sendAudioMessage = async () => {
    if (!audioBlob || isSendingMessage) return;

    setIsSendingMessage(true);
    const audioUrl = URL.createObjectURL(audioBlob);

    try {
      // Step 1: Get transcribed text from audio blob (recorded during recording)
      const transcribedText = audioBlob.transcript || '';

      if (!transcribedText) {
        alert('Could not understand audio. Please speak clearly and try again.');
        setIsSendingMessage(false);
        setAudioBlob(null);
        return;
      }

      console.log('Using transcript:', transcribedText);

      // Step 2: Show user's audio message
      const userAudioMessage = {
        id: Date.now().toString(),
        type: 'audio',
        content: audioUrl,
        transcription: transcribedText,
        sender: 'user',
        timestamp: new Date(),
        duration: '0:05'
      };

      setChatMessages(prev => ({
        ...prev,
        [activeId]: [...(prev[activeId] || []), userAudioMessage]
      }));

      // Step 3: Send transcribed text to AI
      let aiResponse;
      if (activeId === "tara-ai" && user?.uid) {
        await taraChat.sendMessage(transcribedText, {
          name: user.name,
          gender: user.gender,
          ageRange: user.ageRange,
          profession: user.profession,
          interests: user.interests,
          personalityTraits: user.personalityTraits
        });
      } else {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.firebaseUid || user.uid,
            chatUserId: activeId,
            message: transcribedText,
            userDetails: {
              name: user.name,
              gender: user.gender,
              ageRange: user.ageRange,
              profession: user.profession,
              interests: user.interests,
              personalityTraits: user.personalityTraits
            }
          })
        });

        const data = await response.json();
        if (data.success) {
          aiResponse = data.aiMessage.content;

          // Step 4: Convert AI response to speech
          const aiAudioUrl = await textToSpeech(aiResponse);

          // Step 5: Add AI audio response
          const aiAudioMessage = {
            id: Date.now().toString() + '-ai',
            type: 'audio',
            content: aiAudioUrl,
            transcription: aiResponse,
            sender: 'them',
            timestamp: new Date()
          };

          setChatMessages(prev => ({
            ...prev,
            [activeId]: [...(prev[activeId] || []), aiAudioMessage]
          }));

          // Auto-play AI response
          const audio = new Audio(aiAudioUrl);
          audio.play();
        }
      }

      setAudioBlob(null);
    } catch (error) {
      console.error('Error sending audio message:', error);
      alert('Failed to send audio message. Please try again.');
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Speech-to-Text function - Convert recorded audio to text
  const transcribeAudio = async (audioBlob) => {
    // For now, we'll use a simple approach: play the audio and use live recognition
    // In production, you'd want to use a proper STT API like Google Cloud Speech-to-Text

    return new Promise((resolve) => {
      try {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US'; // Change to 'hi-IN' for Hindi
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;
        recognition.continuous = false;

        let transcriptReceived = false;

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          console.log('Transcribed:', transcript);
          transcriptReceived = true;
          resolve(transcript);
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          if (!transcriptReceived) {
            resolve(''); // Return empty string on error
          }
        };

        recognition.onend = () => {
          if (!transcriptReceived) {
            resolve(''); // Return empty if no transcript received
          }
        };

        // Play the recorded audio and start recognition simultaneously
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);

        audio.onplay = () => {
          recognition.start();
        };

        audio.onerror = () => {
          resolve('');
        };

        audio.play();
      } catch (error) {
        console.error('Transcription error:', error);
        resolve('');
      }
    });
  };

  // Text-to-Speech function
  const textToSpeech = async (text) => {
    return new Promise((resolve) => {
      try {
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US'; // Change to 'hi-IN' for Hindi
        utterance.rate = 0.9; // Slightly slower for clarity
        utterance.pitch = 1.1; // Slightly higher for female voice
        utterance.volume = 1.0;

        // Wait for voices to load and set female voice
        const setVoice = () => {
          const voices = window.speechSynthesis.getVoices();
          const femaleVoice = voices.find(voice =>
            voice.name.includes('Female') ||
            voice.name.includes('Samantha') ||
            voice.name.includes('Google UK English Female') ||
            voice.name.includes('Microsoft Zira')
          );

          if (femaleVoice) {
            utterance.voice = femaleVoice;
          }
        };

        if (window.speechSynthesis.getVoices().length > 0) {
          setVoice();
        } else {
          window.speechSynthesis.onvoiceschanged = setVoice;
        }

        utterance.onend = () => {
          console.log('Speech finished');
          resolve('speech-completed');
        };

        utterance.onerror = (event) => {
          console.error('Speech synthesis error:', event.error);
          resolve('speech-error');
        };

        // Speak the text
        window.speechSynthesis.speak(utterance);

        // Return a placeholder URL (actual speech happens via browser TTS)
        resolve('tts-audio-playing');
      } catch (error) {
        console.error('Text-to-speech error:', error);
        resolve('tts-error');
      }
    });
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

      // Show user message immediately with a temporary ID
      const tempId = `temp-${Date.now()}`;
      const tempUserMessage = {
        id: tempId,
        content: messageText,
        sender: 'user',
        timestamp: new Date(),
        isTemp: true // Mark as temporary
      };

      // Add to current session messages (always visible)
      setCurrentSessionMessages(prev => [...prev, tempUserMessage]);

      try {
        console.log('Sending message to TARA with user details:', {
          name: user.name,
          gender: user.gender,
          ageRange: user.ageRange,
          profession: user.profession
        });

        const result = await taraChat.sendMessage(messageText, {
          name: user.name,
          gender: user.gender,
          ageRange: user.ageRange,
          profession: user.profession,
          interests: user.interests,
          personalityTraits: user.personalityTraits
        });

        console.log('Message sent successfully, result:', result);

        // Remove temp message after successful send (real message will come from onMessagesUpdate)
        setCurrentSessionMessages(prev => prev.filter(m => m.id !== tempId));
      } catch (error) {
        console.error('Failed to send message to TARA:', error);
        console.error('Error details:', error.message, error.stack);
        alert(`Failed to send message: ${error.message}`);
        // Remove the temp message on error from current session
        setCurrentSessionMessages(prev => prev.filter(m => m.id !== tempId));
      } finally {
        setIsSendingMessage(false);
      }
    } else {
      // For all other chat users (custom + celebrities), use unified chat API
      setIsSendingMessage(true);

      // Show user message immediately
      const tempUserMessage = {
        id: Date.now().toString(),
        content: messageText,
        sender: 'user',
        timestamp: new Date()
      };

      setChatMessages(prev => ({
        ...prev,
        [activeId]: [...(prev[activeId] || []), tempUserMessage]
      }));

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.firebaseUid || user.uid,
            chatUserId: activeId,
            message: messageText,
            userDetails: {
              name: user.name,
              gender: user.gender,
              ageRange: user.ageRange,
              profession: user.profession,
              interests: user.interests,
              personalityTraits: user.personalityTraits
            }
          })
        });

        const data = await response.json();

        if (data.success) {
          // Replace temp message with actual messages from API
          setChatMessages(prev => ({
            ...prev,
            [activeId]: [...(prev[activeId] || []).filter(m => m.id !== tempUserMessage.id), data.userMessage, data.aiMessage]
          }));

          // Update last message in chat list
          setChats(prev => prev.map(chat =>
            chat.id === activeId
              ? { ...chat, last: data.aiMessage.content.substring(0, 50) + "..." }
              : chat
          ));
        } else {
          throw new Error(data.error || 'Failed to send message');
        }
      } catch (error) {
        console.error('Failed to send message:', error);
        alert('Failed to send message. Please try again.');
        // Remove the temp message on error
        setChatMessages(prev => ({
          ...prev,
          [activeId]: (prev[activeId] || []).filter(m => m.id !== tempUserMessage.id)
        }));
      } finally {
        setIsSendingMessage(false);
      }
    }
  };

  const sendSuggestedMessage = async (suggestedText) => {
    if (isSendingMessage) return;

    // If chatting with TARA AI, use the TARA chat component
    if (activeId === "tara-ai" && user?.uid) {
      setIsSendingMessage(true);

      try {
        await taraChat.sendMessage(suggestedText, {
          name: user.name,
          gender: user.gender,
          ageRange: user.ageRange,
          profession: user.profession,
          interests: user.interests,
          personalityTraits: user.personalityTraits
        });
      } catch (error) {
        console.error('Failed to send suggested message to TARA:', error);
      } finally {
        setIsSendingMessage(false);
      }
    } else {
      // For all other chat users, use unified chat API
      setIsSendingMessage(true);
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.firebaseUid || user.uid,
            chatUserId: activeId,
            message: suggestedText,
            userDetails: {
              name: user.name,
              gender: user.gender,
              ageRange: user.ageRange,
              profession: user.profession,
              interests: user.interests,
              personalityTraits: user.personalityTraits
            }
          })
        });

        const data = await response.json();

        if (data.success) {
          setChatMessages(prev => ({
            ...prev,
            [activeId]: [...(prev[activeId] || []), data.userMessage, data.aiMessage]
          }));

          setChats(prev => prev.map(chat =>
            chat.id === activeId
              ? { ...chat, last: data.aiMessage.content.substring(0, 50) + "..." }
              : chat
          ));
        }
      } catch (error) {
        console.error('Failed to send suggested message:', error);
      } finally {
        setIsSendingMessage(false);
      }
    }
  };

  const deleteChat = async (chatId, e) => {
    e.stopPropagation(); // Prevent chat selection when clicking delete

    // Don't allow deleting TARA AI
    if (chatId === 'tara-ai') {
      alert('Cannot delete TARA AI');
      return;
    }

    if (!confirm('Are you sure you want to delete this chat?')) {
      return;
    }

    try {
      // Remove from local state
      setChats(prev => prev.filter(chat => chat.id !== chatId));

      // Remove messages
      setChatMessages(prev => {
        const newMessages = { ...prev };
        delete newMessages[chatId];
        return newMessages;
      });

      // If deleted chat was active, switch to TARA
      if (activeId === chatId) {
        setActiveId('tara-ai');
      }

      // Delete from database
      if (user?.uid) {
        const response = await fetch(`/api/users?userId=${user.uid}&chatUserId=${chatId}`, {
          method: 'DELETE'
        });

        if (!response.ok) {
          throw new Error('Failed to delete from database');
        }
      }
    } catch (error) {
      console.error('Failed to delete chat:', error);
      alert('Failed to delete chat. Please try again.');
    }
  };

  // Celebrity feature temporarily disabled

  return (
    <>
      <Head>
        <title>AI Chat - Talk to AI Characters | Tara Emotional Wellness</title>
        <meta name="description" content="Chat with AI characters for emotional support, motivation, and guidance. Get 24/7 companionship from Tara's diverse AI personalities including life coaches and therapists." />
        <meta name="keywords" content="AI chat, emotional support chat, AI companion, virtual therapist, AI life coach, mental health chat, AI characters, emotional wellness" />
        <link rel="canonical" href="https://www.tara4u.com/chatlist" />
        <meta property="og:title" content="AI Chat - Talk to AI Characters | Tara" />
        <meta property="og:description" content="Chat with AI characters for emotional support and guidance. Available 24/7." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.tara4u.com/chatlist" />
      </Head>

      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLoginSuccess={handleLoginSuccess}
        showCloseButton={false}
      />

      <div className={`flex min-h-screen flex-col bg-gradient-to-br from-rose-50 via-white to-rose-100 ${showLoginModal ? 'blur-sm pointer-events-none' : ''}`}>
        {/* Header */}
        <header className="sticky top-0 z-20 border-b border-rose-100 bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex  items-center justify-between px-3 sm:px-4 ">
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Mobile Menu Button - TEMPORARILY HIDDEN */}
              {/* <button
                onClick={() => setShowMobileSidebar(true)}
                className="md:hidden rounded-lg p-2 text-rose-600 hover:bg-rose-100 transition-colors"
              >
                <FontAwesomeIcon icon={faBars} className="h-5 w-5" />
              </button> */}

              <img
                src="/taralogo.jpg"
                alt="Tara Logo"
                className="h-7 w-7 sm:h-8 sm:w-8 rounded-full object-cover"
              />
              <span className="text-base sm:text-lg font-semibold text-rose-600">Tara4u</span>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/stress-check"
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full border border-rose-200 bg-rose-50 text-rose-600 text-sm font-semibold hover:bg-rose-100 transition-all"
              >
                <FontAwesomeIcon icon={faBrain} className="h-4 w-4" />
                Check Stress Level
              </Link>
              <Link href="/profile" className="rounded-full p-2 hover:bg-rose-100 transition-colors">
                <ProfileCompletionCircle size="md" showPercentage={false} />
              </Link>
            </div>
          </div>
        </header>

        <div className="mx-auto flex w-full  2xl:w-full flex-1 relative gap-0 md:gap-3 md:px-3">
          {/* Mobile Sidebar Overlay - TEMPORARILY HIDDEN */}
          {/* {showMobileSidebar && (
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setShowMobileSidebar(false)}
            />
          )} */}

          {/* Sidebar - TEMPORARILY HIDDEN */}
          {/* <aside className={`
            fixed md:relative top-0 left-0 h-screen md:h-[calc(100vh-64px-56px)] w-72 sm:w-80 md:w-80 lg:w-96
            transform transition-transform duration-300 ease-in-out z-50 md:z-auto
            md:transform-none
            ${showMobileSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          `}>
            <div className="h-full border-r border-rose-100 bg-white p-3 shadow-xl md:shadow-sm overflow-y-auto">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Chats</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setShowAdd(true);
                      setShowMobileSidebar(false);
                    }}
                    className="inline-flex items-center gap-2 rounded-full bg-rose-200 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-300 transition-colors"
                  >
                    <FontAwesomeIcon icon={faPlus} /> Add User
                  </button>
                  <button
                    onClick={() => setShowMobileSidebar(false)}
                    className="md:hidden rounded-full p-2 text-gray-500 hover:bg-rose-100 hover:text-rose-600 transition-colors"
                  >
                    <FontAwesomeIcon icon={faTimes} className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                {chats.map((c) => (
                  <div key={c.id} className="relative group">
                    <button
                      onClick={() => {
                        setActiveId(c.id);
                        setShowMobileSidebar(false);
                      }}
                      className={`w-full rounded-xl border px-3 py-3 text-left text-sm transition ${c.id === activeId
                        ? "border-rose-200 bg-rose-100 text-rose-600"
                        : "border-rose-100 bg-white text-gray-700 hover:bg-rose-100"
                        }`}
                    >
                      <div className="flex items-center gap-3">
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
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="font-medium truncate">{c.name}</span>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              {c.unread > 0 && (
                                <span className="inline-flex items-center rounded-full bg-rose-200 px-2 py-0.5 text-[10px] font-bold text-rose-600">
                                  {c.unread}
                                </span>
                              )}
                              {c.id !== 'tara-ai' && (
                                <div
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    deleteChat(c.id, e);
                                  }}
                                  className="text-rose-400 hover:text-rose-600 transition-colors p-1 cursor-pointer"
                                  title="Delete chat"
                                  role="button"
                                  tabIndex={0}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                      e.stopPropagation();
                                      deleteChat(c.id, e);
                                    }
                                  }}
                                >
                                  <FontAwesomeIcon icon={faTrash} className="h-3 w-3" />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="mt-1 truncate text-xs text-gray-500">{c.last}</div>
                        </div>
                      </div>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </aside> */}

          {/* Chat view */}
          <section className="flex-1 w-full md:w-auto">
            {chats.length === 0 ? (
              <div className="flex h-[calc(100vh-64px-56px)] flex-col items-center justify-center md:border md:border-rose-100 bg-white md:shadow-sm md:rounded-lg">
                <div className="text-center">
                  <FontAwesomeIcon icon={faComments} className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No chats yet</h3>
                  <p className="text-gray-500 mb-4">Start a conversation with one of our AI coaches</p>
                  <button
                    onClick={() => setShowAdd(true)}
                    className="inline-flex items-center gap-2 rounded-full bg-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-300"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                    Start Chat
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex h-[calc(100vh-64px-56px)] flex-col md:border md:border-rose-100 bg-white md:shadow-sm md:rounded-lg overflow-hidden">
                <div className="flex items-center justify-between border-b border-rose-100 px-3 sm:px-4 py-3 bg-white">
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                    {/* Active Chat Avatar */}
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center flex-shrink-0">
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
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-semibold text-gray-900 flex items-center gap-2 truncate">
                        <span className="truncate">{activeChat?.name}</span>
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">Today</div>
                    </div>
                  </div>
                </div>

                <div ref={messagesContainerRef} className="flex-1 space-y-2 sm:space-y-3 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4 relative bg-gradient-to-br from-rose-50/30 via-white to-rose-50/20">
                  {/* Premium 3D Background Effects */}
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {/* Animated gradient orbs */}
                    <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-gradient-to-br from-rose-200/20 to-rose-300/10 rounded-full blur-3xl animate-float-orb" style={{ animationDelay: '0s' }}></div>
                    <div className="absolute top-[60%] right-[10%] w-80 h-80 bg-gradient-to-br from-rose-300/15 to-rose-400/10 rounded-full blur-3xl animate-float-orb" style={{ animationDelay: '2s' }}></div>
                    <div className="absolute bottom-[20%] left-[15%] w-72 h-72 bg-gradient-to-br from-rose-100/20 to-rose-200/10 rounded-full blur-3xl animate-float-orb" style={{ animationDelay: '4s' }}></div>

                    {/* Floating particles */}
                    <div className="absolute top-[20%] left-[20%] w-2 h-2 bg-rose-300/40 rounded-full animate-float-particle" style={{ animationDelay: '0s', animationDuration: '8s' }}></div>
                    <div className="absolute top-[40%] right-[25%] w-1.5 h-1.5 bg-rose-400/30 rounded-full animate-float-particle" style={{ animationDelay: '1s', animationDuration: '10s' }}></div>
                    <div className="absolute top-[70%] left-[30%] w-2.5 h-2.5 bg-rose-200/40 rounded-full animate-float-particle" style={{ animationDelay: '2s', animationDuration: '9s' }}></div>
                    <div className="absolute top-[50%] right-[15%] w-2 h-2 bg-rose-300/35 rounded-full animate-float-particle" style={{ animationDelay: '3s', animationDuration: '11s' }}></div>
                    <div className="absolute top-[30%] left-[40%] w-1.5 h-1.5 bg-rose-400/40 rounded-full animate-float-particle" style={{ animationDelay: '4s', animationDuration: '7s' }}></div>
                    <div className="absolute bottom-[30%] right-[35%] w-2 h-2 bg-rose-200/35 rounded-full animate-float-particle" style={{ animationDelay: '5s', animationDuration: '10s' }}></div>

                    {/* Subtle grid pattern */}
                    <div className="absolute inset-0 opacity-[0.02]" style={{
                      backgroundImage: 'linear-gradient(rgba(244, 63, 94, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(244, 63, 94, 0.1) 1px, transparent 1px)',
                      backgroundSize: '50px 50px'
                    }}></div>

                    {/* Radial gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-rose-50/10"></div>
                  </div>

                  {messages.length === 0 && activeChat?.id === "tara-ai" ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-8 relative z-10">
                      <img
                        src="/taralogo.jpg"
                        alt="TARA AI"
                        className="w-16 h-16 rounded-full object-cover mb-4"
                      />
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">Welcome to TARA AI</h3>
                      <p className="text-gray-600 text-sm max-w-sm mb-4">
                        Hi! I'm TARA, your AI companion. I'm here to support your mental wellness journey.
                        Start a conversation by typing a message below.
                      </p>


                    </div>
                  ) : (
                    <>
                      {/* Show "See Older Messages" button if there are older messages and they're hidden */}
                      {activeId === "tara-ai" && !showOlderMessages && olderMessagesCount > 0 && (
                        <div className="flex justify-center mb-4">
                          <button
                            onClick={() => setShowOlderMessages(true)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-100 text-rose-600 rounded-full text-sm font-semibold hover:bg-rose-200 transition-all shadow-sm"
                          >
                            <FontAwesomeIcon icon={faHistory} className="h-4 w-4" />
                            See Older Messages ({olderMessagesCount})
                          </button>
                        </div>
                      )}

                      {/* Show "Hide Older Messages" button if older messages are visible */}
                      {activeId === "tara-ai" && showOlderMessages && olderMessagesCount > 0 && (
                        <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-sm border-b border-gray-100 py-3 flex justify-center mb-4 shadow-sm">
                          <button
                            onClick={() => setShowOlderMessages(false)}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-full text-sm font-semibold hover:bg-gray-200 transition-all shadow-sm"
                          >
                            <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                            Hide Older Messages
                          </button>
                        </div>
                      )}

                      {messages.map((msg, index) => (
                        <ChatBubble
                          key={`${msg.id}-${index}`}
                          who={msg.sender}
                          type={msg.type}
                          content={msg.content}
                          duration={msg.duration}
                          messageId={msg.id}
                          isTyping={typingMessageId === msg.id}
                        />
                      ))}

                      {/* Invisible element at the end for auto-scroll */}
                      <div ref={messagesEndRef} />
                    </>
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
                        className="rounded-full bg-rose-200 px-4 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-300"
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
                {/* Suggested Messages */}
                {(aiSuggestions.length > 0 || loadingSuggestions) && (
                  <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide min-h-[36px]">
                    {loadingSuggestions && aiSuggestions.length === 0 ? (
                      <div className="flex items-center gap-1 px-2">
                        <div className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1.5 h-1.5 bg-rose-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    ) : (
                      aiSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => sendSuggestedMessage(suggestion)}
                          className="whitespace-nowrap rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-medium text-rose-600 hover:bg-rose-100 transition-colors shadow-sm"
                        >
                          {suggestion}
                        </button>
                      ))
                    )}
                  </div>
                )}

                <form
                  onSubmit={sendMessage}
                  className="relative border-t border-rose-100 p-2 sm:p-3 bg-white"
                >
                  {/* Emoji Picker */}
                  {showEmojiPicker && (
                    <div className="absolute bottom-full left-2 right-2 sm:left-3 sm:right-3 mb-2 rounded-2xl border border-rose-100 bg-white shadow-xl z-50 max-h-[60vh]">
                      {/* Header */}
                      <div className="flex items-center justify-between p-2 sm:p-3 border-b border-rose-100">
                        <span className="text-xs sm:text-sm font-medium text-gray-700">Choose Emoji</span>
                        <button
                          type="button"
                          onClick={() => setShowEmojiPicker(false)}
                          className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                        >
                          <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Emoji Grid with Scroll */}
                      <div className="h-40 sm:h-48 overflow-y-auto p-2 sm:p-3">
                        <div className="grid grid-cols-10 sm:grid-cols-8 md:grid-cols-30 gap-1">
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

                  <div className="flex items-center gap-1 sm:gap-2">
                    {/* Emoji Button */}
                    <button
                      type="button"
                      onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      className="rounded-full p-2 text-rose-600 hover:bg-rose-50 transition-colors flex-shrink-0"
                    >
                      <FontAwesomeIcon icon={faSmile} className="h-4 w-4 sm:h-5 sm:w-5" />
                    </button>

                    {/* Message Input */}
                    <input
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="flex-1 rounded-full border border-rose-200 px-3 sm:px-4 py-2 sm:py-3 text-sm outline-none ring-rose-100 focus:ring min-w-0"
                      placeholder="Write a message..."
                    />

                    {/* Send Button */}
                    <button
                      type="submit"
                      disabled={!message.trim() || isSendingMessage}
                      className="inline-flex items-center gap-1 sm:gap-2 rounded-full bg-rose-200 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-rose-600 hover:bg-rose-300 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                    >
                      <FontAwesomeIcon icon={faPaperPlane} className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">{isSendingMessage ? 'Sending...' : 'Send'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </section>
        </div>

        <BottomNav activePage="chatlist" />

        {
          showAdd && (
            <AddUserModal
              chats={chats}
              setActiveId={setActiveId}
              setChatMessages={setChatMessages}
              onClose={() => setShowAdd(false)}
              onCreate={async (payload) => {
                // Close modal immediately to prevent multiple clicks
                setShowAdd(false);

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

        {/* Celebrity feature temporarily disabled */}

      </div>

      {/* Premium 3D Background Animation Styles */}
      <style jsx>{`
        @keyframes float-orb {
          0%, 100% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
            opacity: 0.8;
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
            opacity: 0.9;
          }
        }

        @keyframes float-particle {
          0% {
            transform: translateY(0) translateX(0) scale(1);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          50% {
            transform: translateY(-100px) translateX(20px) scale(1.2);
            opacity: 0.8;
          }
          90% {
            opacity: 0.5;
          }
          100% {
            transform: translateY(-200px) translateX(-10px) scale(0.8);
            opacity: 0;
          }
        }

        .animate-float-orb {
          animation: float-orb 20s ease-in-out infinite;
        }

        .animate-float-particle {
          animation: float-particle 10s ease-in-out infinite;
        }

        .bg-gradient-radial {
          background: radial-gradient(circle at center, var(--tw-gradient-stops));
        }
      `}</style>

    </>
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

function ChatBubble({ who, type = 'text', content, duration, messageId, isTyping }) {
  const isMe = who === "me" || who === "user";
  const [isPlaying, setIsPlaying] = useState(false);
  const [displayedText, setDisplayedText] = useState('');
  const [typingComplete, setTypingComplete] = useState(false);

  // Typing effect for Tara's messages
  useEffect(() => {
    if (type === 'text' && !isMe && isTyping && !typingComplete) {
      let currentIndex = 0;
      setDisplayedText('');

      const typingInterval = setInterval(() => {
        if (currentIndex < content.length) {
          setDisplayedText(content.substring(0, currentIndex + 1));
          currentIndex++;
        } else {
          setTypingComplete(true);
          clearInterval(typingInterval);
        }
      }, 20); // 20ms per character for smooth typing

      return () => clearInterval(typingInterval);
    } else {
      // For user messages or when typing is disabled, show full text immediately
      setDisplayedText(content);
      setTypingComplete(true);
    }
  }, [content, isMe, isTyping, type]);

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
        className={`max-w-[85%] sm:max-w-[75%] md:max-w-[70%] rounded-2xl px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm shadow-sm ${isMe
          ? "rounded-br-sm bg-rose-100 text-rose-600"
          : "rounded-bl-sm bg-gray-100 text-gray-800"
          }`}
      >
        {type === 'text' ? (
          <span>
            {displayedText}
            {!typingComplete && !isMe && (
              <span className="inline-block w-1 h-4 bg-gray-600 ml-1 animate-pulse"></span>
            )}
          </span>
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

function AddUserModal({ chats, setActiveId, setChatMessages, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [gender, setGender] = useState("male");
  const [avatar, setAvatar] = useState(AVATARS[0]);
  const [role, setRole] = useState(ROLES[0]);
  const [isCreating, setIsCreating] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (!name.trim() || isCreating) return;

    setIsCreating(true);
    try {
      await onCreate({ name, gender, avatar, role });
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4">
      <div className="w-full max-w-md rounded-2xl sm:rounded-3xl border border-rose-100 bg-white p-4 sm:p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="text-base sm:text-lg font-bold text-gray-900">Add New User</div>
        </div>

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
            <div className="mt-2 grid grid-cols-5 gap-2">
              {AVATARS.map((a) => (
                <button
                  type="button"
                  key={a}
                  onClick={() => setAvatar(a)}
                  className={`aspect-square w-full overflow-hidden rounded-xl border ${avatar === a ? "border-rose-500 ring-2 ring-rose-200" : "border-rose-100"
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
              disabled={isCreating}
              className="rounded-full border border-rose-200 px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isCreating}
              className="rounded-full bg-rose-200 px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-300 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
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
  "Best Friend",
  "Girlfriend",
  "Boyfriend",
  "Caring Sister",
  "Protective Brother",
  "Supportive Teacher",
  "Mindful Coach",
  "Career Mentor",
  "Fitness Buddy",
  "Creative Muse",
  "Compassionate Listener",
  "Tough-Love Trainer",
  "Study Partner",
  "Life Partner",
  "Romantic Partner",
  "Wisdom Sage",
  "Motivational Speaker",
  "Therapist-like Guide",
  "Crush",
  "Secret Admirer",
];

// Celebrity feature temporarily disabled
