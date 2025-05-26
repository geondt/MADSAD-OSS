import React from "react";

interface DropdownProps {
  label: string;
  options: (string | number)[];
  value: string | number;
  onChange: (value: string | number) => void;
}

export function Dropdown({ label, options, value, onChange }: DropdownProps) {
  return (
    <div className="flex flex-col">
      <label className="font-semibold mb-1 text-gray-800 dark:text-gray-100">{label}</label>
      <select
        className="bg-white text-black dark:bg-zinc-900 dark:text-white border border-gray-300 dark:border-gray-600 rounded px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt.toString()} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}

