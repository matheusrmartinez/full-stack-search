import type { Hotel } from 'schemas';
import { API_URL } from '../sand-box';
export async function getHotels(query: string) {
  const hotelsData = await fetch(
    `${API_URL}/hotels?search=${encodeURIComponent(query)}`,
  );
  const hotels = (await hotelsData.json()) as Hotel[];
  return hotels;
}
