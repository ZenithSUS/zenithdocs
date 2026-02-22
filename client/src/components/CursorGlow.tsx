"use client";

interface CursorGlowProps {
  mousePos: { x: number; y: number };
}

const CursorGlow = ({ mousePos }: CursorGlowProps) => {
  return (
    <div
      className="fixed rounded-full pointer-events-none z-0 transition-[left,top] duration-300 ease-out hidden md:block"
      style={{
        width: 600,
        height: 600,
        left: mousePos.x - 300,
        top: mousePos.y - 300,
        background:
          "radial-gradient(circle, rgba(201,162,39,0.05) 0%, transparent 70%)",
      }}
    />
  );
};

export default CursorGlow;
