import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Label } from './ui/label';
import { useTranslation } from 'react-i18next';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  country: string;
  flag: string;
}

export const CURRENCIES: Currency[] = [
  // Spanish-speaking countries
  { code: 'EUR', symbol: '€', name: 'Euro', country: 'EU', flag: '🇪🇺' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso', country: 'MX', flag: '🇲🇽' },
  { code: 'ARS', symbol: '$', name: 'Argentine Peso', country: 'AR', flag: '🇦🇷' },
  { code: 'COP', symbol: '$', name: 'Colombian Peso', country: 'CO', flag: '🇨🇴' },
  { code: 'CLP', symbol: '$', name: 'Chilean Peso', country: 'CL', flag: '🇨🇱' },
  { code: 'PEN', symbol: 'S/', name: 'Peruvian Sol', country: 'PE', flag: '🇵🇪' },
  { code: 'VES', symbol: 'Bs', name: 'Venezuelan Bolivar', country: 'VE', flag: '🇻🇪' },
  { code: 'UYU', symbol: '$', name: 'Uruguayan Peso', country: 'UY', flag: '🇺🇾' },
  { code: 'BOB', symbol: 'Bs', name: 'Bolivian Boliviano', country: 'BO', flag: '🇧🇴' },
  { code: 'PYG', symbol: '₲', name: 'Paraguayan Guarani', country: 'PY', flag: '🇵🇾' },
  { code: 'CRC', symbol: '₡', name: 'Costa Rican Colon', country: 'CR', flag: '🇨🇷' },
  { code: 'GTQ', symbol: 'Q', name: 'Guatemalan Quetzal', country: 'GT', flag: '🇬🇹' },
  { code: 'HNL', symbol: 'L', name: 'Honduran Lempira', country: 'HN', flag: '🇭🇳' },
  { code: 'NIO', symbol: 'C$', name: 'Nicaraguan Cordoba', country: 'NI', flag: '🇳🇮' },
  { code: 'PAB', symbol: 'B/.', name: 'Panamanian Balboa', country: 'PA', flag: '🇵🇦' },
  { code: 'DOP', symbol: 'RD$', name: 'Dominican Peso', country: 'DO', flag: '🇩🇴' },
  { code: 'CUP', symbol: '$', name: 'Cuban Peso', country: 'CU', flag: '🇨🇺' },
  
  // English-speaking countries
  { code: 'USD', symbol: '$', name: 'US Dollar', country: 'US', flag: '🇺🇸' },
  { code: 'GBP', symbol: '£', name: 'British Pound', country: 'GB', flag: '🇬🇧' },
  { code: 'CAD', symbol: '$', name: 'Canadian Dollar', country: 'CA', flag: '🇨🇦' },
  { code: 'AUD', symbol: '$', name: 'Australian Dollar', country: 'AU', flag: '🇦🇺' },
  { code: 'NZD', symbol: '$', name: 'New Zealand Dollar', country: 'NZ', flag: '🇳🇿' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', country: 'ZA', flag: '🇿🇦' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', country: 'IN', flag: '🇮🇳' },
  { code: 'SGD', symbol: '$', name: 'Singapore Dollar', country: 'SG', flag: '🇸🇬' },
  { code: 'HKD', symbol: '$', name: 'Hong Kong Dollar', country: 'HK', flag: '🇭🇰' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso', country: 'PH', flag: '🇵🇭' },
  { code: 'PKR', symbol: '₨', name: 'Pakistani Rupee', country: 'PK', flag: '🇵🇰' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira', country: 'NG', flag: '🇳🇬' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling', country: 'KE', flag: '🇰🇪' },
  { code: 'JMD', symbol: '$', name: 'Jamaican Dollar', country: 'JM', flag: '🇯🇲' },
  
  // French-speaking countries
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', country: 'CH', flag: '🇨🇭' },
  { code: 'XOF', symbol: 'CFA', name: 'West African CFA franc', country: 'SN', flag: '🇸🇳' },
  { code: 'XAF', symbol: 'FCFA', name: 'Central African CFA franc', country: 'CM', flag: '🇨🇲' },
  { code: 'MAD', symbol: 'DH', name: 'Moroccan Dirham', country: 'MA', flag: '🇲🇦' },
  { code: 'TND', symbol: 'DT', name: 'Tunisian Dinar', country: 'TN', flag: '🇹🇳' },
  { code: 'DZD', symbol: 'DA', name: 'Algerian Dinar', country: 'DZ', flag: '🇩🇿' },
  { code: 'HTG', symbol: 'G', name: 'Haitian Gourde', country: 'HT', flag: '🇭🇹' },
  
  // German-speaking countries (and European)
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone', country: 'DK', flag: '🇩🇰' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', country: 'SE', flag: '🇸🇪' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', country: 'NO', flag: '🇳🇴' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Zloty', country: 'PL', flag: '🇵🇱' },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna', country: 'CZ', flag: '🇨🇿' },
  { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint', country: 'HU', flag: '🇭🇺' },
  { code: 'RON', symbol: 'lei', name: 'Romanian Leu', country: 'RO', flag: '🇷🇴' },
  { code: 'BGN', symbol: 'лв', name: 'Bulgarian Lev', country: 'BG', flag: '🇧🇬' },
  { code: 'HRK', symbol: 'kn', name: 'Croatian Kuna', country: 'HR', flag: '🇭🇷' },
  
  // Additional major currencies
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', country: 'JP', flag: '🇯🇵' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', country: 'CN', flag: '🇨🇳' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won', country: 'KR', flag: '🇰🇷' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble', country: 'RU', flag: '🇷🇺' },
  { code: 'TUR', symbol: '₺', name: 'Turkish Lira', country: 'TR', flag: '🇹🇷' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', country: 'BR', flag: '🇧🇷' },
];

interface CurrencySelectorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function CurrencySelector({ value, onChange, label }: CurrencySelectorProps) {
  const { t } = useTranslation();
  const selectedCurrency = CURRENCIES.find(c => c.code === value);

  return (
    <div className="space-y-2">
      {label && <Label>{label || t('forms.currency')}</Label>}
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue>
            {selectedCurrency ? (
              <span className="flex items-center gap-2">
                <span className="text-lg">{selectedCurrency.flag}</span>
                <span>{selectedCurrency.code}</span>
                <span className="text-gray-500">({selectedCurrency.symbol})</span>
              </span>
            ) : (
              t('forms.selectCurrency')
            )}
          </SelectValue>
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {CURRENCIES.map((currency) => (
            <SelectItem key={currency.code} value={currency.code}>
              <div className="flex items-center gap-2">
                <span className="text-lg">{currency.flag}</span>
                <span className="font-medium">{currency.code}</span>
                <span className="text-gray-500">({currency.symbol})</span>
                <span className="text-sm text-gray-400">{currency.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function getCurrencySymbol(code: string): string {
  const currency = CURRENCIES.find(c => c.code === code);
  return currency?.symbol || code;
}

export function formatCurrency(amount: number, currencyCode: string): string {
  const currency = CURRENCIES.find(c => c.code === currencyCode);
  const symbol = currency?.symbol || currencyCode;
  return `${symbol}${amount.toFixed(2)}`;
}
