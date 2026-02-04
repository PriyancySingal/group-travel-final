import { useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";

export default function CTA() {
  const navigate = useNavigate();

  return (
    <section className="py-32 text-center bg-purple-900/20 border-t border-white/10">
      <h2 className="text-4xl font-bold mb-6">
        Ready to run smarter events?
      </h2>

      <Button onClick={() => navigate("/dashboard")}>
        Get Started
      </Button>
    </section>
  );
}
