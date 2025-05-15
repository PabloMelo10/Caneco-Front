import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

interface CurrencyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: number;
  onChange: (value: number) => void;
}

export function CurrencyInput({ value, onChange, ...props }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = useState("");

  // Format the numeric value to a localized string (without currency symbol)
  useEffect(() => {
    const formatted = value.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    setDisplayValue(formatted);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let inputValue = e.target.value;

    // Remove all non-numeric characters except decimal separator
    inputValue = inputValue.replace(/[^\d,]/g, "");

    // Ensure only one decimal separator
    const decimalParts = inputValue.split(",");
    if (decimalParts.length > 2) {
      inputValue = decimalParts[0] + "," + decimalParts.slice(1).join("");
    }

    // Update the display value
    setDisplayValue(inputValue);

    // Convert to a number and report to parent
    const numericValue = parseFloat(inputValue.replace(",", ".")) || 0;
    onChange(numericValue);
  };

  return (
    <div className="relative flex items-center">
      <span className="absolute left-3 text-gray-500">R$</span>
      <Input
        type="text"
        value={displayValue}
        onChange={handleChange}
        className="pl-10"
        {...props}
      />
    </div>
  );
}
