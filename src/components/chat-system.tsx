'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, LogOut, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { auth, db, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import {
  collection,
  doc,
  addDoc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: any;
  isAdmin: boolean;
}

export default function ChatSystem() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Listen to user's chat messages & metadata for unread count
  useEffect(() => {
    if (!user) {
      setMessages([]);
      return;
    }

    // 1. Listen to messages subcollection
    const msgQuery = query(
      collection(db, 'chats', user.uid, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribeMsgs = onSnapshot(msgQuery, (snapshot) => {
      const msgs: Message[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        msgs.push({
          id: doc.id,
          senderId: data.senderId,
          senderName: data.senderName,
          text: data.text,
          timestamp: data.timestamp,
          isAdmin: data.isAdmin,
        });
      });
      setMessages(msgs);
      scrollToBottom();
    }, (error) => {
      console.error("Error fetching messages:", error);
    });

    // 2. Listen to user's meta document to track unread status
    const metaDocRef = doc(db, 'chats', user.uid);
    const unsubscribeMeta = onSnapshot(metaDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        // If chat is open, reset unread status
        if (isOpen && data.unreadByUser) {
          updateDoc(metaDocRef, { unreadByUser: false });
          setUnreadCount(0);
        } else if (!isOpen && data.unreadByUser) {
          setUnreadCount(1); // Indicate there are new messages
        }
      }
    });

    return () => {
      unsubscribeMsgs();
      unsubscribeMeta();
    };
  }, [user, isOpen]);

  // Reset unread when opening the chat box
  useEffect(() => {
    if (isOpen && user) {
      const metaDocRef = doc(db, 'chats', user.uid);
      updateDoc(metaDocRef, { unreadByUser: false }).catch(() => {});
      setUnreadCount(0);
    }
  }, [isOpen, user]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const messageText = newMessage.trim();
    setNewMessage('');

    try {
      // Create/Update user chat session meta doc
      const chatUserRef = doc(db, 'chats', user.uid);
      await setDoc(chatUserRef, {
        uid: user.uid,
        userName: user.displayName || 'Guest User',
        userEmail: user.email,
        userPhotoUrl: user.photoURL || '',
        lastMessage: messageText,
        lastMessageTimestamp: serverTimestamp(),
        unreadByAdmin: true,
        unreadByUser: false,
      }, { merge: true });

      // Add actual message
      await addDoc(collection(db, 'chats', user.uid, 'messages'), {
        senderId: user.uid,
        senderName: user.displayName || 'Guest User',
        text: messageText,
        timestamp: serverTimestamp(),
        isAdmin: false,
      });

      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Chat Trigger Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-primary hover:bg-primary-hover text-white flex items-center justify-center cursor-pointer shadow-lg glow-button relative focus:outline-none"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary-deep text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </motion.button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="absolute bottom-18 right-0 w-[350px] sm:w-[380px] h-[500px] rounded-2xl glass-panel shadow-2xl overflow-hidden flex flex-col border border-primary/10"
          >
            {/* Chat Header */}
            <div className="bg-primary px-4 py-4 text-white flex items-center justify-between shadow-sm">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5" />
                <div>
                  <h3 className="font-serif font-bold tracking-wide text-sm">Raaga Bhairavi Support</h3>
                  <span className="text-[10px] text-white/80 block">We typically reply in real-time</span>
                </div>
              </div>
              {user && (
                <button
                  onClick={handleLogout}
                  className="text-white/80 hover:text-white transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loading ? (
                <div className="h-full flex items-center justify-center text-text-secondary text-sm">
                  Connecting...
                </div>
              ) : !user ? (
                /* Login Prompt */
                <div className="h-full flex flex-col items-center justify-center text-center px-4 space-y-6">
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-foreground text-lg">Direct Chat Access</h4>
                    <p className="text-xs text-text-secondary mt-2 max-w-[250px]">
                      Connect instantly with our musical group coordinators. Log in securely using Google to begin.
                    </p>
                  </div>
                  <button
                    onClick={handleLogin}
                    className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover text-white text-xs font-semibold tracking-wider uppercase glow-button transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Sign In With Google</span>
                  </button>
                </div>
              ) : messages.length === 0 ? (
                /* Welcome / Start of thread */
                <div className="h-full flex flex-col items-center justify-center text-center text-text-secondary text-xs px-6 space-y-2">
                  <p className="font-semibold text-foreground">Hello, {user.displayName}!</p>
                  <p>Send a message below to start your conversation with the Raaga Bhairavi team.</p>
                </div>
              ) : (
                /* Message Thread */
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${
                      msg.isAdmin ? 'items-start' : 'items-end'
                    }`}
                  >
                    <div className="text-[9px] text-text-light mb-1 px-1">
                      {msg.isAdmin ? 'Team' : msg.senderName}
                    </div>
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                        msg.isAdmin
                          ? 'bg-white text-text-secondary rounded-tl-none border border-primary/5'
                          : 'bg-primary text-white rounded-tr-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Chat Footer Input */}
            {user && (
              <form onSubmit={handleSendMessage} className="p-3 bg-white/50 border-t border-primary/5 flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 bg-white border border-primary/10 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-primary text-foreground"
                />
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                    newMessage.trim()
                      ? 'bg-primary hover:bg-primary-hover text-white cursor-pointer'
                      : 'bg-primary/20 text-white/50 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
