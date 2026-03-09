import { useRef, useEffect } from "react";

const MAX_HEIGHT = 200;

const useAutoResizeTextarea = (value: string) => {
  const ref = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.style.height = "auto";
    ref.current.style.height = `${Math.min(ref.current.scrollHeight, MAX_HEIGHT)}px`;
  }, [value]);

  return ref;
};

export default useAutoResizeTextarea;
