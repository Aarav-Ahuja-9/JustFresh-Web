import { cookies } from "next/headers";
import { dictionaries, Locale } from "./dictionaries";

export async function getDictionary() {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE");
  
  let locale: Locale = "en"; // Default
  
  if (localeCookie && Object.keys(dictionaries).includes(localeCookie.value)) {
    locale = localeCookie.value as Locale;
  }
  
  return { 
    t: dictionaries[locale],
    locale 
  };
}
