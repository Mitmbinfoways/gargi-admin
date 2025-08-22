import { Spinner } from "flowbite-react";

const Loading = ({ className = "", size = "xl" }) => {
  return (
    <div
      className={`flex items-center justify-center py-6 ${className}`}
    >
      <Spinner
        size={size}
        aria-label="Loading spinner"
      />
    </div>
  );
};

export default Loading;
