// Asset depreciation calculations
import { differenceInYears } from 'date-fns';

/**
 * Calculate depreciated value of an asset
 * Uses straight-line depreciation method
 */
export function calculateDepreciatedValue(
  purchasePrice: number,
  purchaseDate: Date,
  depreciationRate: number
): number {
  const yearsOld = differenceInYears(new Date(), purchaseDate);
  const depreciationAmount = (purchasePrice * depreciationRate * yearsOld) / 100;
  const currentValue = purchasePrice - depreciationAmount;
  
  return Math.max(currentValue, 0); // Cannot be negative
}

/**
 * Calculate fair sale price for rental conversion
 * Typically 60-70% of depreciated value
 */
export function calculateFairSalePrice(
  purchasePrice: number,
  purchaseDate: Date,
  depreciationRate: number,
  conversionFactor: number = 0.65
): number {
  const depreciatedValue = calculateDepreciatedValue(
    purchasePrice,
    purchaseDate,
    depreciationRate
  );
  
  return Math.round(depreciatedValue * conversionFactor);
}



