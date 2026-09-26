import { getCountries, getCountryCallingCode, getExampleNumber } from 'libphonenumber-js/mobile';
import type { CountryCode } from 'libphonenumber-js';
import examples from 'libphonenumber-js/mobile/examples';

export interface PhoneCountry {
  code: CountryCode;
  name: string;
  nameEn: string;
  dialCode: string;
  flag: string;
  exampleNational: string;
  exampleInternational: string;
}

const preferredCountries: CountryCode[] = [
  'SA', 'AE', 'KW', 'QA', 'BH', 'OM', 'YE', 'EG', 'JO', 'IQ', 'MA', 'DZ',
  'TN', 'LB', 'SY', 'PS', 'SD', 'LY', 'MR', 'SO', 'TR', 'GB', 'US', 'CA',
];

const arabicNames = new Intl.DisplayNames(['ar'], { type: 'region' });
const englishNames = new Intl.DisplayNames(['en'], { type: 'region' });

const countryFlag = (code: CountryCode) =>
  String.fromCodePoint(...code.split('').map((letter) => 127397 + letter.charCodeAt(0)));

const allCountries = getCountries().map((code) => {
  const example = getExampleNumber(code, examples);
  const dialCode = `+${getCountryCallingCode(code)}`;

  return {
    code,
    name: arabicNames.of(code) || code,
    nameEn: englishNames.of(code) || code,
    dialCode,
    flag: countryFlag(code),
    exampleNational: example?.formatNational() || '',
    exampleInternational: example?.formatInternational() || dialCode,
  } satisfies PhoneCountry;
});

const preferredOrder = new Map(preferredCountries.map((code, index) => [code, index]));

export const phoneCountries = allCountries.sort((a, b) => {
  const aPreferred = preferredOrder.get(a.code);
  const bPreferred = preferredOrder.get(b.code);

  if (aPreferred !== undefined || bPreferred !== undefined) {
    if (aPreferred === undefined) return 1;
    if (bPreferred === undefined) return -1;
    return aPreferred - bPreferred;
  }

  return a.name.localeCompare(b.name, 'ar');
});

