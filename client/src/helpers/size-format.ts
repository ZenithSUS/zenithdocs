const sizefmt = {
  bytes: (b: number) =>
    b >= 1e6 ? `${(b / 1e6).toFixed(1)} MB` : `${Math.round(b / 1000)} KB`,
  date: (s: string) =>
    new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
  month: (s: string) => {
    const [y, m] = s.split("-");
    return new Date(+y, +m - 1).toLocaleString("en-US", { month: "short" });
  },
  num: (n: number) => n.toLocaleString(),
};

export default sizefmt;
