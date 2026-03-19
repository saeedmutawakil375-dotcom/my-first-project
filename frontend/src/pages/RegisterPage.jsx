import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { useAuth } from "../context/AuthContext";

const RegisterPage = () => {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", bio: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

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
    <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
      <section className="border border-black/10 bg-[#b80018] p-8 text-white sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">
          Join the Publication
        </p>
        <h2 className="mt-5 font-display text-4xl leading-tight">
          Create your contributor account and publish to the front page.
        </h2>
        <p className="mt-5 text-lg leading-8 text-white/85">
          Register once, then use the newsroom to post fresh reporting, feature essays, and
          discussion-starting articles with community feedback.
        </p>
      </section>

      <div className="space-y-6">
        <AuthForm
          title="Create Account"
          subtitle="Get newsroom access and start publishing long-form articles with ranked reader responses."
          formData={formData}
          onChange={handleChange}
          onSubmit={handleSubmit}
          isRegister
          loading={loading}
          error={error}
        />
        <p className="text-center text-sm uppercase tracking-[0.18em] text-black/55">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-[#b80018]">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
