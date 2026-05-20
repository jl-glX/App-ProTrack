import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { TaxRate } from "../hooks/useBudgets";
import { Card } from "./ui/card";
import { useState, useEffect } from "react";

interface TaxSelectorProps {
  countries: string[];
  selectedCountry: string;
  taxes: TaxRate[];
  selectedTax: TaxRate | null;
  onCountryChange: (country: string) => void;
  onTaxChange: (tax: TaxRate) => void;
  loading: boolean;
}

export function TaxSelector({
  countries,
  selectedCountry,
  taxes,
  selectedTax,
  onCountryChange,
  onTaxChange,
  loading,
}: TaxSelectorProps) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Country
        </label>
        <Select
          value={selectedCountry}
          onValueChange={onCountryChange}
          disabled={loading}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country} value={country}>
                {country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {taxes.length > 0 && (
        <div className="space-y-3">
          <label className="text-sm font-medium text-gray-700 block">
            Tax Type
          </label>
          <div
            className={`grid ${isMobile ? "grid-cols-1" : "grid-cols-2"} gap-2`}
          >
            {taxes.map((tax) => (
              <Card
                key={tax.id}
                className={`p-3 cursor-pointer transition-all ${
                  selectedTax?.id === tax.id
                    ? "ring-2 ring-blue-500 bg-blue-50"
                    : "hover:bg-gray-50"
                }`}
                onClick={() => onTaxChange(tax)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900">
                      {tax.taxType}
                    </p>
                    <p className="text-xs text-gray-600">{tax.description}</p>
                  </div>
                  <p className="text-lg font-bold text-gray-900 ml-2">
                    {tax.percentage}%
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
