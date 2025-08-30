import PropTypes from "prop-types";

const Pagination = ({ totalPages, onPageChange, currentPage }) => {
  const handlePageClick = (page) => {
    onPageChange(page);
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      const nextPage = currentPage + 1;
      onPageChange(nextPage);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      onPageChange(prevPage);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-2 p-4">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className={`px-3 py-2 border  ${
          currentPage === 1
            ? "text-gray-400 border-gray-300 cursor-not-allowed"
            : "text-gray-700 border-gray-500"
        }`}
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, index) => {
        const page = index + 1;
        return (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={`px-3 py-2 border ${
              currentPage === page
                ? "bg-yellow-500 text-white font-bold"
                : "text-gray-700 border-gray-300 bg-gray-100 hover:bg-yellow-400 hover:text-white"
            }`}
          >
            {page}
          </button>
        );
      })}

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 border ${
          currentPage === totalPages
            ? "text-gray-400 border-gray-300 cursor-not-allowed"
            : "text-gray-700 border-gray-500 bg-gray-100"
        }`}
      >
        Next
      </button>
    </div>
  );
};

Pagination.propTypes = {
  totalPages : PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired,
}

export default Pagination;
