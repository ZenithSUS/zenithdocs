function LineBackground() {
  return (
    <div
      className="fixed inset-0"
      style={{
        backgroundImage: `linear-gradient(rgba(201,162,39,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,162,39,0.04) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
        maskImage:
          "radial-gradient(ellipse 80% 70% at 50% 50%, black 40%, transparent 100%)",
      }}
    />
  );
}

export default LineBackground;
