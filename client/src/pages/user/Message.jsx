import React from "react";

const MessagePage = ({ status }) => {
  const isSuccess = status === "success";

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="max-w-lg px-8 py-10 bg-white rounded-xl shadow-lg text-center">
        <div className={`text-6xl ${isSuccess ? "text-green-500" : "text-red-500"}`}>
          {isSuccess ? "🎉" : "❌"}
        </div>
        <h1
          className={`mt-6 text-2xl font-bold ${
            isSuccess ? "text-green-600" : "text-red-600"
          }`}
        >
          {isSuccess ? "Operation Successful!" : "Something Went Wrong!"}
        </h1>
        <p className="mt-4 text-gray-600">
          {isSuccess
            ? "Your transaction was completed successfully. Thank you for your trust!"
            : "We encountered an issue processing your request. Please try again."}
        </p>
        <button
          className={`mt-8 px-6 py-3 rounded-lg shadow ${
            isSuccess ? "bg-green-500 hover:bg-green-600" : "bg-red-500 hover:bg-red-600"
          } text-white`}
          onClick={() => window.location.href = "/"}
        >
          {isSuccess ? "Back to Home" : "Retry"}
        </button>
      </div>
    </div>
  );
};

export default MessagePage;
