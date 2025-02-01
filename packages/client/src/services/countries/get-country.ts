import type { Country } from 'schemas';
import { API_URL } from '../sand-box';

export async function getCountryById(countryId: string) {
  const countryData = await fetch(`${API_URL}/countries/${countryId}`);
  const { country } = (await countryData.json()) as { country: Country };
  return country;
}
