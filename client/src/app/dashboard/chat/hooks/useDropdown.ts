import { useState, useEffect, useRef } from "react";

const EXEMPT_SELECTORS =
  "[role='alertdialog'], [data-radix-popper-content-wrapper]";

const useDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as Element;
      if (ref.current?.contains(target)) return;
      if (target.closest?.(EXEMPT_SELECTORS)) return;
      setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  return { isOpen, setIsOpen, ref };
};

export default useDropdown;
