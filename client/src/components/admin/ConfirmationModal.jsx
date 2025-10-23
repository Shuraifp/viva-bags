

const ConfirmationModal = ({ isOpen, onClose, onConfirm, message, buttonText }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-white rounded-sm shadow-lg p-6 w-96">
        {/* Trash Icon */}
        <div className="flex justify-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22"
            />
          </svg>
        </div>
        {/* Title */}
        <h2 className="text-center text-lg font-semibold text-gray-800 mb-2">
          Are You Sure?
        </h2>
        <p className="text-center text-gray-500 mb-6">
          {message}
        </p>
        {/* Buttons */}
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-700 text-white rounded-sm hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-yellow-600 text-white rounded-sm hover:bg-yellow-700"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
