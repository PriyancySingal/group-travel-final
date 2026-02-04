export default function Badge({ children }) {
  return (
    <span className="bg-purple-600/20 text-purple-300 px-2 py-1 text-xs rounded-full">
      {children}
    </span>
  );
}
