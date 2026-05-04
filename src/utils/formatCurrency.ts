export function formatCurrency(
  amount: number,
  locale: string = typeof navigator !== "undefined" ? navigator.language : "en-US",
  currency: string = "USD"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}
