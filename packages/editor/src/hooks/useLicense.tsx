import React, { createContext, useContext, useMemo } from "react";
import { validateLicenseKey, type LicenseValidation } from "../utils/license";

const LicenseContext = createContext<LicenseValidation>({
  isValid: false,
  isPremium: false,
});

export interface LicenseProviderProps {
  licenseKey?: string;
  children: React.ReactNode;
}

export function LicenseProvider({ licenseKey, children }: LicenseProviderProps) {
  const value = useMemo(() => validateLicenseKey(licenseKey), [licenseKey]);
  return (
    <LicenseContext.Provider value={value}>{children}</LicenseContext.Provider>
  );
}

export function useLicense(): LicenseValidation {
  return useContext(LicenseContext);
}
