function ConfigBlock({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-baseline gap-2">
        <span className="text-sm font-medium text-text/75">{label}</span>
        {hint && <span className="text-[11px] text-text/35">{hint}</span>}
      </div>
      {children}
    </div>
  );
}

export default ConfigBlock;
