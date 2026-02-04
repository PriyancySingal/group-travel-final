export default function HowItWorks() {
  const steps = [
    "Create Event",
    "Import Guests",
    "AI allocates rooms & activities",
    "Live coordination",
    "Reports & insights"
  ];

  return (
    <section className="py-24 px-6 text-center">
      <h2 className="text-4xl font-bold mb-14">How it works</h2>

      <div className="flex flex-col md:flex-row gap-8 justify-center max-w-6xl mx-auto">
        {steps.map((step, i) => (
          <div key={step} className="flex-1">
            <div className="text-purple-400 text-3xl font-bold mb-3">
              {i + 1}
            </div>
            <p className="text-gray-300">{step}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
