import {
  SupermarketId,
  GroceryCatalogItem,
  ShoppingListItem,
  GroceryCategory,
  GroceryCuisineType
} from '../types';

export interface SupermarketMetadata {
  id: SupermarketId;
  name: string;
  shortName: string;
  brandColor: string;
  badgeBg: string;
  badgeText: string;
  accentBorder: string;
  icon: string;
  specialtyRo: string;
  specialtyEn: string;
}

export const SUPERMARKETS: SupermarketMetadata[] = [
  {
    id: 'LIDL',
    name: 'Lidl',
    shortName: 'Lidl',
    brandColor: 'from-blue-600 to-yellow-500',
    badgeBg: 'bg-blue-900/40 text-blue-300 border-blue-700/50',
    badgeText: 'text-blue-400',
    accentBorder: 'border-blue-500/40',
    icon: '🛒',
    specialtyRo: 'Raport calitate/pret imbatabil la lactate (Pilos), brutarie si marca proprie',
    specialtyEn: 'Unbeatable value for dairy (Pilos), bakery & private labels'
  },
  {
    id: 'KAUFLAND',
    name: 'Kaufland',
    shortName: 'Kaufland',
    brandColor: 'from-red-600 to-red-800',
    badgeBg: 'bg-red-900/40 text-red-300 border-red-700/50',
    badgeText: 'text-red-400',
    accentBorder: 'border-red-500/40',
    icon: '🥩',
    specialtyRo: 'Carne proaspata (Vreau din Romania), legume/fructe si varietate uriasa',
    specialtyEn: 'Fresh meats, fresh produce & massive catalog variety'
  },
  {
    id: 'CARREFOUR',
    name: 'Carrefour',
    shortName: 'Carrefour',
    brandColor: 'from-cyan-600 to-blue-700',
    badgeBg: 'bg-cyan-900/40 text-cyan-300 border-cyan-700/50',
    badgeText: 'text-cyan-400',
    accentBorder: 'border-cyan-500/40',
    icon: '🥖',
    specialtyRo: 'Gama completa, sector oriental/Bio generos, mezeluri si promotii',
    specialtyEn: 'Complete range, great oriental & Bio selection & weekend multi-packs'
  },
  {
    id: 'MEGA_IMAGE',
    name: 'Mega Image',
    shortName: 'Mega',
    brandColor: 'from-amber-600 to-red-600',
    badgeBg: 'bg-amber-900/40 text-amber-300 border-amber-700/50',
    badgeText: 'text-amber-400',
    accentBorder: 'border-amber-500/40',
    icon: '🏪',
    specialtyRo: 'Gusturi Romanesti, produse de proximitate, delicatese si Bio de top',
    specialtyEn: 'Local heritage foods, gourmet, bio & extreme proximity'
  },
  {
    id: 'PENNY',
    name: 'Penny',
    shortName: 'Penny',
    brandColor: 'from-yellow-600 to-red-600',
    badgeBg: 'bg-yellow-900/40 text-yellow-300 border-yellow-700/50',
    badgeText: 'text-yellow-400',
    accentBorder: 'border-yellow-500/40',
    icon: '🪙',
    specialtyRo: 'Discounter economic, preturi minime la alimente esentiale de baza',
    specialtyEn: 'Budget discounter, lowest prices on basic pantry essentials'
  },
  {
    id: 'AUCHAN',
    name: 'Auchan',
    shortName: 'Auchan',
    brandColor: 'from-emerald-600 to-teal-700',
    badgeBg: 'bg-emerald-900/40 text-emerald-300 border-emerald-700/50',
    badgeText: 'text-emerald-400',
    accentBorder: 'border-emerald-500/40',
    icon: '📦',
    specialtyRo: 'Cumparaturi mari de volum, condimente internationale si baxuri',
    specialtyEn: 'Bulk packaging, international spices & household essentials'
  }
];

export const GROCERY_CATEGORIES_CONFIG: Record<
  GroceryCategory,
  { labelRo: string; labelEn: string; icon: string; color: string }
