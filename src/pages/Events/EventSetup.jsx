import { useState } from "react";
import Button from "../../components/ui/Button";
import Card from "../../components/ui/Card";

export default function EventSetup() {
  const [form, setForm] = useState({
    name: "",
    type: "mice",
    location: "",
    startDate: "",
    endDate: "",
    expectedGuests: "",
    brandingColor: "#a855f7"
  });

  const update = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const generateURL = () =>
    `dgte.app/e/${form.name.toLowerCase().replaceAll(" ", "-")}`;

  return (
    <div className="space-y-8 max-w-5xl">

      <h1 className="text-3xl font-bold">Create Group Event</h1>

      {/* BASIC INFO */}
      <Card>
        <h2 className="font-semibold mb-4">Event Details</h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            placeholder="Event Name"
            className="input"
            onChange={(e) => update("name", e.target.value)}
          />

          <select
            className="input"
            onChange={(e) => update("type", e.target.value)}
          >
            <option value="mice">MICE Event</option>
            <option value="wedding">Destination Wedding</option>
            <option value="conference">Conference</option>
            <option value="incentive">Incentive Travel</option>
          </select>

          <input
            placeholder="Location"
            className="input"
            onChange={(e) => update("location", e.target.value)}
          />

          <input
            type="number"
            placeholder="Expected Guests"
            className="input"
            onChange={(e) => update("expectedGuests", e.target.value)}
          />

          <input type="color" className="input" onChange={(e) => update("brandingColor", e.target.value)} />
        </div>
      </Card>

      {/* DATES */}
      <Card>
        <h2 className="font-semibold mb-4">Event Dates</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <input type="date" className="input" placeholder="Start Date" onChange={(e) => update("startDate", e.target.value)} />
          <input type="date" className="input" placeholder="End Date" onChange={(e) => update("endDate", e.target.value)} />
        </div>
      </Card>

      {/* MICROSITE */}
      <Card>
        <h2 className="font-semibold mb-4">Branded Microsite</h2>

        <p className="text-gray-400 text-sm mb-2">Your group will get a dedicated microsite:</p>

        <div className="bg-white/10 p-3 rounded-lg text-purple-400">
          {generateURL()}
        </div>

        <p className="text-gray-400 text-xs mt-2">
          Guests can view itineraries, select packages, and complete bookings
        </p>
      </Card>

      <Button onClick={() => alert("Group event created! Next: Set up inventory and microsite.")}>
        Create Group Event
      </Button>
    </div>
  );
}
