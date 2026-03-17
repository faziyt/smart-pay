export function formatCurrency(cents: bigint | number): string {
  const dollars = Number(cents) / 100;
  return `$${dollars.toFixed(2)}`;
}

export function formatDate(timestamp: bigint): string {
  // Motoko timestamps are in nanoseconds
  const ms = Number(timestamp) / 1_000_000;
  const date = new Date(ms);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
