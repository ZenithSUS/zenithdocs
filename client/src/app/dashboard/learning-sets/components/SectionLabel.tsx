function SectionLabel({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-1.5 text-text/50">
      {icon}
      <span className="text-xs font-semibold uppercase tracking-widest">
        {children}
      </span>
    </div>
  );
}

export default SectionLabel;
