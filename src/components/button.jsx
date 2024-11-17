export const Button = ({
  onClick,
  btnText,
  icon,
  isSecondary,
  isSecondaryWithPadding,
  styles,
  ...rest
}) => {
  return (
    <button
      className={`border-0 cursor-pointer h-10 ${
        isSecondary ? "px-0" : "px-5"
      } ${
        isSecondary || isSecondaryWithPadding ? "bg-white" : "bg-black"
      } rounded-3xl gap-3 flex items-center ${styles}`}
      onClick={onClick}
      {...rest}
    >
      {btnText && <p
        className={`text-base ${
          isSecondary || isSecondaryWithPadding ? "text-black" : "text-white"
        }`}
      >
        {btnText}
      </p>}
      {icon && <img src={icon} alt="icon" />}
    </button>
  );
};
