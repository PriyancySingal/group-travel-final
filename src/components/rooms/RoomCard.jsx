import GuestChip from "./GuestChip";

export default function RoomCard({ room, onDropGuest }) {
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        const guest = e.dataTransfer.getData("guest");
        onDropGuest(room.id, guest);
      }}
      className="bg-white/5 border border-white/10 rounded-2xl p-4 min-h-[150px]"
    >
      <div className="flex justify-between mb-3">
        <h3 className="font-semibold">Room {room.id}</h3>
        <span className="text-xs text-gray-400">
          {room.guests.length}/{room.capacity}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {room.guests.map((g) => (
          <div
            key={g}
            draggable
            onDragStart={(e) => e.dataTransfer.setData("guest", g)}
          >
            <GuestChip guest={g} />
          </div>
        ))}
      </div>
    </div>
  );
}
