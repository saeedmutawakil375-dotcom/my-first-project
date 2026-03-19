import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";
import usePageMeta from "../hooks/usePageMeta";

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", bio: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  usePageMeta({
    title: "Create Account",
    description:
      "Join Atlas Wire and start publishing global reports across world, finance, sports, entertainment, health, and science."
  });

  const handleChange = (event) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(formData);
      navigate("/newsroom");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-8 xl:grid-cols-[0.85fr_1.15fr] xl:items-stretch">
      <section className="animate-fade-up overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.08)]">
        <div className="h-full bg-[radial-gradient(circle_at_top,_rgba(184,0,24,0.12),_transparent_40%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] p-8 sm:p-10">
          <p className="text-[0.72rem] font-bold uppercase tracking-[0.4em] text-[#b80018]">
            Join the Publication
          </p>
          <h2 className="mt-5 font-display text-4xl leading-tight text-slate-950 sm:text-5xl">
            Build your contributor profile and publish across every major sector.
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
            Register once, then report on world affairs, markets, entertainment, sport,
            science, health, and the big trends shaping the global agenda.
          </p>
        </div>
      </section>

      <div className="space-y-6">
        <AuthForm
          title="Create Account"
          subtitle="Get newsroom access and start publishing polished reports for a global audience."
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          isRegister
          loading={loading}
          error={error}
        />
        <p className="text-center text-sm uppercase tracking-[0.18em] text-slate-500">
          Already have an account?{" "}
          <Link to="/login" className="font-bold text-[#b80018]">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
