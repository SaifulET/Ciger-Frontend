// components/ContactForm.tsx
'use client'
import React, { useState } from "react";
import api from "@/lib/axios";

interface FormData {
  email: string;
  subject: string;
  message: string;
}

interface Status {
  message?: string;
  success: boolean;
}

const ContactForm = () => {
  const [form, setForm] = useState<FormData>({ email: "", subject: "", message: "" });
  const [status, setStatus] = useState<Status | null>(null);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Clear status when user focuses on any field
  const handleFocus = () => setStatus(null);

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await api.post<{ message:string}>("/mail/createMail", form);
      setStatus({ message: "Message sent successfully!", success: true });
      setForm({ email: "", subject: "", message: "" }); // clear form
    } catch (error: unknown) {
  if (error instanceof Error) {
    setStatus({ message: "Failed to send message", success: false });
  } else {
    setStatus({ message: "Failed to send message.", success: false });
  }
}

  };

  return (
    <div className="bg-white max-w-[700px] m-auto p-[16px] md:p-[32px] rounded-lg shadow-xl">
      <h2 className="text-[28px] font-semibold text-center pb-[16px] md:pb-[32px]">Contact</h2>

      <div className="flex flex-col lg:flex-row gap-[16px] lg:gap-[32px] items-center justify-center">
        <div className="flex flex-col items-center w-full max-w-[700px]">
          <form className="w-full space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col">
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onFocus={handleFocus}
                className="p-4 mt-2 rounded-lg focus:outline-none bg-[#EDEDED] focus:ring-2 focus:ring-[#C9A040]"
                placeholder="Enter email"
                required
              />
            </div>

            <div className="flex flex-col">
              <input
                type="text"
                id="subject"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                onFocus={handleFocus}
                className="p-4 mt-2 bg-[#EDEDED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A040]"
                placeholder="Subject"
                required
              />
            </div>

            <div className="flex flex-col">
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                onFocus={handleFocus}
                className="p-4 mt-2 bg-[#EDEDED] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C9A040]"
                placeholder="Message"
                rows={6}
                required
              />
            </div>

            <div className="flex justify-start">
              <button
                type="submit"
                className="bg-[#C9A040] text-gray-900 px-6 py-3 rounded-lg hover:bg-[#685529] transition duration-300"
              >
                Send Message
              </button>
            </div>

            {status && (
              <p className={`mt-2 ${status.success ? "text-green-600" : "text-red-600"}`}>
                {status.message}
              </p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
