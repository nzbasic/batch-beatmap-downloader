import { useState, useEffect } from "react";

export const useStickyState = <Type>(defaultValue: Type, key: string): [Type, React.Dispatch<React.SetStateAction<Type>>] => {
  const [value, setValue] = useState<Type>(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null
      ? JSON.parse(stickyValue) as Type
      : defaultValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}
