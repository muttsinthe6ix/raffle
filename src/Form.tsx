// Form.tsx
import { FC, FormEvent, useState } from "react";
import { supabase } from "./supabaseClient";
import FormInput from "./FormInput";

interface FormProps {
  onSubmitSuccess: () => void;
}

const Form: FC<FormProps> = ({ onSubmitSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!validateEmail(email)) {
      alert("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase
        .from("raffle_entries_test")
        .insert([{ name, email }]);
      if (error) throw error;
      onSubmitSuccess(); // Call the callback function
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting the form.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-full mx-auto p-[24px] rounded-[32px] bg-opacity-90 bg-white"
    >
      <h1 className="text-black text-2xl font-bold text-center mb-6">
        Enter the raffle to win a prize!
      </h1>
      <FormInput
        id="name"
        label="Name*"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
        required
      />
      <FormInput
        id="email"
        label="Email*"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
      />
      <button
        type="submit"
        disabled={loading}
        className={`w-full text-[1.8rem] px-4 py-2 text-white font-bold bg-purple-600 rounded-full shadow-lg transition focus:ring-4 focus:ring-purple-300 ${
          loading ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-700"
        }`}
      >
        {loading ? "Submitting..." : "Submit"}
      </button>
    </form>
  );
};

export default Form;
