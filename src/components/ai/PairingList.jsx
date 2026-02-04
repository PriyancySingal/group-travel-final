const pairs = [
  "Aarav ↔ Meera (Shared interests)",
  "Rohan ↔ Kabir (Startup founders)",
  "Anika ↔ Zoya (Marketing leaders)"
];

export default function PairingList() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
      <h3 className="mb-4 font-semibold">Suggested Pairings</h3>

      <ul className="space-y-3 text-sm text-gray-300">
        {pairs.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </div>
  );
}
