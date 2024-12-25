import React, { useState } from "react";
import Form from "./Form";
import "./styles/App.css"; // Import the CSS file for snowflakes

const SuccessMessage: React.FC = () => (
  <div className="text-center mt-2">
    <h2 className="text-3xl font-bold text-purple-700 mb-4">
      Thank you for participating!
    </h2>
    <p className="text-gray-700">We will contact you if you win. Good luck!</p>
  </div>
);

const App: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleFormSubmitSuccess = () => {
    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen flex justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-3 relative overflow-hidden">
      <div className="snowflakes" aria-hidden="true">
        <div className="snowflake">❅</div>
        <div className="snowflake">❆</div>
        <div className="snowflake">❅</div>
        <div className="snowflake">❆</div>
        <div className="snowflake">❅</div>
        <div className="snowflake">❆</div>
        <div className="snowflake">❅</div>
        <div className="snowflake">❆</div>
      </div>
      <div className="bg-white shadow-glossy p-6 max-w-full w-[960px] rounded-[32px] bg-opacity-50 h-fit">
        <img
          src="https://muttsinthe6ix.ca/assets/images/image01.png?v=746bd911"
          alt="Mutts In The 6ix"
          className="mx-auto max-w-[135px] mb-6"
        />
        <h1 className="font-bold text-purple-700 text-center mb-6">
          Mutts In The 6ix Raffle
        </h1>
        {isSubmitted ? (
          <SuccessMessage />
        ) : (
          <Form onSubmitSuccess={handleFormSubmitSuccess} />
        )}
      </div>
    </div>
  );
};

export default App;
