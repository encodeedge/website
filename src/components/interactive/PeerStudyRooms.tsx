import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Users, Plus, MessageSquare, X, Send, Wifi, WifiOff, Copy, Check, Lock, Globe, Hash, Trash2, Settings, Crown, Circle } from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
interface Member {
  id: string;
  name: string;
  color: string;
  joinedAt: number;
  cursor?: { x: number; y: number };
}

interface ChatMessage {
  id: string;
  memberId: string;
  memberName: string;
  text: string;
  ts: number;
}

interface StudyRoom {
  id: string;
  name: string;
  topic: string;
  isPrivate: boolean;
  createdAt: number;
  maxMembers: number;
}

// ─── Utilities ───────────────────────────────────────────────────────────────
const ROOMS_KEY = 'ee_study_rooms';
const PRESENCE_KEY = 'ee_room_presence';
const MESSAGES_KEY = 'ee_room_messages';

const MEMBER_COLORS = [
  '#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6',
  '#06b6d4', '#f97316', '#ec4899', '#84cc16', '#14b8a6',
];

function generateRoomCode(): string {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function getMyId(): string {
  try {
    let id = localStorage.getItem('ee_member_id');
    if (!id) { id = `user-${Math.random().toString(36).slice(2, 9)}`; localStorage.setItem('ee_member_id', id); }
    return id;
  } catch { return 'anon'; }
}

function getMyName(): string {
  try { return localStorage.getItem('ee_member_name') || 'Learner'; } catch { return 'Learner'; }
}

function getMyColor(id: string): string {
  const i = parseInt(id.slice(-2), 16) % MEMBER_COLORS.length;
  return MEMBER_COLORS[isNaN(i) ? 0 : i];
}

function getRooms(): StudyRoom[] {
  try { return JSON.parse(localStorage.getItem(ROOMS_KEY) || '[]'); } catch { return []; }
}

function saveRooms(rooms: StudyRoom[]) {
  try { localStorage.setItem(ROOMS_KEY, JSON.stringify(rooms)); } catch { /* noop */ }
}

function getPresence(roomId: string): Member[] {
  try {
    const all = JSON.parse(localStorage.getItem(PRESENCE_KEY) || '{}');
    const roomData: Record<string, Member> = all[roomId] || {};
    const now = Date.now();
    // Filter to only members active in last 30s
    return Object.values(roomData).filter(m => now - m.joinedAt < 30000);
  } catch { return []; }
}

function updatePresence(roomId: string, member: Member) {
  try {
    const all = JSON.parse(localStorage.getItem(PRESENCE_KEY) || '{}');
    if (!all[roomId]) all[roomId] = {};
    all[roomId][member.id] = { ...member, joinedAt: Date.now() };
    localStorage.setItem(PRESENCE_KEY, JSON.stringify(all));
    window.dispatchEvent(new Event('ee_presence_updated'));
  } catch { /* noop */ }
}

function removePresence(roomId: string, memberId: string) {
  try {
    const all = JSON.parse(localStorage.getItem(PRESENCE_KEY) || '{}');
    if (all[roomId]) { delete all[roomId][memberId]; }
    localStorage.setItem(PRESENCE_KEY, JSON.stringify(all));
  } catch { /* noop */ }
}

function getMessages(roomId: string): ChatMessage[] {
  try { return JSON.parse(localStorage.getItem(`${MESSAGES_KEY}_${roomId}`) || '[]'); } catch { return []; }
}

function addMessage(roomId: string, msg: ChatMessage) {
  try {
    const msgs = getMessages(roomId).slice(-99); // keep last 100
    msgs.push(msg);
    localStorage.setItem(`${MESSAGES_KEY}_${roomId}`, JSON.stringify(msgs));
    window.dispatchEvent(new Event('ee_room_message'));
  } catch { /* noop */ }
}

// ─── Avatar ───────────────────────────────────────────────────────────────────
const Avatar = ({ name, color, size = 'md', showCrown = false }: { name: string; color: string; size?: 'sm' | 'md'; showCrown?: boolean }) => {
  const s = size === 'sm' ? 'w-6 h-6 text-[9px]' : 'w-8 h-8 text-xs';
  return (
    <div className={`relative ${s} rounded-full flex items-center justify-center font-bold text-white shrink-0`} style={{ background: color }}>
      {name.slice(0, 2).toUpperCase()}
      {showCrown && <Crown className="absolute -top-2 -right-1 w-3 h-3 text-amber-400" />}
    </div>
  );
};

// ─── Room Chat ────────────────────────────────────────────────────────────────
const RoomChat = ({ room, onLeave }: { room: StudyRoom; onLeave: () => void }) => {
  const myId = getMyId();
  const myName = getMyName();
  const myColor = getMyColor(myId);
  const [messages, setMessages] = useState<ChatMessage[]>(() => getMessages(room.id));
  const [members, setMembers] = useState<Member[]>([]);
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pingRef = useRef<NodeJS.Timeout | null>(null);

  // Announce presence every 10s
  useEffect(() => {
    const ping = () => updatePresence(room.id, { id: myId, name: myName, color: myColor, joinedAt: Date.now() });
    ping();
    pingRef.current = setInterval(ping, 10000);

    const syncMembers = () => setMembers(getPresence(room.id));
    const syncMessages = () => setMessages(getMessages(room.id));
    syncMembers();

    window.addEventListener('ee_presence_updated', syncMembers);
    window.addEventListener('ee_room_message', syncMessages);
    window.addEventListener('storage', (e) => {
      if (e.key === `${MESSAGES_KEY}_${room.id}`) syncMessages();
      if (e.key === PRESENCE_KEY) syncMembers();
    });

    // Poll for updates (simulates real-time for same-origin tabs)
    const pollInterval = setInterval(() => { syncMembers(); syncMessages(); }, 5000);

    return () => {
      if (pingRef.current) clearInterval(pingRef.current);
      clearInterval(pollInterval);
      removePresence(room.id, myId);
      window.removeEventListener('ee_presence_updated', syncMembers);
      window.removeEventListener('ee_room_message', syncMessages);
    };
  }, [room.id, myId, myName, myColor]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const msg: ChatMessage = {
      id: Math.random().toString(36).slice(2),
      memberId: myId,
      memberName: myName,
      text,
      ts: Date.now(),
    };
    addMessage(room.id, msg);
    setMessages(getMessages(room.id));
    setInput('');
  };

  const copyCode = async () => {
    try { await navigator.clipboard.writeText(room.id); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* noop */ }
  };

  const formatTime = (ts: number) => new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flex flex-col h-full">
      {/* Room Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-gradient-to-r from-primary/5 to-blue-500/5 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <Hash className="w-4 h-4 text-primary shrink-0" />
          <div className="min-w-0">
            <div className="font-bold text-sm text-foreground truncate">{room.name}</div>
            <div className="text-[10px] text-muted-foreground">{room.topic}</div>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={copyCode}
            className="flex items-center gap-1.5 text-[10px] font-mono font-bold px-2 py-1 rounded-lg bg-muted border border-border hover:bg-muted/80 transition-colors text-muted-foreground"
            title="Copy room code"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
            {room.id}
          </button>
          <button onClick={onLeave} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 min-h-0">
        {/* Messages */}
        <div className="flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-20" />
                <p className="text-sm font-semibold">No messages yet</p>
                <p className="text-xs">Be the first to say hi! 👋</p>
              </div>
            ) : (
              messages.map((msg, i) => {
                const isMe = msg.memberId === myId;
                const prevSame = i > 0 && messages[i - 1].memberId === msg.memberId;
                return (
                  <div key={msg.id} className={`flex gap-2 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    {!isMe && !prevSame && (
                      <Avatar name={msg.memberName} color={getMyColor(msg.memberId)} size="sm" />
                    )}
                    {!isMe && prevSame && <div className="w-6" />}
                    <div className={`max-w-[80%] ${!prevSame ? '' : isMe ? '' : 'ml-0'}`}>
                      {!prevSame && !isMe && (
                        <div className="text-[10px] font-bold mb-0.5" style={{ color: getMyColor(msg.memberId) }}>
                          {msg.memberName}
                        </div>
                      )}
                      <div className={`text-xs px-3 py-2 rounded-2xl leading-relaxed ${
                        isMe
                          ? 'bg-primary text-primary-foreground rounded-tr-sm'
                          : 'bg-muted text-foreground rounded-tl-sm'
                      } ${prevSame && isMe ? 'rounded-tr-2xl' : ''} ${prevSame && !isMe ? 'rounded-tl-2xl' : ''}`}>
                        {msg.text}
                      </div>
                      {i === messages.length - 1 && (
                        <div className="text-[9px] text-muted-foreground mt-0.5 text-right">{formatTime(msg.ts)}</div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-border shrink-0">
            <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 text-xs px-3 py-2.5 bg-muted border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                className="p-2.5 rounded-xl bg-primary hover:opacity-90 text-primary-foreground transition-opacity disabled:opacity-50 shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Members Sidebar */}
        <div className="w-32 border-l border-border shrink-0 p-2 space-y-1 overflow-y-auto">
          <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground px-1 mb-2">
            Online ({members.length})
          </div>
          {members.map((m, i) => (
            <div key={m.id} className="flex items-center gap-1.5">
              <div className="relative">
                <Avatar name={m.name} color={m.color} size="sm" showCrown={i === 0} />
                <div className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-background" />
              </div>
              <span className="text-[10px] text-foreground truncate flex-1">{m.name}</span>
            </div>
          ))}
          {members.length === 0 && (
            <div className="text-[9px] text-muted-foreground px-1 mt-1">Just you for now</div>
          )}
        </div>
      </div>
    </div>
  );
};

// ─── Create Room Form ─────────────────────────────────────────────────────────
const CreateRoomForm = ({ onCreated }: { onCreated: (room: StudyRoom) => void }) => {
  const [name, setName] = useState('');
  const [topic, setTopic] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleCreate = () => {
    if (!name.trim()) return;
    const room: StudyRoom = {
      id: generateRoomCode(),
      name: name.trim(),
      topic: topic.trim() || 'General discussion',
      isPrivate,
      createdAt: Date.now(),
      maxMembers: 20,
    };
    const rooms = getRooms();
    rooms.unshift(room);
    saveRooms(rooms.slice(0, 20)); // max 20 rooms
    onCreated(room);
  };

  return (
    <div className="space-y-4 p-4">
      <div>
        <label className="text-sm font-semibold text-foreground block mb-1.5">Room Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="e.g. Deep Learning Study Group"
          className="w-full px-3 py-2.5 border border-border rounded-xl bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>
      <div>
        <label className="text-sm font-semibold text-foreground block mb-1.5">Topic / Description</label>
        <input
          type="text"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder="e.g. Backpropagation chapter"
          className="w-full px-3 py-2.5 border border-border rounded-xl bg-background text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>
      <label className="flex items-center gap-3 cursor-pointer">
        <div
          onClick={() => setIsPrivate(p => !p)}
          className={`w-10 h-5 rounded-full transition-colors ${isPrivate ? 'bg-primary' : 'bg-muted border border-border'} flex items-center`}
        >
          <div className={`w-4 h-4 rounded-full bg-white shadow transition-transform ${isPrivate ? 'translate-x-5' : 'translate-x-0.5'}`} />
        </div>
        <div>
          <div className="text-sm font-semibold text-foreground flex items-center gap-1.5">
            {isPrivate ? <Lock className="w-3.5 h-3.5 text-amber-500" /> : <Globe className="w-3.5 h-3.5 text-emerald-500" />}
            {isPrivate ? 'Private Room' : 'Public Room'}
          </div>
          <div className="text-xs text-muted-foreground">{isPrivate ? 'Share code to invite others' : 'Anyone can find and join'}</div>
        </div>
      </label>
      <button
        onClick={handleCreate}
        disabled={!name.trim()}
        className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-sm disabled:opacity-50 hover:opacity-90 transition-opacity"
      >
        Create Room
      </button>
    </div>
  );
};

// ─── Join By Code ─────────────────────────────────────────────────────────────
const JoinByCode = ({ onJoined }: { onJoined: (room: StudyRoom) => void }) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const handleJoin = () => {
    const rooms = getRooms();
    const room = rooms.find(r => r.id === code.toUpperCase().trim());
    if (!room) { setError('Room not found. Check the code and try again.'); return; }
    setError('');
    onJoined(room);
  };

  return (
    <div className="space-y-3 p-4 border-t border-border">
      <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Join by Room Code</div>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={e => { setCode(e.target.value.toUpperCase()); setError(''); }}
          placeholder="ABC123"
          maxLength={6}
          className="flex-1 px-3 py-2 border border-border rounded-xl bg-background text-sm font-mono text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 uppercase"
        />
        <button
          onClick={handleJoin}
          disabled={code.length < 4}
          className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold disabled:opacity-50 hover:opacity-90 transition-opacity shrink-0"
        >
          Join
        </button>
      </div>
      {error && <p className="text-xs text-rose-500">{error}</p>}
    </div>
  );
};

// ─── Main Study Rooms Component ───────────────────────────────────────────────
interface PeerStudyRoomsProps {
  defaultName?: string;
}

export const PeerStudyRooms = ({ defaultName }: PeerStudyRoomsProps) => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'list' | 'create' | 'room'>('list');
  const [activeRoom, setActiveRoom] = useState<StudyRoom | null>(null);
  const [rooms, setRooms] = useState<StudyRoom[]>([]);
  const [myName, setMyName] = useState('');
  const [nameSet, setNameSet] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const n = getMyName();
    setMyName(n === 'Learner' ? (defaultName || '') : n);
    if (n !== 'Learner') setNameSet(true);
    setRooms(getRooms());
  }, [defaultName]);

  const saveName = () => {
    if (!myName.trim()) return;
    try { localStorage.setItem('ee_member_name', myName.trim()); } catch { /* noop */ }
    setNameSet(true);
  };

  const joinRoom = (room: StudyRoom) => {
    setActiveRoom(room);
    setView('room');
  };

  const leaveRoom = () => {
    setActiveRoom(null);
    setView('list');
    setRooms(getRooms());
  };

  if (!mounted) return null;

  return (
    <>
      {/* Floating trigger — sits directly above Achievements button (bottom-6 + ~44px height + 8px gap = ~72px) */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-[88px] left-6 z-[9985] flex items-center gap-2 px-3.5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-sm font-semibold shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
        aria-label="Open Study Rooms"
      >
        <Users className="w-4 h-4" />
        <span>Study Rooms</span>
      </button>

      {/* Panel — inlined directly (NOT a nested component) to prevent remount flicker on every keystroke */}
      {open && createPortal(
        <div
          className="fixed inset-0 z-[10060] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-end sm:justify-end p-0 sm:p-6"
          onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div
            className="w-full sm:w-96 bg-background border border-border rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 sm:slide-in-from-right-4 duration-300"
            style={{ height: 'min(600px, 90vh)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-border shrink-0">
              <div className="flex items-center gap-2.5">
                <Users className="w-4 h-4 text-blue-500" />
                <span className="font-bold text-foreground text-sm">Peer Study Rooms</span>
              </div>
              <button onClick={() => setOpen(false)} className="p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Name Setup */}
            {!nameSet ? (
              <div className="p-5 space-y-4">
                <div>
                  <p className="text-sm font-bold text-foreground">What should we call you?</p>
                  <p className="text-xs text-muted-foreground mt-1">Your name appears to others in the room.</p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={myName}
                    onChange={e => setMyName(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && saveName()}
                    placeholder="Your display name"
                    autoFocus
                    className="flex-1 px-3 py-2.5 border border-border rounded-xl bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  <button onClick={saveName} disabled={!myName.trim()} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-bold disabled:opacity-50">
                    Set
                  </button>
                </div>
              </div>
            ) : view === 'room' && activeRoom ? (
              <div className="flex-1 min-h-0">
                <RoomChat room={activeRoom} onLeave={leaveRoom} />
              </div>
            ) : view === 'create' ? (
              <div className="flex-1 overflow-y-auto">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                  <button onClick={() => setView('list')} className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">← Back</button>
                  <span className="text-sm font-bold text-foreground">Create a Room</span>
                </div>
                <CreateRoomForm onCreated={(room) => { setRooms(getRooms()); joinRoom(room); }} />
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto flex flex-col">
                {/* Create Button */}
                <div className="p-4 shrink-0">
                  <button
                    onClick={() => setView('create')}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border-2 border-dashed border-primary/30 hover:border-primary/60 hover:bg-primary/5 text-primary font-semibold text-sm transition-all"
                  >
                    <Plus className="w-4 h-4" /> Create New Room
                  </button>
                </div>

                {/* Room List */}
                <div className="flex-1 px-4 space-y-2">
                  {rooms.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Users className="w-8 h-8 mx-auto mb-2 opacity-20" />
                      <p className="text-sm font-semibold">No rooms yet</p>
                      <p className="text-xs">Create one to start studying with peers!</p>
                    </div>
                  ) : (
                    rooms.map(room => {
                      const memberCount = getPresence(room.id).length;
                      return (
                        <button
                          key={room.id}
                          onClick={() => joinRoom(room)}
                          className="w-full text-left p-3.5 rounded-xl border border-border hover:border-primary/40 hover:bg-muted/50 transition-all group"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                {room.isPrivate ? <Lock className="w-3 h-3 text-amber-500 shrink-0" /> : <Globe className="w-3 h-3 text-emerald-500 shrink-0" />}
                                <span className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">{room.name}</span>
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5 truncate">{room.topic}</div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0">
                              {memberCount > 0 && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                              <span className="text-xs text-muted-foreground">{memberCount > 0 ? `${memberCount} online` : 'Empty'}</span>
                            </div>
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>

                {/* Join by Code */}
                <JoinByCode onJoined={joinRoom} />
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default PeerStudyRooms;
