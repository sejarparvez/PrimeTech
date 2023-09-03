interface FormInputProps {
  label: string;
  type: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  id: string;
  error?: string;
  maxLength: number;
}

const Input: React.FC<FormInputProps> = ({
  label,
  type,
  value,
  onChange,
  id,
  error,
  maxLength,
}) => {
  return (
    <div>
      <div className="relative">
        <input
          required
          type={type}
          value={value}
          onChange={onChange}
          maxLength={maxLength}
          id={id}
          className=" px-2.5 border pb-2.5 pt-4 flex w-full  text-sm text-gray-900 bg-transparent rounded-lg border-1 border-gray-300 appearance-none  focus:outline-none dark:text-lightgray-100  peer"
          placeholder=" "
        />
        <label
          htmlFor={id} // Connect label to input by matching id
          className="absolute text-sm text-gray-900 dark:text-lightgray-100  duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-slate-100 dark:bg-gray-800 px-2 peer-focus:px-2 peer-focus:text-black dark:peer-focus:text-lightgray-100  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-0 peer-focus:scale-75  left-1"
        >
          {label}
        </label>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
