import { searchIcon } from "../assets";

export const SearchBar = ({ placeholder, ...rest }) => {
  return (
    <div className="max-w-96 w-full h-10 bg-gray-light rounded overflow-hidden px-3 flex gap-2 items-center">
      <img className="w-5 h-5" src={searchIcon} />
      <input
        className="w-full h-full outline-none bg-gray-light"
        placeholder={placeholder}
        {...rest}
      />
    </div>
  );
};
