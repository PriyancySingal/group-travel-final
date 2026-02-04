export default function Card({ children }) {
  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5">
      {children}
    </div>
  );
}
