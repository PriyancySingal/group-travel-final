import { useState } from "react";

export default function BroadcastMessaging() {
  const [message, setMessage] = useState("");
  const [audience, setAudience] = useState("all");
  const [messages, setMessages] = useState([
    {
      id: 1,
      content: "Welcome to DGTE Event 2026! Check-in opens at 9 AM.",
      audience: "all",
      sent: "10 min ago",
      delivered: 324,
      read: 287
    },
    {
      id: 2,
      content: "Lunch will be served in the main hall at 1 PM.",
      audience: "checked-in",
      sent: "25 min ago",
      delivered: 287,
      read: 245
    },
    {
      id: 3,
      content: "Photography session starts at 3 PM near the garden.",
      audience: "vip",
      sent: "1 hour ago",
      delivered: 12,
      read: 10
    }
  ]);

  const sendBroadcast = () => {
    if (!message.trim()) return;

    const newMessage = {
      id: messages.length + 1,
      content: message,
      audience: audience,
      sent: "Just now",
      delivered: audience === "all" ? 324 : audience === "checked-in" ? 287 : 12,
      read: 0
    };

    setMessages([newMessage, ...messages]);
    setMessage("");
  };

  const getAudienceLabel = (audience) => {
    switch(audience) {
      case 'all': return 'All Guests';
      case 'checked-in': return 'Checked In Only';
      case 'vip': return 'VIP Guests';
      case 'staff': return 'Event Staff';
      default: return 'All Guests';
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-semibold text-white">Broadcast Messaging</h3>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-sm text-gray-400">Live</span>
        </div>
      </div>

      {/* New Message Form */}
      <div className="bg-white/5 rounded-xl p-4 mb-6">
        <div className="flex gap-3 mb-3">
          <select 
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm flex-1"
          >
            <option value="all">All Guests</option>
            <option value="checked-in">Checked In Only</option>
            <option value="vip">VIP Guests</option>
            <option value="staff">Event Staff</option>
          </select>
          
          <button 
            onClick={sendBroadcast}
            disabled={!message.trim()}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Send Broadcast
          </button>
        </div>

        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message here..."
          className="w-full bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm resize-none h-20 placeholder-gray-400"
        />
        
        <div className="flex justify-between items-center mt-2">
          <div className="text-xs text-gray-400">
            Will send to: {getAudienceLabel(audience)}
          </div>
          <div className="text-xs text-gray-400">
            {message.length}/160 characters
          </div>
        </div>
      </div>

      {/* Message History */}
      <div className="space-y-3">
        <div className="text-sm font-medium text-gray-400 mb-3">Recent Broadcasts</div>
        
        {messages.map((msg) => (
          <div key={msg.id} className="bg-white/5 rounded-lg p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <div className="text-white mb-2">{msg.content}</div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>To: {getAudienceLabel(msg.audience)}</span>
                  <span>{msg.sent}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                <span className="text-gray-300">Delivered: {msg.delivered}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                <span className="text-gray-300">Read: {msg.read}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-purple-400 rounded-full" />
                <span className="text-gray-300">
                  {msg.delivered > 0 ? Math.round((msg.read / msg.delivered) * 100) : 0}% read rate
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center">
        <div className="text-sm text-gray-400">
          Total broadcasts: {messages.length}
        </div>
        <button className="text-purple-400 hover:text-purple-300 text-sm font-medium">
          Message Templates →
        </button>
      </div>
    </div>
  );
}
