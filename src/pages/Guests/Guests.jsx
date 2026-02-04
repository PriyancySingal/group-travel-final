import { useState } from "react";
import Table from "../../components/ui/Table";
import { guests as mockGuests } from "../../data/mockData";

export default function Guests() {
  const [search, setSearch] = useState("");

  const filtered = mockGuests.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">

      <h1 className="text-3xl font-bold">Guests</h1>

      <input
        placeholder="Search guest..."
        className="bg-white/10 border border-white/20 rounded-lg px-3 py-2"
        onChange={(e) => setSearch(e.target.value)}
      />

      <Table
        columns={["ID", "Name", "Room", "Meal"]}
        data={filtered}
      />
    </div>
  );
}
