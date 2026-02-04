export default function Button({ children, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-medium transition"
    >
      {children}
    </button>
  );
}
