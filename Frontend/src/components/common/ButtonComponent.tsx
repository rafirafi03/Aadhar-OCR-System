import type { ReactNode } from "react";

interface ActionButtonProps {
  onClick: () => void;
  children: ReactNode;
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ onClick, children, disabled = false }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 sm:py-3 px-4 rounded-lg font-medium text-sm sm:text-base tracking-wide transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed shadow-md focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-opacity-50"
    >
      {children}
    </button>
  );
};

export default ActionButton;
