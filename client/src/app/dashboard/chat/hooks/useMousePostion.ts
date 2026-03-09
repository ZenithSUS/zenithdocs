import { useState, useEffect } from "react";

interface MousePos {
  x: number;
  y: number;
}

const useMousePosition = (): MousePos => {
  const [mousePos, setMousePos] = useState<MousePos>({ x: 0, y: 0 });

  useEffect(() => {
    const handler = (e: MouseEvent) =>
      setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return mousePos;
};

export default useMousePosition;
