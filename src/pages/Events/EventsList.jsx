import { useState } from "react";
import Table from "../../components/ui/Table";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import { events as mockEvents } from "../../data/mockData";

export default function EventsList() {
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState(mockEvents);

  const addEvent = () => {
    setEvents([
      ...events,
      {
        id: events.length + 1,
        name: "New Event",
        guests: 0,
        status: "Planning"
      }
    ]);
    setOpen(false);
  };

  return (
    <div className="space-y-6">

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Events</h1>
        <Button onClick={() => setOpen(true)}>+ Create Event</Button>
      </div>

      <Table
        columns={["ID", "Name", "Guests", "Status"]}
        data={events}
      />

      <Modal open={open} onClose={() => setOpen(false)}>
        <h3 className="text-lg font-semibold">Create Event</h3>
        <Button onClick={addEvent}>Add Dummy Event</Button>
      </Modal>
    </div>
  );
}
