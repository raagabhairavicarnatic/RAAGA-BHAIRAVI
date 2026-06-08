'use client';

import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, onSnapshot, query, orderBy, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { MessageSquare, Send, User, CheckCircle } from 'lucide-react';

interface ChatThread {
  id: string;
  uid: string;
  userName: string;
  userEmail: string;
  userPhotoUrl: string;
  lastMessage: string;
  lastMessageTimestamp: any;
  unreadByAdmin: boolean;
  unreadByUser: boolean;
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: any;
  isAdmin: boolean;
}

export default function AdminMessagesPage() {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 1. Listen to active chat threads (users)
  useEffect(() => {
    const q = query(collection(db, 'chats'), orderBy('lastMessageTimestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: ChatThread[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        items.push({
          id: docSnap.id,
          uid: data.uid,
          userName: data.userName,
          userEmail: data.userEmail,
          userPhotoUrl: data.userPhotoUrl,
          lastMessage: data.lastMessage,
          lastMessageTimestamp: data.lastMessageTimestamp,
          unreadByAdmin: data.unreadByAdmin || false,
          unreadByUser: data.unreadByUser || false,
        });
      });
      setThreads(items);
      setLoading(false);
    }, (error) => {
      console.error("Error reading chat threads:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // 2. Listen to messages when a thread is selected
  useEffect(() => {
    if (!selectedThread) {
      setMessages([]);
      return;
    }

    // Mark thread as read by admin
    const threadDocRef = doc(db, 'chats', selectedThread.uid);
    updateDoc(threadDocRef, { unreadByAdmin: false }).catch(() => {});

    // Listen to messages subcollection
    const msgQuery = query(
      collection(db, 'chats', selectedThread.uid, 'messages'),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(msgQuery, (snapshot) => {
      const msgs: Message[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        msgs.push({
          id: docSnap.id,
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
      console.error("Error loading chat messages:", error);
    });

    return () => unsubscribe();
  }, [selectedThread]);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedThread) return;

    const messageText = replyText.trim();
    setReplyText('');

    try {
      const threadUid = selectedThread.uid;

      // 1. Add reply message to subcollection
      await addDoc(collection(db, 'chats', threadUid, 'messages'), {
        senderId: 'admin',
        senderName: 'Raaga Bhairavi Team',
        text: messageText,
        timestamp: serverTimestamp(),
        isAdmin: true,
      });

      // 2. Update parent metadata doc
      const threadRef = doc(db, 'chats', threadUid);
      await updateDoc(threadRef, {
        lastMessage: messageText,
        lastMessageTimestamp: serverTimestamp(),
        unreadByAdmin: false,
        unreadByUser: true, // Pulse user's chat bubble
      });

      scrollToBottom();
    } catch (error) {
      console.error('Error sending reply:', error);
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col md:flex-row gap-6 font-sans">
      {/* Thread list - Left Pane (Width 1/3) */}
      <div className="w-full md:w-80 glass-panel rounded-2xl flex flex-col overflow-hidden border border-primary/5 shadow-sm">
        <div className="p-4 border-b border-primary/5 bg-white/50 flex items-center justify-between">
          <h2 className="font-serif font-bold text-lg text-foreground">Active Chats</h2>
          <span className="text-[10px] bg-primary/10 text-primary font-bold px-2 py-0.5 rounded-full">
            {threads.filter(t => t.unreadByAdmin).length} New
          </span>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {loading ? (
            <div className="text-center py-10 text-xs text-text-secondary">Loading chat threads...</div>
          ) : threads.length === 0 ? (
            <div className="text-center py-10 text-xs text-text-secondary px-4">
              No conversations initiated. Users who click the chat icon will appear here.
            </div>
          ) : (
            threads.map((thread) => {
              const isSelected = selectedThread?.uid === thread.uid;
              return (
                <button
                  key={thread.uid}
                  onClick={() => setSelectedThread(thread)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer text-left focus:outline-none ${
                    isSelected
                      ? 'bg-primary/5 text-primary border border-primary/15'
                      : 'hover:bg-primary/5 text-text-secondary border border-transparent'
                  }`}
                >
                  {/* Profile Image */}
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/5 flex-shrink-0 flex items-center justify-center border border-primary/10">
                    {thread.userPhotoUrl ? (
                      <img src={thread.userPhotoUrl} alt={thread.userName} className="w-full h-full object-cover" />
                    ) : (
                      <User className="w-5 h-5 text-primary" />
                    )}
                  </div>

                  {/* Thread details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground truncate block">{thread.userName}</span>
                      {thread.unreadByAdmin && (
                        <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse flex-shrink-0" />
                      )}
                    </div>
                    <span className="text-[10px] text-text-light truncate block mt-0.5">{thread.lastMessage}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Message history - Right Pane (Width 2/3) */}
      <div className="flex-1 glass-panel rounded-2xl flex flex-col overflow-hidden border border-primary/5 shadow-sm">
        {selectedThread ? (
          <>
            {/* Active Thread Header */}
            <div className="p-4 border-b border-primary/5 bg-white/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-primary/5 flex items-center justify-center border border-primary/10">
                  {selectedThread.userPhotoUrl ? (
                    <img src={selectedThread.userPhotoUrl} alt={selectedThread.userName} className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-5 h-5 text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-foreground">{selectedThread.userName}</h3>
                  <span className="text-[10px] text-text-light block">{selectedThread.userEmail}</span>
                </div>
              </div>
            </div>

            {/* Message Thread Scroll Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white/30">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.isAdmin ? 'items-end' : 'items-start'
                  }`}
                >
                  <span className="text-[9px] text-text-light mb-1 px-1">
                    {msg.isAdmin ? 'Raaga Bhairavi Team (You)' : selectedThread.userName}
                  </span>
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-xs shadow-sm ${
                      msg.isAdmin
                        ? 'bg-primary text-white rounded-tr-none'
                        : 'bg-white text-text-secondary rounded-tl-none border border-primary/5'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Input Form */}
            <form onSubmit={handleSendReply} className="p-4 bg-white border-t border-primary/5 flex items-center gap-2">
              <input
                type="text"
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Reply to ${selectedThread.userName}...`}
                className="flex-1 bg-white border border-primary/10 rounded-xl px-4 py-3 text-xs focus:outline-none focus:border-primary text-foreground"
              />
              <button
                type="submit"
                disabled={!replyText.trim()}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                  replyText.trim()
                    ? 'bg-primary hover:bg-primary-hover text-white cursor-pointer'
                    : 'bg-primary/20 text-white/50 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          /* Welcome default view */
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <MessageSquare className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-foreground">Select a Conversation</h3>
              <p className="text-xs text-text-secondary mt-1.5 max-w-sm">
                Click on any of the active chat threads on the left pane to view message transcripts and reply in real-time.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
