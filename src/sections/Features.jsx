import Card from "../components/ui/Card";

export default function Features() {
  const features = [
    "Group-Specific Inventory",
    "Branded Event Microsites",
    "Real-Time Availability",
    "Centralized Bookings",
    "Protected Room Allotments",
    "Negotiated Rate Management"
  ];

  return (
    <section className="py-24 px-6">
      <h2 className="text-4xl font-bold text-center mb-16">
        Digital Platform for Group Travel
      </h2>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((f) => (
          <Card key={f}>
            <h3 className="text-lg font-semibold">{f}</h3>
          </Card>
        ))}
      </div>
    </section>
  );
}
