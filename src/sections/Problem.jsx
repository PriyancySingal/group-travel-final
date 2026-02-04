export default function Problem() {
  const problems = [
    "Email coordination chaos",
    "Manual spreadsheet tracking",
    "No real-time inventory visibility",
    "Fragmented guest bookings"
  ];

  return (
    <section className="py-24 px-6 text-center">
      <h2 className="text-4xl font-bold mb-10">
        Group Travel Management is Still Offline
      </h2>

      <div className="grid md:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {problems.map((p) => (
          <div
            key={p}
            className="bg-white/5 border border-white/10 rounded-xl p-6 text-gray-300"
          >
            {p}
          </div>
        ))}
      </div>

      <p className="text-purple-400 text-xl mt-10 font-semibold">
        TBO digitizes MICE and wedding group coordination.
      </p>
    </section>
  );
}
