import { currencies } from '@/components/CurrencySelector';

export const formatCurrency = (amount: number, currencyCode: string): string => {
  const currency = currencies.find(c => c.code === currencyCode) || currencies[0];
  return `${currency.symbol}${amount.toFixed(2)}`;
}; 