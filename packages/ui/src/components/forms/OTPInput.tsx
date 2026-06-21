"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@hariventure/utils";

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (val: string) => void;
  className?: string;
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  className,
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Sync external value
    const valArr = value.split("").slice(0, length);
    const newOtp = Array(length).fill("");
    valArr.forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
  }, [value, length]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const val = e.target.value;
    if (isNaN(Number(val))) return;

    const newOtp = [...otp];
    // Allow only single character
    newOtp[index] = val.substring(val.length - 1);
    setOtp(newOtp);
    onChange(newOtp.join(""));

    // Move to next input
    if (val && index < length - 1 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      // Move to previous input on backspace
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className={cn("flex gap-2 justify-between", className)}>
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          onChange={(e) => handleChange(e, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className={cn(
            "w-12 h-14 text-center text-lg font-semibold rounded-md border border-slate-300 bg-white",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:border-transparent transition-all"
          )}
        />
      ))}
    </div>
  );
}
