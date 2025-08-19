import { AiOutlineFileSearch } from 'react-icons/ai';

const NoDataFound = ({ message = 'No data found!' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] md:min-h-[60vh] lg:min-h-[70vh] text-center px-4">
      <AiOutlineFileSearch className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 text-gray-400 mb-4" />
      <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-gray-700">
        {message}
      </h2>
    </div>
  );
};

export default NoDataFound;
