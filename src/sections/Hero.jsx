import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";

export default function Hero() {
  const navigate = useNavigate();

  return (
    <section className="min-h-screen flex items-center justify-center text-center px-6 relative overflow-hidden">

      <div className="absolute w-[600px] h-[600px] bg-purple-700 blur-[200px] opacity-30 rounded-full -top-40 -left-40" />
      <div className="absolute w-[600px] h-[600px] bg-pink-600 blur-[200px] opacity-30 rounded-full bottom-0 right-0" />

      <div className="max-w-4xl z-10">
        <h1 className="text-6xl font-bold leading-tight mb-6">
          Group Travel Made Simple
          <span className="block text-purple-400">
            MICE Events & Destination Weddings
          </span>
        </h1>

        <p className="text-gray-400 text-lg mb-10">
          Digitize group bookings with dedicated inventory, branded microsites, and real-time coordination.
          Eliminate spreadsheets and emails with TBO's Group Inventory Platform.
        </p>

        <div className="flex gap-4 justify-center">
          <Button onClick={() => navigate("/dashboard")}>
            Create Event
          </Button>

          <button className="border border-white/20 px-4 py-2 rounded-lg hover:bg-white/10">
            Book Demo
          </button>
        </div>
      </div>
    </section>
  );
}