> = {
  DAIRY: { labelRo: 'Lactate & Oua', labelEn: 'Dairy & Eggs', icon: '🥛', color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' },
  MEAT_FISH: { labelRo: 'Carne & Peste', labelEn: 'Meat & Fish', icon: '🥩', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
  FRUITS_VEGGIES: { labelRo: 'Fructe & Legume', labelEn: 'Produce & Veggies', icon: '🥗', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
  BAKERY: { labelRo: 'Paine & Brutărie', labelEn: 'Bakery & Bread', icon: '🍞', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
  PANTRY: { labelRo: 'Camara & Uleiuri', labelEn: 'Pantry & Oils', icon: '🥫', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' },
  CLEANING: { labelRo: 'Curatenie & Menaj', labelEn: 'Cleaning & Home', icon: '🧼', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' },
  BEVERAGES: { labelRo: 'Bauturi & Ceai', labelEn: 'Beverages & Tea', icon: '☕', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
  SNACKS: { labelRo: 'Gustari & Dulciuri', labelEn: 'Snacks & Sweets', icon: '🍫', color: 'text-pink-400 bg-pink-500/10 border-pink-500/30' }
};

export const DEFAULT_GROCERY_CATALOG: GroceryCatalogItem[] = [
  // --- MOROCCAN SPECIALTIES (Maroc) ---
  {
    id: 'g-couscous-500g',
    name: 'Couscous Bob Mediu / Fin (500g)',
    category: 'PANTRY',
    cuisine: 'MOROCCAN',
    culturalTag: '🇲🇦 Couscous Marocan',
    defaultUnit: 'pachet',
    notes: 'Baza esentiala pentru mancaruri traditionale cu carne si legume',
    stores: {
      LIDL: { price: 5.49, qualityScore: 4.2, brandName: 'Combino Couscous', promo: true },
      KAUFLAND: { price: 6.29, qualityScore: 4.5, brandName: 'K-Classic Couscous' },
      PENNY: { price: 5.19, qualityScore: 3.8, brandName: 'San Fabio' },
      CARREFOUR: { price: 7.49, qualityScore: 4.8, brandName: 'Baneasa / Ferrero' },
      MEGA_IMAGE: { price: 8.99, qualityScore: 4.8, brandName: 'Tipiak Couscous' },
      AUCHAN: { price: 5.99, qualityScore: 4.2, brandName: 'Auchan Couscous' }
    }
  },
  {
    id: 'g-naut-conserva',
    name: 'Naut Boabe Fiert (400g)',
    category: 'PANTRY',
    cuisine: 'MOROCCAN',
    culturalTag: '🇲🇦 Naut (Tagine & Hummus)',
    defaultUnit: 'buc',
    notes: 'Indispensabil pentru Tagine, Harira si mancaruri traditionale',
    stores: {
      LIDL: { price: 3.49, qualityScore: 4.5, brandName: 'Freshona Naut', promo: true },
      KAUFLAND: { price: 3.79, qualityScore: 4.3, brandName: 'K-Classic Naut' },
      PENNY: { price: 2.99, qualityScore: 4.0, brandName: 'Penny Naut' },
      CARREFOUR: { price: 4.49, qualityScore: 4.6, brandName: 'Bonduelle / Cirio' },
      MEGA_IMAGE: { price: 5.89, qualityScore: 4.8, brandName: 'Mega Bio Naut' },
      AUCHAN: { price: 3.59, qualityScore: 4.2, brandName: 'Auchan Naut' }
    }
  },
  {
    id: 'g-carne-vita-tagine',
    name: 'Pulpa de Vita Frageda / Manzat (1kg)',
    category: 'MEAT_FISH',
    cuisine: 'MOROCCAN',
    culturalTag: '🇲🇦 Vita pentru Tagine',
    defaultUnit: 'kg',
    notes: 'Carne frageda de manzat pentru gatire lenta cu prune si migdale',
    stores: {
      LIDL: { price: 37.90, qualityScore: 4.5, brandName: 'Pikok Vita Manzat', promo: true },
      KAUFLAND: { price: 38.50, qualityScore: 4.8, brandName: 'K-Purland Vita', promo: true },
      PENNY: { price: 36.90, qualityScore: 4.0, brandName: 'Hanul Boieresc Vita' },
      CARREFOUR: { price: 42.90, qualityScore: 4.7, brandName: 'Filiera Calitatii Vita' },
      MEGA_IMAGE: { price: 49.90, qualityScore: 5.0, brandName: 'Gusturi Romanesti Vita' },
      AUCHAN: { price: 39.90, qualityScore: 4.4, brandName: 'Auchan Macelarie' }
    }
  },
  {
    id: 'g-ceai-gunpowder-menta',
    name: 'Ceai Verde Gunpowder & Menta Proaspata',
    category: 'BEVERAGES',
    cuisine: 'MOROCCAN',
    culturalTag: '🇲🇦 Ritual Ceai Marocan (Atay)',
    defaultUnit: 'pachet',
    notes: 'Ceai verde aromat cu frunze proaspete de menta si zahar',
    stores: {
      LIDL: { price: 6.99, qualityScore: 4.3, brandName: 'Lord Nelson Green Tea + Menta', promo: true },
      KAUFLAND: { price: 7.89, qualityScore: 4.5, brandName: 'Twinings Gunpowder' },
      PENNY: { price: 6.29, qualityScore: 3.8, brandName: 'Penny Ceai Verde' },
      CARREFOUR: { price: 9.49, qualityScore: 4.8, brandName: 'Ahmad Tea Gunpowder' },
      MEGA_IMAGE: { price: 11.90, qualityScore: 5.0, brandName: 'Kusmi / Bio Green Tea' },
      AUCHAN: { price: 7.49, qualityScore: 4.2, brandName: 'Auchan Ceai Verde' }
    }
  },
  {
    id: 'g-curmale-medjool',
    name: 'Curmale Moi Naturale (500g)',
    category: 'SNACKS',
    cuisine: 'MOROCCAN',
    culturalTag: '🇲🇦 Curmale Dulci',
    defaultUnit: 'pachet',
    notes: 'Curmale bogate in energie, perfecte alaturi de ceai',
    stores: {
      LIDL: { price: 13.99, qualityScore: 4.7, brandName: 'Alesto Curmale', promo: true },
      KAUFLAND: { price: 14.90, qualityScore: 4.5, brandName: 'K-Bio Curmale' },
      PENNY: { price: 11.99, qualityScore: 4.0, brandName: 'San Fabio Curmale' },
      CARREFOUR: { price: 18.50, qualityScore: 4.9, brandName: 'Carrefour Bio Medjool' },
      MEGA_IMAGE: { price: 21.90, qualityScore: 5.0, brandName: 'Mega Bio Medjool' },
      AUCHAN: { price: 14.20, qualityScore: 4.4, brandName: 'Auchan Curmale' }
    }
  },
  {
    id: 'g-harissa-mirodenii',
    name: 'Pasta Harissa & Mirodenii (Chimen / Boia)',
    category: 'PANTRY',
    cuisine: 'MOROCCAN',
    culturalTag: '🇲🇦 Harissa & Condimente',
    defaultUnit: 'buc',
    notes: 'Pasta picanta traditionala din ardei rosii, usturoi si coriandru',
    stores: {
      LIDL: { price: 4.99, qualityScore: 4.2, brandName: 'Baresa Harissa', promo: true },
      KAUFLAND: { price: 5.49, qualityScore: 4.5, brandName: 'K-Classic Harissa' },
      PENNY: { price: 4.49, qualityScore: 3.8, brandName: 'Penny Spices' },
      CARREFOUR: { price: 6.99, qualityScore: 4.8, brandName: 'Le Phare du Cap Bon' },
      MEGA_IMAGE: { price: 8.49, qualityScore: 4.9, brandName: 'AlWadi Harissa' },
      AUCHAN: { price: 5.99, qualityScore: 4.4, brandName: 'Auchan Harissa' }
    }
  },
  {
    id: 'g-masline-marinate',
    name: 'Masline Kalamata / Marinate cu Ierburi (500g)',
    category: 'PANTRY',
    cuisine: 'MOROCCAN',
    culturalTag: '🇲🇦 Masline Mediteraneene',
    defaultUnit: 'buc',
    notes: 'Masline carnoase marinate in ulei de masline si mirodenii',
    stores: {
      LIDL: { price: 11.99, qualityScore: 4.8, brandName: 'Baresa Kalamata', promo: true },
      KAUFLAND: { price: 12.50, qualityScore: 4.5, brandName: 'K-Favorites Masline' },
      PENNY: { price: 10.49, qualityScore: 4.0, brandName: 'San Fabio Masline' },
      CARREFOUR: { price: 14.90, qualityScore: 4.7, brandName: 'Carrefour Extra' },
      MEGA_IMAGE: { price: 17.50, qualityScore: 5.0, brandName: 'Gusturi Romanesti' },
      AUCHAN: { price: 12.90, qualityScore: 4.3, brandName: 'Auchan Masline' }
    }
  },

  // --- ROMANIAN SPECIALTIES (Romania) ---
  {
    id: 'g-malai-superior',
    name: 'Malai Grisat Superior (1kg)',
    category: 'PANTRY',
    cuisine: 'ROMANIAN',
    culturalTag: '🇷🇴 Mamaliguta Traditionala',
    defaultUnit: 'kg',
    notes: 'Pentru mamaliguta aurie romaneasca cu telemea si smantana',
    stores: {
      LIDL: { price: 3.29, qualityScore: 4.2, brandName: 'Castello Malai Extra', promo: true },
      KAUFLAND: { price: 3.49, qualityScore: 4.5, brandName: 'Pambac / Baneasa Malai' },
      PENNY: { price: 2.99, qualityScore: 4.0, brandName: 'Penny Malai Grisat' },
      CARREFOUR: { price: 3.99, qualityScore: 4.7, brandName: 'Baneasa Malai Extra' },
      MEGA_IMAGE: { price: 4.69, qualityScore: 4.8, brandName: 'Gusturi Romanesti Malai' },
      AUCHAN: { price: 3.49, qualityScore: 4.3, brandName: 'Pambac Malai' }
    }
  },
  {
    id: 'g-telemea-vaca-saramura',
    name: 'Branza Telemea de Vaca in Saramura (400g)',
    category: 'DAIRY',
    cuisine: 'ROMANIAN',
    culturalTag: '🇷🇴 Telemea de Saramura',
    defaultUnit: 'buc',
    notes: 'Telemea maturata romaneasca pentru salate si mamaliga',
    stores: {
      LIDL: { price: 14.99, qualityScore: 4.6, brandName: 'Pilos Telemea Saramura', promo: true },
      KAUFLAND: { price: 15.90, qualityScore: 4.7, brandName: 'K-Classic Telemea' },
      PENNY: { price: 13.49, qualityScore: 4.1, brandName: 'Boni Telemea' },
      CARREFOUR: { price: 18.90, qualityScore: 4.8, brandName: 'Olympus Telemea Vaca' },
      MEGA_IMAGE: { price: 22.90, qualityScore: 5.0, brandName: 'Gusturi Romanesti / Napolact' },
      AUCHAN: { price: 16.50, qualityScore: 4.4, brandName: 'Auchan Telemea' }
    }
  },
  {
    id: 'g-smantana-20',
    name: 'Smantana Gospodareasca 20% Grasime (850g)',
    category: 'DAIRY',
    cuisine: 'ROMANIAN',
    culturalTag: '🇷🇴 Smantana Crema',
    defaultUnit: 'buc',
    notes: 'Smantana bogata pentru ciorbe, sarmale si mamaliga',
    stores: {
      LIDL: { price: 11.49, qualityScore: 4.6, brandName: 'Pilos Smantana 20%', promo: true },
      KAUFLAND: { price: 12.20, qualityScore: 4.5, brandName: 'K-Classic Smantana' },
      PENNY: { price: 10.99, qualityScore: 4.0, brandName: 'Boni Smantana 20%' },
      CARREFOUR: { price: 13.90, qualityScore: 4.8, brandName: 'Covalact Preabun' },
      MEGA_IMAGE: { price: 16.20, qualityScore: 5.0, brandName: 'Napolact 20%' },
      AUCHAN: { price: 12.50, qualityScore: 4.3, brandName: 'Auchan Smantana' }
    }
  },
  {
    id: 'g-bors-proaspat',
    name: 'Bors Acru Traditional din Tarate (1L)',
    category: 'PANTRY',
    cuisine: 'ROMANIAN',
    culturalTag: '🇷🇴 Bors Acrit Ciorbe',
    defaultUnit: 'L',
    notes: 'Bors fermentat natural pentru acrit ciorbele traditionale',
    stores: {
      LIDL: { price: 2.69, qualityScore: 4.2, brandName: 'Camara Noastra Bors', promo: true },
      KAUFLAND: { price: 2.89, qualityScore: 4.5, brandName: 'Olympia Bors de Casa' },
      PENNY: { price: 2.49, qualityScore: 4.0, brandName: 'Penny Bors' },
      CARREFOUR: { price: 3.49, qualityScore: 4.7, brandName: 'Olympia Bors Clasic' },
      MEGA_IMAGE: { price: 4.19, qualityScore: 4.9, brandName: 'Gusturi Romanesti Bors' },
      AUCHAN: { price: 2.99, qualityScore: 4.3, brandName: 'Bunicuta Bors' }
    }
  },
  {
    id: 'g-muraturi-asortate',
    name: 'Muraturi Asortate in Saramura (800g)',
    category: 'PANTRY',
    cuisine: 'ROMANIAN',
    culturalTag: '🇷🇴 Muraturi de Butoi',
    defaultUnit: 'buc',
    notes: 'Gogonele, castraveti si conopida crocante in saramura',
    stores: {
      LIDL: { price: 7.99, qualityScore: 4.5, brandName: 'Freshona Muraturi', promo: true },
      KAUFLAND: { price: 8.50, qualityScore: 4.6, brandName: 'Vreau din Romania Muraturi' },
      PENNY: { price: 6.99, qualityScore: 4.0, brandName: 'Hanul Boieresc' },
      CARREFOUR: { price: 9.90, qualityScore: 4.7, brandName: 'Raureni Muraturi' },
      MEGA_IMAGE: { price: 12.50, qualityScore: 5.0, brandName: 'Gusturi Romanesti Muraturi' },
      AUCHAN: { price: 8.90, qualityScore: 4.3, brandName: 'Auchan Muraturi' }
    }
  },

  // --- UNIVERSAL STAPLES ---
  {
    id: 'g-lapte-35',
    name: 'Lapte 3.5% grasime (1L)',
    category: 'DAIRY',
    cuisine: 'UNIVERSAL',
    defaultUnit: 'L',
    stores: {
      LIDL: { price: 4.69, qualityScore: 4.2, brandName: 'Pilos 3.5%', promo: true },
      KAUFLAND: { price: 4.89, qualityScore: 4.2, brandName: 'K-Classic 3.5%' },
      PENNY: { price: 4.49, qualityScore: 3.8, brandName: 'Boni 3.5%' },
      CARREFOUR: { price: 6.79, qualityScore: 4.5, brandName: 'Zuzu 3.5%' },
      MEGA_IMAGE: { price: 8.49, qualityScore: 5.0, brandName: 'Napolact Bio 3.5%' },
      AUCHAN: { price: 5.29, qualityScore: 4.0, brandName: 'Auchan 3.5%' }
    }
  },
  {
    id: 'g-oua-30',
    name: 'Oua proaspete M/L (Cofraj 30 buc)',
    category: 'DAIRY',
    cuisine: 'UNIVERSAL',
    defaultUnit: 'buc',
    stores: {
      LIDL: { price: 21.99, qualityScore: 4.5, brandName: 'Camara Noastra M30', promo: true },
      KAUFLAND: { price: 23.49, qualityScore: 4.3, brandName: 'K-Classic M30' },
      PENNY: { price: 20.99, qualityScore: 4.0, brandName: 'Penny Oua M30' },
      CARREFOUR: { price: 26.99, qualityScore: 4.5, brandName: 'Aviputna Oua Sol' },
      MEGA_IMAGE: { price: 31.99, qualityScore: 5.0, brandName: 'Mega Oua Ecologice' },
      AUCHAN: { price: 23.99, qualityScore: 4.2, brandName: 'Poulet Oua M30' }
    }
  },
  {
    id: 'g-piept-pui',
    name: 'Piept de pui dezosat proaspat (1kg)',
    category: 'MEAT_FISH',
    cuisine: 'UNIVERSAL',
    defaultUnit: 'kg',
    stores: {
      LIDL: { price: 24.50, qualityScore: 4.5, brandName: 'Pikok Piept Pui', promo: true },
      KAUFLAND: { price: 23.90, qualityScore: 4.8, brandName: 'Vreau din Romania Pui', promo: true },
      PENNY: { price: 23.50, qualityScore: 4.0, brandName: 'Hanul Boieresc Pui' },
      CARREFOUR: { price: 27.90, qualityScore: 4.6, brandName: 'Agricola Pui Fericit' },
      MEGA_IMAGE: { price: 34.50, qualityScore: 5.0, brandName: 'Fragedo / Gusturi Romanesti' },
      AUCHAN: { price: 25.50, qualityScore: 4.3, brandName: 'Auchan Macelarie Pui' }
    }
  },
  {
    id: 'g-rosii-cherry',
    name: 'Rosii cherry dulci / ciorchine (500g)',
    category: 'FRUITS_VEGGIES',
    cuisine: 'UNIVERSAL',
    defaultUnit: 'buc',
    stores: {
      LIDL: { price: 6.99, qualityScore: 4.5, brandName: 'Piata Lidl Cherry', promo: true },
      KAUFLAND: { price: 7.49, qualityScore: 4.4, brandName: 'K-Bio Cherry' },
      PENNY: { price: 5.99, qualityScore: 3.8, brandName: 'Penny Cherry' },
      CARREFOUR: { price: 8.99, qualityScore: 4.7, brandName: 'Carrefour Bio Cherry' },
      MEGA_IMAGE: { price: 11.49, qualityScore: 5.0, brandName: 'Gusturi Romanesti Cherry' },
      AUCHAN: { price: 7.99, qualityScore: 4.2, brandName: 'Auchan Cherry' }
    }
  },
  {
    id: 'g-ulei-masline-extra',
    name: 'Ulei de masline Extra Virgin (1L)',
    category: 'PANTRY',
    cuisine: 'UNIVERSAL',
    defaultUnit: 'L',
    stores: {
      LIDL: { price: 39.99, qualityScore: 4.5, brandName: 'Primadonna Extra Virgin', promo: true },
      KAUFLAND: { price: 42.50, qualityScore: 4.6, brandName: 'K-Bio Extra Virgin' },
      PENNY: { price: 36.99, qualityScore: 4.0, brandName: 'San Fabio Extra Virgin' },
      CARREFOUR: { price: 46.90, qualityScore: 4.8, brandName: 'Monini Classico' },
      MEGA_IMAGE: { price: 54.90, qualityScore: 5.0, brandName: 'Monini Bio / Costa d Oro' },
      AUCHAN: { price: 41.50, qualityScore: 4.3, brandName: 'Auchan Extra Virgin' }
    }
  },
  {
    id: 'g-paine-toast-secara',
    name: 'Paine toast secara / integrala feliata (500g)',
    category: 'BAKERY',
    cuisine: 'UNIVERSAL',
    defaultUnit: 'buc',
    stores: {
      LIDL: { price: 4.89, qualityScore: 4.3, brandName: 'Tastino Toast Secara', promo: true },
      KAUFLAND: { price: 5.29, qualityScore: 4.4, brandName: 'K-Classic Toast' },
      PENNY: { price: 4.39, qualityScore: 3.8, brandName: 'Penny Toast' },
      CARREFOUR: { price: 6.79, qualityScore: 4.6, brandName: 'Dobrogea Toast Secara' },
      MEGA_IMAGE: { price: 8.29, qualityScore: 4.9, brandName: 'Vel Pitar Toast Secara' },
      AUCHAN: { price: 5.49, qualityScore: 4.1, brandName: 'Auchan Toast' }
    }
  },
  {
    id: 'g-iaurt-grecesc',
    name: 'Iaurt Grecesc 10% grasime (1kg)',
    category: 'DAIRY',
    cuisine: 'UNIVERSAL',
    defaultUnit: 'kg',
    stores: {
      LIDL: { price: 11.99, qualityScore: 4.8, brandName: 'Pilos Iaurt Grecesc 10%', promo: true },
      KAUFLAND: { price: 12.89, qualityScore: 4.5, brandName: 'K-Classic Grecesc 10%' },
      PENNY: { price: 10.99, qualityScore: 4.0, brandName: 'Boni Grecesc 10%' },
      CARREFOUR: { price: 15.99, qualityScore: 4.8, brandName: 'Olympus Grecesc 10%' },
      MEGA_IMAGE: { price: 19.50, qualityScore: 5.0, brandName: 'Kolios / Olympus Bio 10%' },
      AUCHAN: { price: 13.49, qualityScore: 4.3, brandName: 'Auchan Grecesc 10%' }
    }
  },
  {
    id: 'g-banane',
    name: 'Banane proaspete Premium (1kg)',
    category: 'FRUITS_VEGGIES',
    cuisine: 'UNIVERSAL',
    defaultUnit: 'kg',
    stores: {
      LIDL: { price: 5.99, qualityScore: 4.5, brandName: 'Piata Lidl Banane', promo: true },
      KAUFLAND: { price: 6.29, qualityScore: 4.4, brandName: 'Kaufland Banane' },
      PENNY: { price: 5.49, qualityScore: 4.0, brandName: 'Penny Banane' },
      CARREFOUR: { price: 7.49, qualityScore: 4.7, brandName: 'Chiquita Banane' },
      MEGA_IMAGE: { price: 8.99, qualityScore: 4.9, brandName: 'Chiquita / Mega Bio' },
      AUCHAN: { price: 6.19, qualityScore: 4.2, brandName: 'Auchan Banane' }
    }
  }
];

export const DEFAULT_SHOPPING_LIST: ShoppingListItem[] = [
  {
    id: 'item-1',
    catalogItemId: 'g-couscous-500g',
    name: 'Couscous Bob Mediu / Fin (500g)',
    category: 'PANTRY',
    quantity: 1,
    unit: 'pachet',
    isChecked: false
  },
  {
    id: 'item-2',
    catalogItemId: 'g-naut-conserva',
    name: 'Naut Boabe Fiert (400g)',
    category: 'PANTRY',
    quantity: 2,
    unit: 'buc',
    isChecked: false
  },
  {
    id: 'item-3',
    catalogItemId: 'g-carne-vita-tagine',
    name: 'Pulpa de Vita Frageda / Manzat (1kg)',
    category: 'MEAT_FISH',
    quantity: 1,
    unit: 'kg',
    isChecked: false
  },
  {
    id: 'item-4',
    catalogItemId: 'g-telemea-vaca-saramura',
    name: 'Branza Telemea de Vaca in Saramura (400g)',
    category: 'DAIRY',
    quantity: 1,
    unit: 'buc',
    isChecked: false
  },
  {
    id: 'item-5',
    catalogItemId: 'g-malai-superior',
    name: 'Malai Grisat Superior (1kg)',
    category: 'PANTRY',
    quantity: 1,
    unit: 'kg',
    isChecked: false
  },
  {
    id: 'item-6',
    catalogItemId: 'g-oua-30',
    name: 'Oua proaspete M/L (Cofraj 30 buc)',
    category: 'DAIRY',
    quantity: 1,
    unit: 'buc',
    isChecked: false
  }
];

export interface GroceryQuickBundle {
  id: string;
  titleRo: string;
  titleEn: string;
  icon: string;
  culture: 'MOROCCAN' | 'ROMANIAN' | 'MIXED' | 'BUDGET';
  badgeRo: string;
  descriptionRo: string;
  descriptionEn: string;
  items: { catalogId: string; quantity: number }[];
}

export const QUICK_BUNDLES: GroceryQuickBundle[] = [
  {
    id: 'bundle-mixed-couple',
    titleRo: 'Saptamana Cuplului Mixt Marocan-Roman',
    titleEn: 'Moroccan-Romanian Couple Weekly Pack',
    icon: '🇲🇦🇷🇴',
    culture: 'MIXED',
    badgeRo: 'Top Alegere Haytham & Cati',
    descriptionRo: 'Armonie perfecta: Couscous, vita tagine, telemea proaspata, mamaliguta, naut, oua si ulei de masline',
    descriptionEn: 'Perfect balance of Moroccan staples and Romanian comfort foods',
    items: [
      { catalogId: 'g-couscous-500g', quantity: 1 },
      { catalogId: 'g-carne-vita-tagine', quantity: 1 },
      { catalogId: 'g-naut-conserva', quantity: 2 },
      { catalogId: 'g-telemea-vaca-saramura', quantity: 1 },
      { catalogId: 'g-malai-superior', quantity: 1 },
      { catalogId: 'g-smantana-20', quantity: 1 },
      { catalogId: 'g-oua-30', quantity: 1 },
      { catalogId: 'g-ulei-masline-extra', quantity: 1 }
    ]
  },
  {
    id: 'bundle-moroccan-tagine',
    titleRo: 'Cina Traditionala Marocana (Tagine & Couscous)',
    titleEn: 'Moroccan Tagine & Couscous Night',
    icon: '🇲🇦🍲',
    culture: 'MOROCCAN',
    badgeRo: 'Gust Autentic Marocan',
    descriptionRo: 'Pulpa de vita, couscous fin, naut, harissa, masline marinate si ceai verde cu menta',
    descriptionEn: 'Tender beef, fine couscous, chickpeas, harissa, olives, and fresh mint tea',
    items: [
      { catalogId: 'g-carne-vita-tagine', quantity: 1 },
      { catalogId: 'g-couscous-500g', quantity: 1 },
      { catalogId: 'g-naut-conserva', quantity: 2 },
      { catalogId: 'g-harissa-mirodenii', quantity: 1 },
      { catalogId: 'g-masline-marinate', quantity: 1 },
      { catalogId: 'g-ceai-gunpowder-menta', quantity: 1 },
      { catalogId: 'g-curmale-medjool', quantity: 1 }
    ]
  },
  {
    id: 'bundle-romanian-feast',
    titleRo: 'Meniu Traditional Romanesc (Mamaliguta & Ciorba)',
    titleEn: 'Traditional Romanian Family Feast',
    icon: '🇷🇴🍲',
    culture: 'ROMANIAN',
    badgeRo: 'Traditie Romaneasca',
    descriptionRo: 'Malai auriu, telemea de saramura, smantana grasa, bors acru, piept de pui si muraturi',
    descriptionEn: 'Polenta cornmeal, salted telemea cheese, sour cream, bors soup base, chicken and pickles',
    items: [
      { catalogId: 'g-malai-superior', quantity: 1 },
      { catalogId: 'g-telemea-vaca-saramura', quantity: 1 },
      { catalogId: 'g-smantana-20', quantity: 1 },
      { catalogId: 'g-bors-proaspat', quantity: 1 },
      { catalogId: 'g-piept-pui', quantity: 1 },
      { catalogId: 'g-muraturi-asortate', quantity: 1 },
      { catalogId: 'g-oua-30', quantity: 1 }
    ]
  },
  {
    id: 'bundle-weekly-basics',
    titleRo: 'Cosul Esential Economic de Baza',
    titleEn: 'Weekly Essentials Basket',
    icon: '🧺',
    culture: 'BUDGET',
    badgeRo: 'Pret Minim',
    descriptionRo: 'Lapte 3.5%, oua 30 buc, piept de pui, rosii cherry, banane, iaurt grecesc si paine',
    descriptionEn: 'Milk, eggs, chicken, tomatoes, bread, bananas, greek yogurt',
    items: [
      { catalogId: 'g-lapte-35', quantity: 2 },
      { catalogId: 'g-oua-30', quantity: 1 },
      { catalogId: 'g-piept-pui', quantity: 1 },
      { catalogId: 'g-rosii-cherry', quantity: 2 },
      { catalogId: 'g-banane', quantity: 1.5 },
      { catalogId: 'g-iaurt-grecesc', quantity: 1 },
      { catalogId: 'g-paine-toast-secara', quantity: 1 }
    ]
  }
];
