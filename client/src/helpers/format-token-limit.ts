function formatTokenLimit(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toLocaleString() + "M";
  if (n >= 1_000) return (n / 1_000).toLocaleString() + "K";
  return n.toLocaleString();
}

export default formatTokenLimit;
