import { IoSearch } from "react-icons/io5";
import { InputHTMLAttributes } from "react";

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputProps?: Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'placeholder' | 'className'>;
};

export function SearchInput({ value, onChange, placeholder = 'Search...', className, inputProps }: Props) {
  return (
    <div className={`flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur px-3 py-2 shadow-lg w-[min(80vw,20rem)] transition-colors ${className ?? ''}`}>
      <IoSearch className="text-lg shrink-0 opacity-80" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-transparent focus:outline-none text-base w-full placeholder:text-gray-300 text-white"
        {...inputProps}
      />
    </div>
  );
}

export default SearchInput;
