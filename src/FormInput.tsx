import React from "react";

interface FormInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
}

const FormInput: React.FC<FormInputProps> = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  required = false,
  disabled = false,
}) => {
  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-sm font-bold text-gray-700 pb-2"
      >
        {label}
      </label>
      <input
        disabled={disabled}
        type="text"
        id={id}
        value={value}
        onChange={onChange}
        required={required}
        className="text-black block w-full px-4 py-2 bg-purple-50 rounded-xl shadow-sm focus:ring-purple-300"
        placeholder={placeholder}
      />
    </div>
  );
};

export default FormInput;
