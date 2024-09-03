import { IconType } from "react-icons";

interface ActionButtonProps {
  icon: IconType;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  icon: Icon,
  onClick,
  disabled,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        flex
        items-center
        justify-center
        rounded-full
        cursor-pointer
        w-[40px]
        h-[40px]
        text-white
        bg-gradient-to-r
        from-blue-500
        to-indigo-500
        hover:from-blue-600
        hover:to-indigo-600
        active:from-blue-700
        active:to-indigo-700
        shadow-md
        hover:shadow-lg
        transition
        duration-200
        ease-in-out
        ${disabled && "opacity-50 cursor-not-allowed bg-gray-400"}
      `}
    >
      <Icon size={20} />
    </button>
  );
};
export default ActionButton;
