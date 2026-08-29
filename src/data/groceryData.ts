import {
  SupermarketId,
  GroceryCatalogItem,
  ShoppingListItem,
  GroceryCategory,
  GroceryCuisineType,
  SavedRecipeReel
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
    specialtyRo: 'Gama completa, sector international/Bio generos, mezeluri si promotii',
    specialtyEn: 'Complete range, great international & Bio selection & multi-packs'
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
    specialtyRo: 'Gusturi Romanesti, produse gourmet, delicatese si Bio de top',
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
  DAIRY: { labelRo: 'Lactate & Oua', labelEn: 'Dairy & Eggs', icon: '🥛', color: 'text-blue-400' },
  MEAT_FISH: { labelRo: 'Carne & Peste', labelEn: 'Meat & Fish', icon: '🥩', color: 'text-red-400' },
  FRUITS_VEGGIES: { labelRo: 'Fructe & Legume', labelEn: 'Produce & Veggies', icon: '🥦', color: 'text-emerald-400' },
  BAKERY: { labelRo: 'Paine & Brutarii', labelEn: 'Bakery & Bread', icon: '🍞', color: 'text-amber-400' },
  PANTRY: { labelRo: 'Camara & Uleiuri', labelEn: 'Pantry & Oils', icon: '🥫', color: 'text-yellow-400' },
  CLEANING: { labelRo: 'Curatenie & Menaj', labelEn: 'Cleaning & Home', icon: '🧼', color: 'text-cyan-400' },
  BEVERAGES: { labelRo: 'Bauturi & Ceai', labelEn: 'Beverages & Tea', icon: '🫖', color: 'text-teal-400' },
  SNACKS: { labelRo: 'Gustari & Dulciuri', labelEn: 'Snacks & Sweets', icon: '🍫', color: 'text-pink-400' }
};

export const DEFAULT_GROCERY_CATALOG: GroceryCatalogItem[] = [
  // --- MOROCCAN ESSENTIALS ---
  {
    id: 'g-couscous-500g',
    name: 'Couscous Tradițional Mediu (500g)',
    category: 'PANTRY',
    defaultUnit: 'pachet',
    cuisine: 'MOROCCAN',
    culturalTag: 'Marocan Tradițional',
    notes: 'Baza pentru tajine si mancaruri traditionale marocane',
    stores: {
      CARREFOUR: { price: 5.89, qualityScore: 5, brandName: 'Dari Maroc / Casino' },
      KAUFLAND: { price: 6.29, qualityScore: 4, brandName: 'K-Classic Couscous' },
      LIDL: { price: 5.49, qualityScore: 4, brandName: '1001 Delights' },
      MEGA_IMAGE: { price: 7.19, qualityScore: 5, brandName: 'Tipiak / Dari' },
      PENNY: { price: 5.79, qualityScore: 3, brandName: 'San Fabio' },
      AUCHAN: { price: 5.65, qualityScore: 4, brandName: 'Auchan Oriental' }
    }
  },
  {
    id: 'g-carne-vita-tagine',
    name: 'Pulpă de Vită Fragedă pentru Tajine (1kg)',
    category: 'MEAT_FISH',
    defaultUnit: 'kg',
    cuisine: 'MOROCCAN',
    culturalTag: 'Marocan Tradițional',
    notes: 'Bucati fragede de vita pentru gatit lent la tajine',
    stores: {
      KAUFLAND: { price: 38.99, qualityScore: 5, brandName: 'Vreau din Romania / Kaufland Carne' },
      LIDL: { price: 39.99, qualityScore: 4, brandName: 'Lidl Proaspat' },
      CARREFOUR: { price: 41.50, qualityScore: 4, brandName: 'Filiera Calitatii Carrefour' },
      MEGA_IMAGE: { price: 46.99, qualityScore: 5, brandName: 'Gourmet Vita Frageda' },
      PENNY: { price: 37.99, qualityScore: 3, brandName: 'Casa Gustului' },
      AUCHAN: { price: 39.50, qualityScore: 4, brandName: 'Auchan Macelarie' }
    }
  },
  {
    id: 'g-naut-conserva',
    name: 'Năut Boabe Fiert (400g / 240g net)',
    category: 'PANTRY',
    defaultUnit: 'buc',
    cuisine: 'MOROCCAN',
    culturalTag: 'Marocan Tradițional',
    notes: 'Naut gata fiert pentru hummus, couscous si supe Harira',
    stores: {
      LIDL: { price: 3.49, qualityScore: 5, brandName: 'Freshona Naut' },
      PENNY: { price: 3.39, qualityScore: 4, brandName: 'Penny Naut' },
      KAUFLAND: { price: 3.69, qualityScore: 4, brandName: 'K-Classic Naut' },
      CARREFOUR: { price: 3.99, qualityScore: 4, brandName: 'Carrefour Simpl' },
      MEGA_IMAGE: { price: 4.49, qualityScore: 4, brandName: 'Mega Image Naut' },
      AUCHAN: { price: 3.59, qualityScore: 4, brandName: 'Auchan Naut' }
    }
  },
  {
    id: 'g-harissa-mirodenii',
    name: 'Pastă de Harissa & Mirodenii Tajine (150g)',
    category: 'PANTRY',
    defaultUnit: 'buc',
    cuisine: 'MOROCCAN',
    culturalTag: 'Condimente Marocane',
    notes: 'Pasta picanta cu ardei copt si chimen arabesc',
    stores: {
      CARREFOUR: { price: 7.89, qualityScore: 5, brandName: 'Le Phare du Cap Bon Harissa' },
      KAUFLAND: { price: 8.49, qualityScore: 4, brandName: 'Oriental Spices' },
      MEGA_IMAGE: { price: 9.99, qualityScore: 5, brandName: 'Harissa Berbere' },
      LIDL: { price: 6.99, qualityScore: 4, brandName: '1001 Delights' },
      AUCHAN: { price: 7.99, qualityScore: 4, brandName: 'Auchan Harissa' }
    }
  },
  {
    id: 'g-ceai-gunpowder-menta',
    name: 'Ceai Verde Gunpowder cu Mentă Proaspătă (100g)',
    category: 'BEVERAGES',
    defaultUnit: 'pachet',
    cuisine: 'MOROCCAN',
    culturalTag: 'Ceai Marocan Maghrebi',
    notes: 'Ceai verde traditional pentru ritualul marocan cu menta',
    stores: {
      CARREFOUR: { price: 8.99, qualityScore: 5, brandName: 'Al-Arouss Gunpowder Tea' },
      KAUFLAND: { price: 9.49, qualityScore: 4, brandName: 'Lord Nelson / K-Classic' },
      MEGA_IMAGE: { price: 11.20, qualityScore: 5, brandName: 'Twinings / Fares Mentol' },
      LIDL: { price: 7.99, qualityScore: 4, brandName: 'Lord Nelson Green' },
      AUCHAN: { price: 8.50, qualityScore: 4, brandName: 'Auchan The Vert' }
    }
  },
  {
    id: 'g-curmale-medjool',
    name: 'Curmale Medjool Mari (250g)',
    category: 'SNACKS',
    defaultUnit: 'pachet',
    cuisine: 'MOROCCAN',
    culturalTag: 'Desert Marocan',
    stores: {
      LIDL: { price: 11.99, qualityScore: 5, brandName: 'Alesto Medjool' },
      KAUFLAND: { price: 12.99, qualityScore: 4, brandName: 'K-Bio Medjool' },
      CARREFOUR: { price: 13.50, qualityScore: 5, brandName: 'Carrefour Bio' },
      MEGA_IMAGE: { price: 15.99, qualityScore: 5, brandName: 'Mega Apetit' },
      PENNY: { price: 11.49, qualityScore: 3, brandName: 'Penny Select' }
    }
  },
  {
    id: 'g-masline-marinate',
    name: 'Măsline Kalamata & Marocane Marinate (300g)',
    category: 'PANTRY',
    defaultUnit: 'buc',
    cuisine: 'MOROCCAN',
    culturalTag: 'Marocan',
    stores: {
      LIDL: { price: 8.99, qualityScore: 5, brandName: 'Baresa Kalamata' },
      KAUFLAND: { price: 9.49, qualityScore: 4, brandName: 'K-Classic Masline' },
      CARREFOUR: { price: 10.20, qualityScore: 4, brandName: 'Carrefour Masline' },
      MEGA_IMAGE: { price: 12.50, qualityScore: 5, brandName: 'Mega Gourmet' }
    }
  },

  // --- SPANISH ESSENTIALS (🇪🇸 SPANISH) ---
  {
    id: 'g-orez-bomba-paella',
    name: 'Orez Bomba Spaniol pentru Paella (1kg)',
    category: 'PANTRY',
    defaultUnit: 'kg',
    cuisine: 'SPANISH',
    culturalTag: 'Spaniol Tradițional',
    notes: 'Orez cu bob rotund ce absoarbe supa fara a se sfarama in Paella',
    stores: {
      CARREFOUR: { price: 13.99, qualityScore: 5, brandName: 'Carrefour Especial Paella' },
      KAUFLAND: { price: 14.49, qualityScore: 4, brandName: 'Scotti Paella Rice' },
      MEGA_IMAGE: { price: 16.50, qualityScore: 5, brandName: 'SOS Arroz Bomba' },
      AUCHAN: { price: 13.80, qualityScore: 4, brandName: 'Auchan Paella' },
      LIDL: { price: 12.99, qualityScore: 4, brandName: 'Sol&Mar Bomba' }
    }
  },
  {
    id: 'g-chorizo-spaniol',
    name: 'Cârnați Chorizo Spaniol Tradițional Dulce/Picant (200g)',
    category: 'MEAT_FISH',
    defaultUnit: 'buc',
    cuisine: 'SPANISH',
    culturalTag: 'Spaniol Tradițional',
    notes: 'Baza cu boia dulce afumata pentru tapas, oua spaniole si paella',
    stores: {
      LIDL: { price: 9.49, qualityScore: 5, brandName: 'Sol&Mar Chorizo' },
      PENNY: { price: 8.99, qualityScore: 4, brandName: 'San Fabio Chorizo' },
      KAUFLAND: { price: 10.29, qualityScore: 4, brandName: 'K-Classic Chorizo' },
      CARREFOUR: { price: 11.20, qualityScore: 5, brandName: 'Palacios Chorizo' },
      MEGA_IMAGE: { price: 12.80, qualityScore: 5, brandName: 'El Pozo Chorizo' }
    }
  },
  {
    id: 'g-jamon-serrano',
    name: 'Jamón Serrano Reserva feliat fin (100g)',
    category: 'MEAT_FISH',
    defaultUnit: 'pachet',
    cuisine: 'SPANISH',
    culturalTag: 'Tapas Spaniol',
    notes: 'Jambon crud-uscat maturat 12 luni pentru aperitive si tapas',
    stores: {
      LIDL: { price: 8.49, qualityScore: 5, brandName: 'Sol&Mar Jamon' },
      KAUFLAND: { price: 8.99, qualityScore: 4, brandName: 'K-Favourites Serrano' },
      CARREFOUR: { price: 9.49, qualityScore: 5, brandName: 'Carrefour Selection' },
      MEGA_IMAGE: { price: 10.99, qualityScore: 5, brandName: 'Campofrio Serrano' },
      PENNY: { price: 8.29, qualityScore: 3, brandName: 'Penny Select' }
    }
  },
  {
    id: 'g-sofran-pur',
    name: 'Șofran Spaniol Firicele Naturale (0.5g)',
    category: 'PANTRY',
    defaultUnit: 'buc',
    cuisine: 'SPANISH',
    culturalTag: 'Condiment Paella',
    stores: {
      CARREFOUR: { price: 17.99, qualityScore: 5, brandName: 'Carmencita Azafran' },
      KAUFLAND: { price: 18.49, qualityScore: 4, brandName: 'Kotanyi Sofran' },
      MEGA_IMAGE: { price: 20.50, qualityScore: 5, brandName: 'Fuchs Sofran Pur' },
      AUCHAN: { price: 17.50, qualityScore: 4, brandName: 'Auchan Sofran' }
    }
  },
  {
    id: 'g-boia-afumata-pimenton',
    name: 'Boia Dulce Afumată Pimentón de la Vera (75g)',
    category: 'PANTRY',
    defaultUnit: 'buc',
    cuisine: 'SPANISH',
    culturalTag: 'Spaniol Tradițional',
    stores: {
      KAUFLAND: { price: 6.49, qualityScore: 4, brandName: 'Kotanyi Boia Afumata' },
      CARREFOUR: { price: 7.20, qualityScore: 5, brandName: 'La Chinata Pimenton' },
      MEGA_IMAGE: { price: 8.20, qualityScore: 5, brandName: 'Gourmet Boia Afumata' },
      AUCHAN: { price: 6.80, qualityScore: 4, brandName: 'Auchan Boia' }
    }
  },
  {
    id: 'g-creveti-decorticati',
    name: 'Creveți Decorticați Black Tiger congelați (400g)',
    category: 'MEAT_FISH',
    defaultUnit: 'pachet',
    cuisine: 'SPANISH',
    culturalTag: 'Tapas & Paella',
    stores: {
      PENNY: { price: 23.49, qualityScore: 4, brandName: 'Penny Creveti' },
      LIDL: { price: 24.99, qualityScore: 5, brandName: 'Ocean Sea Creveti' },
      KAUFLAND: { price: 25.99, qualityScore: 4, brandName: 'K-Classic Creveti' },
      CARREFOUR: { price: 26.50, qualityScore: 4, brandName: 'Carrefour Pescarie' },
      AUCHAN: { price: 24.50, qualityScore: 4, brandName: 'Auchan Fructe Mare' }
    }
  },

  // --- ITALIAN ESSENTIALS (🇮🇹 ITALIAN) ---
  {
    id: 'g-spaghetti-bronzo',
    name: 'Paste Spaghetti Barilla / De Cecco (500g)',
    category: 'PANTRY',
    defaultUnit: 'pachet',
    cuisine: 'ITALIAN',
    culturalTag: 'Italian Autentic',
    notes: 'Paste din grau dur matritate in bronz pentru sosuri dense',
    stores: {
      PENNY: { price: 4.69, qualityScore: 4, brandName: 'San Fabio Spaghetti' },
      LIDL: { price: 4.89, qualityScore: 4, brandName: 'Combino / Barilla' },
      KAUFLAND: { price: 5.19, qualityScore: 5, brandName: 'Barilla n.5' },
      CARREFOUR: { price: 5.49, qualityScore: 5, brandName: 'Barilla / De Cecco' },
      MEGA_IMAGE: { price: 6.20, qualityScore: 5, brandName: 'De Cecco Spaghetti' },
      AUCHAN: { price: 4.95, qualityScore: 4, brandName: 'Barilla n.5' }
    }
  },
  {
    id: 'g-guanciale-pancetta',
    name: 'Guanciale / Pancetta Italiană cuburi (150g)',
    category: 'MEAT_FISH',
    defaultUnit: 'pachet',
    cuisine: 'ITALIAN',
    culturalTag: 'Carbonara & Amatriciana',
    notes: 'Gusa de porc maturata cu piper pentru adevarata Carbonara',
    stores: {
      KAUFLAND: { price: 11.49, qualityScore: 5, brandName: 'K-Favourites Guanciale' },
      CARREFOUR: { price: 12.20, qualityScore: 5, brandName: 'Carrefour Italian' },
      MEGA_IMAGE: { price: 13.99, qualityScore: 5, brandName: 'Negroni Pancetta' },
      AUCHAN: { price: 11.90, qualityScore: 4, brandName: 'Auchan Salumi' },
      LIDL: { price: 10.99, qualityScore: 4, brandName: 'Italiamo Guanciale' }
    }
  },
  {
    id: 'g-parmigiano-reggiano',
    name: 'Parmigiano Reggiano DOP maturat 24 luni (200g)',
    category: 'DAIRY',
    defaultUnit: 'buc',
    cuisine: 'ITALIAN',
    culturalTag: 'Italian Autentic',
    notes: 'Branza dura italiana cu gust intens si cristale fine',
    stores: {
      LIDL: { price: 16.49, qualityScore: 5, brandName: 'Italiamo Parmigiano 24m' },
      KAUFLAND: { price: 17.29, qualityScore: 5, brandName: 'K-Favourites Parmigiano' },
      CARREFOUR: { price: 17.99, qualityScore: 5, brandName: 'Zanetti Parmigiano' },
      AUCHAN: { price: 16.90, qualityScore: 4, brandName: 'Parmareggio' },
      MEGA_IMAGE: { price: 21.50, qualityScore: 5, brandName: 'Parmareggio 24m' }
    }
  },
  {
    id: 'g-mozzarella-bufala',
    name: 'Mozzarella di Bufala Campana DOP (125g)',
    category: 'DAIRY',
    defaultUnit: 'buc',
    cuisine: 'ITALIAN',
    culturalTag: 'Caprese & Pizza',
    stores: {
      LIDL: { price: 8.49, qualityScore: 5, brandName: 'Italiamo Bufala' },
      KAUFLAND: { price: 8.99, qualityScore: 4, brandName: 'K-Favourites Bufala' },
      CARREFOUR: { price: 9.60, qualityScore: 5, brandName: 'Galbani Bufala' },
      MEGA_IMAGE: { price: 11.20, qualityScore: 5, brandName: 'Mandara Bufala' }
    }
  },
  {
    id: 'g-rosii-san-marzano',
    name: 'Roșii decojite San Marzano DOP la conservă (400g)',
    category: 'PANTRY',
    defaultUnit: 'buc',
    cuisine: 'ITALIAN',
    culturalTag: 'Sos Pizza & Pasta',
    stores: {
      KAUFLAND: { price: 6.49, qualityScore: 5, brandName: 'Mutti San Marzano' },
      CARREFOUR: { price: 6.99, qualityScore: 5, brandName: 'Cirio San Marzano' },
      MEGA_IMAGE: { price: 8.20, qualityScore: 5, brandName: 'Mutti Pelati' },
      LIDL: { price: 5.99, qualityScore: 4, brandName: 'Freshona Pelati' },
      AUCHAN: { price: 6.60, qualityScore: 4, brandName: 'Mutti Rosii' }
    }
  },
  {
    id: 'g-pesto-genovese',
    name: 'Sos Pesto alla Genovese cu Busuioc Proaspăt (190g)',
    category: 'PANTRY',
    defaultUnit: 'buc',
    cuisine: 'ITALIAN',
    culturalTag: 'Italian Autentic',
    stores: {
      PENNY: { price: 5.49, qualityScore: 4, brandName: 'San Fabio Pesto' },
      LIDL: { price: 5.99, qualityScore: 4, brandName: 'Baresa Pesto' },
      KAUFLAND: { price: 6.49, qualityScore: 4, brandName: 'K-Classic Pesto' },
      CARREFOUR: { price: 7.20, qualityScore: 5, brandName: 'Barilla Pesto Genovese' },
      MEGA_IMAGE: { price: 8.99, qualityScore: 5, brandName: 'Barilla Pesto' }
    }
  },

  // --- AMERICAN ESSENTIALS (🇺🇸 AMERICAN) ---
  {
    id: 'g-carne-angus-burger',
    name: 'Carne Tocată Vită Black Angus 15% grăsime (500g)',
    category: 'MEAT_FISH',
    defaultUnit: 'pachet',
    cuisine: 'AMERICAN',
    culturalTag: 'Smash Burger American',
    notes: 'Proportia perfecta 80/20 pentru burgeri suculenti la tigaie/gratar',
    stores: {
      LIDL: { price: 18.49, qualityScore: 5, brandName: 'Grill&Chill Black Angus' },
      KAUFLAND: { price: 18.99, qualityScore: 4, brandName: 'Purland Angus Burger' },
      CARREFOUR: { price: 20.50, qualityScore: 4, brandName: 'Carrefour Black Angus' },
      MEGA_IMAGE: { price: 23.50, qualityScore: 5, brandName: 'Mega Gourmet Angus' },
      PENNY: { price: 17.99, qualityScore: 4, brandName: 'Casa Gustului Vita' }
    }
  },
  {
    id: 'g-cheddar-burger',
    name: 'Brânză Cheddar Maturată Felii Speciale Burger (150g)',
    category: 'DAIRY',
    defaultUnit: 'pachet',
    cuisine: 'AMERICAN',
    culturalTag: 'Burger & Mac Cheese',
    stores: {
      PENNY: { price: 6.99, qualityScore: 4, brandName: 'Penny Cheddar' },
      LIDL: { price: 7.49, qualityScore: 5, brandName: 'Valley Spire Cheddar' },
      KAUFLAND: { price: 7.99, qualityScore: 4, brandName: 'K-Classic Cheddar' },
      CARREFOUR: { price: 8.49, qualityScore: 4, brandName: 'Carrefour Cheddar' },
      MEGA_IMAGE: { price: 9.80, qualityScore: 5, brandName: 'Cathedral City Cheddar' }
    }
  },
  {
    id: 'g-chifle-burger-brioche',
    name: 'Chifle Burger Brioche cu Unt & Susan (4 buc / 300g)',
    category: 'BAKERY',
    defaultUnit: 'pachet',
    cuisine: 'AMERICAN',
    culturalTag: 'Smash Burger',
    stores: {
      LIDL: { price: 5.49, qualityScore: 5, brandName: 'McEnnedy Brioche Buns' },
      KAUFLAND: { price: 5.99, qualityScore: 4, brandName: 'K-Classic Brioche Burger' },
      CARREFOUR: { price: 6.49, qualityScore: 4, brandName: 'Carrefour Burger Buns' },
      MEGA_IMAGE: { price: 7.20, qualityScore: 5, brandName: 'Harrys Brioche Buns' }
    }
  },
  {
    id: 'g-sos-bbq-smoked',
    name: 'Sos BBQ American Smoked Hickory (350ml)',
    category: 'PANTRY',
    defaultUnit: 'buc',
    cuisine: 'AMERICAN',
    culturalTag: 'BBQ American',
    stores: {
      PENNY: { price: 6.49, qualityScore: 4, brandName: 'Penny BBQ Smoked' },
      LIDL: { price: 6.99, qualityScore: 5, brandName: 'McEnnedy BBQ Sauce' },
      KAUFLAND: { price: 7.49, qualityScore: 4, brandName: 'Heinz Classic BBQ' },
      CARREFOUR: { price: 8.20, qualityScore: 4, brandName: "Bulls-Eye BBQ" },
      MEGA_IMAGE: { price: 9.50, qualityScore: 5, brandName: "Sweet Baby Ray's BBQ" }
    }
  },
  {
    id: 'g-bacon-american',
    name: 'Bacon Afumat Crocant felii subțiri (200g)',
    category: 'MEAT_FISH',
    defaultUnit: 'pachet',
    cuisine: 'AMERICAN',
    culturalTag: 'Mic Dejun & Burger',
    stores: {
      PENNY: { price: 7.49, qualityScore: 4, brandName: 'Penny Bacon Feliat' },
      LIDL: { price: 7.99, qualityScore: 5, brandName: 'Dulano Bacon Feliat' },
      KAUFLAND: { price: 8.49, qualityScore: 4, brandName: 'K-Classic Bacon' },
      CARREFOUR: { price: 8.99, qualityScore: 4, brandName: 'Carrefour Bacon' },
      MEGA_IMAGE: { price: 10.50, qualityScore: 5, brandName: 'Cris-Tim Bacon' }
    }
  },
  {
    id: 'g-sirop-artar-maple',
    name: 'Sirop de Arțar Canadian 100% Pur Grad A (250ml)',
    category: 'PANTRY',
    defaultUnit: 'buc',
    cuisine: 'AMERICAN',
    culturalTag: 'Clătite Americane Pancakes',
    stores: {
      LIDL: { price: 16.49, qualityScore: 5, brandName: 'McEnnedy Maple Syrup' },
      KAUFLAND: { price: 17.20, qualityScore: 4, brandName: 'K-Bio Sirop Artar' },
      CARREFOUR: { price: 18.50, qualityScore: 5, brandName: 'Carrefour Bio Artar' },
      MEGA_IMAGE: { price: 21.90, qualityScore: 5, brandName: 'Vertmont Maple' }
    }
  },

  // --- GERMAN ESSENTIALS (🇩🇪 GERMAN) ---
  {
    id: 'g-carnati-bratwurst',
    name: 'Cârnați Bratwurst Bavarezi de Porc (400g / 4 buc)',
    category: 'MEAT_FISH',
    defaultUnit: 'pachet',
    cuisine: 'GERMAN',
    culturalTag: 'Bavarez Tradițional',
    notes: 'Carnati clasici germani pentru prajit la tigaie sau gratar',
    stores: {
      PENNY: { price: 11.49, qualityScore: 4, brandName: 'Penny Bratwurst' },
      LIDL: { price: 11.99, qualityScore: 5, brandName: 'Dulano Rostbratwurst' },
      KAUFLAND: { price: 12.89, qualityScore: 4, brandName: 'K-Classic Bratwurst' },
      CARREFOUR: { price: 13.99, qualityScore: 4, brandName: 'Meica Bratwurst' },
      MEGA_IMAGE: { price: 15.50, qualityScore: 5, brandName: 'Gourmet Bratwurst' }
    }
  },
  {
    id: 'g-varza-acra-sauerkraut',
    name: 'Varză Acră Călită Tradițională Sauerkraut (500g)',
    category: 'PANTRY',
    defaultUnit: 'buc',
    cuisine: 'GERMAN',
    culturalTag: 'German Tradițional',
    stores: {
      PENNY: { price: 3.79, qualityScore: 4, brandName: 'Penny Sauerkraut' },
      LIDL: { price: 3.99, qualityScore: 5, brandName: 'Freshona Sauerkraut' },
      KAUFLAND: { price: 4.29, qualityScore: 4, brandName: 'K-Classic Varza Acra' },
      CARREFOUR: { price: 4.69, qualityScore: 4, brandName: 'Hengstenberg Sauerkraut' },
      AUCHAN: { price: 3.95, qualityScore: 4, brandName: 'Auchan Varza' }
    }
  },
  {
    id: 'g-mustar-bavarez',
    name: 'Muștar Dulce Bavarez cu Boabe (250g)',
    category: 'PANTRY',
    defaultUnit: 'buc',
    cuisine: 'GERMAN',
    culturalTag: 'Bavarez Tradițional',
    stores: {
      LIDL: { price: 4.49, qualityScore: 5, brandName: 'Alpenfest Bayerischer Senf' },
      KAUFLAND: { price: 4.99, qualityScore: 4, brandName: 'K-Classic Mustar Dulce' },
      CARREFOUR: { price: 5.60, qualityScore: 4, brandName: 'Develey Mustar' },
      MEGA_IMAGE: { price: 6.50, qualityScore: 5, brandName: 'Handlmaier Mustar' }
    }
  },
  {
    id: 'g-snitel-porc-calitate',
    name: 'Cotlet Porc Fraged Feliat Subțire pentru Șnițel (500g)',
    category: 'MEAT_FISH',
    defaultUnit: 'pachet',
    cuisine: 'GERMAN',
    culturalTag: 'Schnitzel Fest',
    stores: {
      PENNY: { price: 13.49, qualityScore: 4, brandName: 'Casa Gustului Porc' },
      LIDL: { price: 14.29, qualityScore: 5, brandName: 'Lidl Macelarie Porc' },
      KAUFLAND: { price: 14.89, qualityScore: 4, brandName: 'Purland Cotlet Porc' },
      CARREFOUR: { price: 15.50, qualityScore: 4, brandName: 'Carrefour Porc' },
      MEGA_IMAGE: { price: 17.50, qualityScore: 5, brandName: 'Mega Carne Proaspata' }
    }
  },
  {
    id: 'g-covrigi-brezel',
    name: 'Covrigi Bavarezi Congelați Brezel cu Sare Mare (4 buc)',
    category: 'BAKERY',
    defaultUnit: 'pachet',
    cuisine: 'GERMAN',
    culturalTag: 'Brezel Bavarez',
    stores: {
      LIDL: { price: 6.49, qualityScore: 5, brandName: 'Alpenfest Brezel' },
      KAUFLAND: { price: 6.99, qualityScore: 4, brandName: 'K-Classic Brezel' },
      MEGA_IMAGE: { price: 8.50, qualityScore: 5, brandName: 'Ditsch Brezel' }
    }
  },

  // --- ROMANIAN ESSENTIALS (🇷🇴 ROMANIAN) ---
  {
    id: 'g-telemea-vaca-saramura',
    name: 'Telemea de Vacă în Saramură (400g)',
    category: 'DAIRY',
    defaultUnit: 'buc',
    cuisine: 'ROMANIAN',
    culturalTag: 'Tradițional Românesc',
    notes: 'Telemea aromata cu sare perfecta pentru mamaliguta si salate',
    stores: {
      LIDL: { price: 12.99, qualityScore: 5, brandName: 'Pilos Telemea Vaca' },
      KAUFLAND: { price: 13.49, qualityScore: 4, brandName: 'Vreau din Romania Telemea' },
      PENNY: { price: 11.99, qualityScore: 4, brandName: 'Boni Telemea' },
      CARREFOUR: { price: 14.20, qualityScore: 4, brandName: 'Hochland / Carrefour' },
      MEGA_IMAGE: { price: 15.99, qualityScore: 5, brandName: 'Gusturi Romanesti Telemea' },
      AUCHAN: { price: 13.10, qualityScore: 4, brandName: 'Auchan Telemea' }
    }
  },
  {
    id: 'g-smantana-20',
    name: 'Smântână Românească 20% grăsime (400g / 850g)',
    category: 'DAIRY',
    defaultUnit: 'buc',
    cuisine: 'ROMANIAN',
    culturalTag: 'Tradițional Românesc',
    stores: {
      LIDL: { price: 5.99, qualityScore: 5, brandName: 'Pilos Smantana 20%' },
      PENNY: { price: 5.69, qualityScore: 4, brandName: 'Boni Smantana 20%' },
      KAUFLAND: { price: 6.29, qualityScore: 4, brandName: 'K-Classic Smantana' },
      CARREFOUR: { price: 6.79, qualityScore: 4, brandName: 'Carrefour Simpl' },
      MEGA_IMAGE: { price: 7.99, qualityScore: 5, brandName: 'Gusturi Romanesti Smantana' },
      AUCHAN: { price: 6.10, qualityScore: 4, brandName: 'Auchan Smantana' }
    }
  },
  {
    id: 'g-malai-superior',
    name: 'Mălai Extra Superior Degerminat (1kg)',
    category: 'PANTRY',
    defaultUnit: 'kg',
    cuisine: 'ROMANIAN',
    culturalTag: 'Mămăliguță Tradițională',
    stores: {
      PENNY: { price: 3.19, qualityScore: 4, brandName: 'Penny Malai' },
      LIDL: { price: 3.29, qualityScore: 4, brandName: 'Castello Malai Extra' },
      KAUFLAND: { price: 3.49, qualityScore: 4, brandName: 'K-Classic Malai' },
      CARREFOUR: { price: 3.89, qualityScore: 4, brandName: 'Baneasa Malai Extra' },
      MEGA_IMAGE: { price: 4.49, qualityScore: 5, brandName: 'Baneasa / Gusturi Romanesti' },
      AUCHAN: { price: 3.39, qualityScore: 4, brandName: 'Auchan Malai' }
    }
  },
  {
    id: 'g-bors-proaspat',
    name: 'Borș Tradițional de Putină cu Leuștean (1L)',
    category: 'PANTRY',
    defaultUnit: 'L',
    cuisine: 'ROMANIAN',
    culturalTag: 'Ciorbe Tradiționale',
    stores: {
      PENNY: { price: 2.79, qualityScore: 4, brandName: 'Bors Magic Putin' },
      LIDL: { price: 2.89, qualityScore: 4, brandName: 'Camara Noastra Bors' },
      KAUFLAND: { price: 2.99, qualityScore: 4, brandName: 'Vreau din Romania Bors' },
      CARREFOUR: { price: 3.29, qualityScore: 4, brandName: 'Bors Olimpia' },
      MEGA_IMAGE: { price: 3.89, qualityScore: 5, brandName: 'Gusturi Romanesti Bors' },
      AUCHAN: { price: 2.95, qualityScore: 4, brandName: 'Auchan Bors' }
    }
  },
  {
    id: 'g-muraturi-asortate',
    name: 'Gogonele & Murături Asortate Tradiționale (800g)',
    category: 'PANTRY',
    defaultUnit: 'buc',
    cuisine: 'ROMANIAN',
    culturalTag: 'Tradițional Românesc',
    stores: {
      LIDL: { price: 7.49, qualityScore: 5, brandName: 'Camara Noastra Muraturi' },
      KAUFLAND: { price: 7.99, qualityScore: 4, brandName: 'Vreau din Romania Gogonele' },
      PENNY: { price: 6.99, qualityScore: 4, brandName: 'Casa Gustului Muraturi' },
      CARREFOUR: { price: 8.50, qualityScore: 4, brandName: 'Carrefour Muraturi' },
      MEGA_IMAGE: { price: 9.99, qualityScore: 5, brandName: 'Gusturi Romanesti' }
    }
  },

  // --- UNIVERSAL STAPLES ---
  {
    id: 'g-piept-pui',
    name: 'Piept de Pui Dezosat fără Piele (1kg)',
    category: 'MEAT_FISH',
    defaultUnit: 'kg',
    cuisine: 'UNIVERSAL',
    stores: {
      PENNY: { price: 23.49, qualityScore: 4, brandName: 'Casa Gustului Pui' },
      LIDL: { price: 23.99, qualityScore: 5, brandName: 'Lidl Carne Proaspata' },
      KAUFLAND: { price: 24.49, qualityScore: 4, brandName: 'Purland Pui' },
      CARREFOUR: { price: 25.50, qualityScore: 4, brandName: 'Carrefour Macelarie' },
      AUCHAN: { price: 24.20, qualityScore: 4, brandName: 'Auchan Pui' },
      MEGA_IMAGE: { price: 27.99, qualityScore: 5, brandName: 'Avicola Pui' }
    }
  },
  {
    id: 'g-lapte-35',
    name: 'Lapte Proaspăt 3.5% grăsime (1L)',
    category: 'DAIRY',
    defaultUnit: 'L',
    cuisine: 'UNIVERSAL',
    stores: {
      LIDL: { price: 4.69, qualityScore: 5, brandName: 'Pilos Lapte 3.5%' },
      PENNY: { price: 4.59, qualityScore: 4, brandName: 'Boni Lapte 3.5%' },
      KAUFLAND: { price: 4.79, qualityScore: 4, brandName: 'K-Classic Lapte' },
      CARREFOUR: { price: 5.19, qualityScore: 4, brandName: 'Carrefour Lapte' },
      AUCHAN: { price: 4.75, qualityScore: 4, brandName: 'Auchan Lapte' },
      MEGA_IMAGE: { price: 5.89, qualityScore: 5, brandName: 'Mega Image Lapte' }
    }
  },
  {
    id: 'g-oua-30',
    name: 'Ouă Proaspete Mărimea M/L (Cofraj 30 bucăți)',
    category: 'DAIRY',
    defaultUnit: 'pachet',
    cuisine: 'UNIVERSAL',
    stores: {
      PENNY: { price: 20.99, qualityScore: 4, brandName: 'Boni Oua M30' },
      LIDL: { price: 21.49, qualityScore: 5, brandName: 'Lidl Oua Proaspete 30buc' },
      KAUFLAND: { price: 21.99, qualityScore: 4, brandName: 'K-Classic Oua 30buc' },
      CARREFOUR: { price: 23.50, qualityScore: 4, brandName: 'Carrefour Oua 30buc' },
      AUCHAN: { price: 21.80, qualityScore: 4, brandName: 'Auchan Oua 30buc' },
      MEGA_IMAGE: { price: 26.99, qualityScore: 5, brandName: 'Mega Image Oua M30' }
    }
  },
  {
    id: 'g-ulei-masline-extra',
    name: 'Ulei de Măsline Extra Virgin Presat la Rece (1L)',
    category: 'PANTRY',
    defaultUnit: 'L',
    cuisine: 'UNIVERSAL',
    stores: {
      LIDL: { price: 34.99, qualityScore: 5, brandName: 'Primadonna Extra Virgin' },
      PENNY: { price: 33.99, qualityScore: 4, brandName: 'San Fabio Ulei Masline' },
      KAUFLAND: { price: 36.99, qualityScore: 4, brandName: 'K-Bio Ulei Masline' },
      CARREFOUR: { price: 38.50, qualityScore: 4, brandName: 'Carrefour Extra Virgin' },
      AUCHAN: { price: 35.90, qualityScore: 4, brandName: 'Auchan Extra Virgin' },
      MEGA_IMAGE: { price: 42.99, qualityScore: 5, brandName: 'Monini Extra Virgin' }
    }
  },
  {
    id: 'g-rosii-cherry',
    name: 'Roșii Cherry Ciorchine Dulci (500g)',
    category: 'FRUITS_VEGGIES',
    defaultUnit: 'buc',
    cuisine: 'UNIVERSAL',
    stores: {
      LIDL: { price: 6.49, qualityScore: 5, brandName: 'Piata Lidl Rosii Cherry' },
      PENNY: { price: 6.29, qualityScore: 4, brandName: 'Penny Rosii Cherry' },
      KAUFLAND: { price: 6.99, qualityScore: 4, brandName: 'Kaufland Rosii Ciorchine' },
      CARREFOUR: { price: 7.49, qualityScore: 4, brandName: 'Carrefour Legume' },
      AUCHAN: { price: 6.80, qualityScore: 4, brandName: 'Auchan Rosii' },
      MEGA_IMAGE: { price: 8.99, qualityScore: 5, brandName: 'Mega Gusturi Romanesti' }
    }
  },
  {
    id: 'g-banane',
    name: 'Banane Premium Proaspete (1kg)',
    category: 'FRUITS_VEGGIES',
    defaultUnit: 'kg',
    cuisine: 'UNIVERSAL',
    stores: {
      LIDL: { price: 6.49, qualityScore: 5, brandName: 'Lidl Banane' },
      PENNY: { price: 6.29, qualityScore: 4, brandName: 'Penny Banane' },
      KAUFLAND: { price: 6.59, qualityScore: 4, brandName: 'Kaufland Banane' },
      CARREFOUR: { price: 6.99, qualityScore: 4, brandName: 'Carrefour Banane' },
      AUCHAN: { price: 6.45, qualityScore: 4, brandName: 'Auchan Banane' },
      MEGA_IMAGE: { price: 7.49, qualityScore: 5, brandName: 'Mega Banane' }
    }
  },
  {
    id: 'g-iaurt-grecesc',
    name: 'Iaurt Grecesc Autentic 10% grăsime (400g / 1kg)',
    category: 'DAIRY',
    defaultUnit: 'buc',
    cuisine: 'UNIVERSAL',
    stores: {
      LIDL: { price: 4.49, qualityScore: 5, brandName: 'Pilos Iaurt Grecesc 10%' },
      PENNY: { price: 4.29, qualityScore: 4, brandName: 'San Fabio Iaurt Grecesc' },
      KAUFLAND: { price: 4.69, qualityScore: 4, brandName: 'K-Classic Iaurt Grecesc' },
      CARREFOUR: { price: 5.19, qualityScore: 4, brandName: 'Olympus Iaurt Grecesc' },
      MEGA_IMAGE: { price: 5.99, qualityScore: 5, brandName: 'Kolios / Olympus' }
    }
  },
  {
    id: 'g-paine-toast-secara',
    name: 'Pâine Toast Integrală de Secară (500g)',
    category: 'BAKERY',
    defaultUnit: 'buc',
    cuisine: 'UNIVERSAL',
    stores: {
      LIDL: { price: 4.29, qualityScore: 5, brandName: 'Tastino Toast Secara' },
      PENNY: { price: 3.99, qualityScore: 4, brandName: 'Penny Toast Integral' },
      KAUFLAND: { price: 4.49, qualityScore: 4, brandName: 'K-Classic Toast' },
      CARREFOUR: { price: 4.89, qualityScore: 4, brandName: 'Carrefour Toast' },
      MEGA_IMAGE: { price: 5.49, qualityScore: 5, brandName: 'Toast Toast Secar' }
    }
  }
];

export interface GroceryQuickBundle {
  id: string;
  titleRo: string;
  titleEn: string;
  icon: string;
  cuisine: GroceryCuisineType;
  badgeRo: string;
  descriptionRo: string;
  descriptionEn: string;
  items: { catalogId: string; quantity: number }[];
}

export const QUICK_BUNDLES: GroceryQuickBundle[] = [
  // 1. Spanish Paella & Tapas
  {
    id: 'bundle-spanish-paella',
    titleRo: 'Ospăț Spaniol: Paella cu Fructe de Mare & Tapas',
    titleEn: 'Spanish Feast: Paella Seafood & Tapas Night',
    icon: '🥘',
    cuisine: 'SPANISH',
    badgeRo: 'Bucătărie Spaniolă',
    descriptionRo: 'Orez bomba, chorizo spaniol, jamón serrano, creveți, șofran pur și măsline',
    descriptionEn: 'Bomba paella rice, Spanish chorizo, jamón serrano, tiger prawns & saffron',
    items: [
      { catalogId: 'g-orez-bomba-paella', quantity: 1 },
      { catalogId: 'g-chorizo-spaniol', quantity: 1 },
      { catalogId: 'g-jamon-serrano', quantity: 1 },
      { catalogId: 'g-creveti-decorticati', quantity: 1 },
      { catalogId: 'g-sofran-pur', quantity: 1 },
      { catalogId: 'g-boia-afumata-pimenton', quantity: 1 },
      { catalogId: 'g-ulei-masline-extra', quantity: 1 }
    ]
  },

  // 2. Italian Carbonara & Caprese Feast
  {
    id: 'bundle-italian-carbonara',
    titleRo: 'Cina Italiană: Autentică Carbonara & Caprese',
    titleEn: 'Italian Night: Authentic Carbonara & Caprese',
    icon: '🍝',
    cuisine: 'ITALIAN',
    badgeRo: 'Bucătărie Italiană',
    descriptionRo: 'Spaghetti Barilla, Guanciale crocant, Parmigiano Reggiano 24 luni, Mozzarella di Bufala și ouă proaspete',
    descriptionEn: 'Spaghetti, crispy Guanciale, aged Parmigiano Reggiano, Mozzarella di Bufala & fresh eggs',
    items: [
      { catalogId: 'g-spaghetti-bronzo', quantity: 1 },
      { catalogId: 'g-guanciale-pancetta', quantity: 1 },
      { catalogId: 'g-parmigiano-reggiano', quantity: 1 },
      { catalogId: 'g-mozzarella-bufala', quantity: 1 },
      { catalogId: 'g-rosii-cherry', quantity: 1 },
      { catalogId: 'g-oua-30', quantity: 1 }
    ]
  },

  // 3. American Smash Burger & BBQ Feast
  {
    id: 'bundle-american-bbq',
    titleRo: 'American Feast: Smash Burger Angus & BBQ Smoked',
    titleEn: 'American Feast: Angus Smash Burger & Smoked BBQ',
    icon: '🍔',
    cuisine: 'AMERICAN',
    badgeRo: 'Bucătărie Americană',
    descriptionRo: 'Carne tocată vită Angus, chifle brioche cu susan, cheddar maturat, bacon crocant și sos BBQ smoked',
    descriptionEn: 'Black Angus ground beef, brioche burger buns, aged cheddar, crispy bacon & hickory BBQ',
    items: [
      { catalogId: 'g-carne-angus-burger', quantity: 1 },
      { catalogId: 'g-chifle-burger-brioche', quantity: 1 },
      { catalogId: 'g-cheddar-burger', quantity: 1 },
      { catalogId: 'g-bacon-american', quantity: 1 },
      { catalogId: 'g-sos-bbq-smoked', quantity: 1 },
      { catalogId: 'g-rosii-cherry', quantity: 1 }
    ]
  },

  // 4. German Bavarian Bratwurst & Schnitzel Dinner
  {
    id: 'bundle-german-bratwurst',
    titleRo: 'Bavarian Dinner: Bratwurst, Sauerkraut & Schnitzel',
    titleEn: 'German Dinner: Bratwurst, Sauerkraut & Schnitzel',
    icon: '🥨',
    cuisine: 'GERMAN',
    badgeRo: 'Bucătărie Germană',
    descriptionRo: 'Cârnați bratwurst bavarezi, varză acră călită sauerkraut, muștar dulce cu boabe, cotlet șnițel și brezel',
    descriptionEn: 'Bavarian pork bratwurst, authentic sauerkraut, sweet whole-grain mustard, schnitzel cutlets & pretzels',
    items: [
      { catalogId: 'g-carnati-bratwurst', quantity: 1 },
      { catalogId: 'g-varza-acra-sauerkraut', quantity: 1 },
      { catalogId: 'g-mustar-bavarez', quantity: 1 },
      { catalogId: 'g-snitel-porc-calitate', quantity: 1 },
      { catalogId: 'g-covrigi-brezel', quantity: 1 }
    ]
  },

  // 5. Moroccan Tagine & Couscous
  {
    id: 'bundle-moroccan-tagine',
    titleRo: 'Cina Tradițională Marocană (Tagine & Couscous)',
    titleEn: 'Moroccan Tagine & Couscous Night',
    icon: '🇲🇦',
    cuisine: 'MOROCCAN',
    badgeRo: 'Bucătărie Marocană',
    descriptionRo: 'Pulpă de vită fragedă, couscous fin, năut fiert, pastă harissa, măsline marinate și ceai verde cu mentă',
    descriptionEn: 'Tender beef cutlets, fine couscous, chickpeas, harissa spice paste, marinated olives & mint tea',
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

  // 6. Romanian Traditional Feast
  {
    id: 'bundle-romanian-feast',
    titleRo: 'Ospăț Tradițional Românesc (Mămăliguță & Ciorbă)',
    titleEn: 'Traditional Romanian Family Feast',
    icon: '🇷🇴',
    cuisine: 'ROMANIAN',
    badgeRo: 'Bucătărie Românească',
    descriptionRo: 'Mălai auriu, telemea de vacă în saramură, smântână 20%, borș proaspăt de putină, piept de pui și murături',
    descriptionEn: 'Polenta cornmeal, salted telemea cheese, sour cream, bors soup base, chicken and pickled vegetables',
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

  // 7. Weekly Essentials
  {
    id: 'bundle-weekly-basics',
    titleRo: 'Coșul Esențial Economic de Bază',
    titleEn: 'Weekly Essentials Basket',
    icon: '🧺',
    cuisine: 'UNIVERSAL',
    badgeRo: 'Preț Minim',
    descriptionRo: 'Lapte 3.5%, ouă 30 buc, piept de pui, roșii cherry, banane, iaurt grecesc și pâine integrală',
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

export const DEFAULT_SAVED_RECIPES: SavedRecipeReel[] = [
  {
    id: 'recipe-reel-spanish-paella',
    title: 'Paella Spaniolă Tradițională cu Fructe de Mare & Chorizo',
    videoUrl: 'https://www.instagram.com/reels/spanish_authentic_paella',
    cuisine: 'SPANISH',
    description: 'Cea mai gustoasă rețetă de Paella din Valencia cu orez bomba, creveți fragezi, chorizo afumat și șofran natural.',
    servings: 4,
    prepTimeMinutes: 40,
    totalEstimatedCost: 69.45,
    cheapestStoreId: 'LIDL',
    instructionsSummary: '1. Se călește chorizo și creveții în ulei de măsline. 2. Se adaugă orezul bomba și șofranul infuzat. 3. Se toarnă supa și se lasă 20 min la foc mic până se formează socarrat.',
    createdAt: new Date().toISOString(),
    ingredients: [
      { name: 'Orez Bomba Spaniol', quantity: 1, unit: 'kg', matchedCatalogId: 'g-orez-bomba-paella', suggestedStoreId: 'LIDL', estimatedPrice: 12.99 },
      { name: 'Chorizo Spaniol Tradițional', quantity: 1, unit: 'buc', matchedCatalogId: 'g-chorizo-spaniol', suggestedStoreId: 'PENNY', estimatedPrice: 8.99 },
      { name: 'Creveți Decorticați Black Tiger', quantity: 1, unit: 'pachet', matchedCatalogId: 'g-creveti-decorticati', suggestedStoreId: 'PENNY', estimatedPrice: 23.49 },
      { name: 'Șofran Spaniol Firicele', quantity: 1, unit: 'buc', matchedCatalogId: 'g-sofran-pur', suggestedStoreId: 'AUCHAN', estimatedPrice: 17.50 },
      { name: 'Boia Dulce Afumată Pimentón', quantity: 1, unit: 'buc', matchedCatalogId: 'g-boia-afumata-pimenton', suggestedStoreId: 'KAUFLAND', estimatedPrice: 6.48 }
    ]
  },
  {
    id: 'recipe-reel-italian-carbonara',
    title: 'Pasta Carbonara Tradițională Romană (Fără Smântână)',
    videoUrl: 'https://www.instagram.com/reels/authentic_roman_carbonara',
    cuisine: 'ITALIAN',
    description: 'Rețeta originală din Roma: Guanciale crocant, gălbenușuri cremoase, piper negru proaspăt măcinat și mult Parmigiano Reggiano.',
    servings: 2,
    prepTimeMinutes: 20,
    totalEstimatedCost: 53.96,
    cheapestStoreId: 'LIDL',
    instructionsSummary: '1. Rumenește guanciale fără ulei până devine crocant. 2. Bate gălbenușurile cu parmigiano ras și mult piper. 3. Amestecă pastele fierbinți cu guanciale și crema de ou pe foc stins.',
    createdAt: new Date().toISOString(),
    ingredients: [
      { name: 'Spaghetti Barilla n.5', quantity: 1, unit: 'pachet', matchedCatalogId: 'g-spaghetti-bronzo', suggestedStoreId: 'PENNY', estimatedPrice: 4.69 },
      { name: 'Guanciale Italian feliat', quantity: 1, unit: 'pachet', matchedCatalogId: 'g-guanciale-pancetta', suggestedStoreId: 'LIDL', estimatedPrice: 10.99 },
      { name: 'Parmigiano Reggiano 24 luni', quantity: 1, unit: 'buc', matchedCatalogId: 'g-parmigiano-reggiano', suggestedStoreId: 'LIDL', estimatedPrice: 16.49 },
      { name: 'Ouă proaspete (Cofraj 30)', quantity: 1, unit: 'pachet', matchedCatalogId: 'g-oua-30', suggestedStoreId: 'PENNY', estimatedPrice: 20.99 },
      { name: 'Piper negru măcinat', quantity: 1, unit: 'buc', estimatedPrice: 0.80 }
    ]
  },
  {
    id: 'recipe-reel-american-smash-burger',
    title: 'Double Smash Burger American cu Bacon & Cheddar Topit',
    videoUrl: 'https://www.tiktok.com/@chef/video/double_smash_burger_recipe',
    cuisine: 'AMERICAN',
    description: 'Chiftele subțiri de vită Angus strivite pe tigaia încinsă cu crustă crocantă, cheddar topit, bacon și chifle brioche.',
    servings: 4,
    prepTimeMinutes: 25,
    totalEstimatedCost: 44.89,
    cheapestStoreId: 'LIDL',
    instructionsSummary: '1. Formează bile de carne de 80g și strivește-le pe plita foarte încinsă. 2. Pune feliile de cheddar să se topească 1 minut. 3. Toast-uiește chiflele brioche și asamblează cu sos BBQ și bacon.',
    createdAt: new Date().toISOString(),
    ingredients: [
      { name: 'Carne tocată vită Black Angus', quantity: 1, unit: 'pachet', matchedCatalogId: 'g-carne-angus-burger', suggestedStoreId: 'PENNY', estimatedPrice: 17.99 },
      { name: 'Chifle Burger Brioche cu unt', quantity: 1, unit: 'pachet', matchedCatalogId: 'g-chifle-burger-brioche', suggestedStoreId: 'LIDL', estimatedPrice: 5.49 },
      { name: 'Brânză Cheddar maturată felii', quantity: 1, unit: 'pachet', matchedCatalogId: 'g-cheddar-burger', suggestedStoreId: 'PENNY', estimatedPrice: 6.99 },
      { name: 'Bacon afumat crocant', quantity: 1, unit: 'pachet', matchedCatalogId: 'g-bacon-american', suggestedStoreId: 'PENNY', estimatedPrice: 7.49 },
      { name: 'Sos BBQ Smoked Hickory', quantity: 1, unit: 'buc', matchedCatalogId: 'g-sos-bbq-smoked', suggestedStoreId: 'PENNY', estimatedPrice: 6.49 }
    ]
  },
  {
    id: 'recipe-reel-german-bratwurst',
    title: 'Cârnați Bratwurst Bavarezi cu Varză Călită Sauerkraut & Brezel',
    videoUrl: 'https://www.youtube.com/shorts/german_bavarian_bratwurst',
    cuisine: 'GERMAN',
    description: 'Prânz tradițional münchenez cu cârnați bratwurst suculenți, varză acră aromatizată, muștar dulce și covrigi bavarezi.',
    servings: 2,
    prepTimeMinutes: 25,
    totalEstimatedCost: 30.75,
    cheapestStoreId: 'LIDL',
    instructionsSummary: '1. Călește cârnații bratwurst la foc mediu până capătă culoare aurie. 2. Încălzește varza sauerkraut cu semințe de chimen. 3. Servește fierbinte alături de muștar dulce bavarez și covrig brezel cald.',
    createdAt: new Date().toISOString(),
    ingredients: [
      { name: 'Cârnați Bratwurst Bavarezi', quantity: 1, unit: 'pachet', matchedCatalogId: 'g-carnati-bratwurst', suggestedStoreId: 'PENNY', estimatedPrice: 11.49 },
      { name: 'Varză acră Sauerkraut', quantity: 1, unit: 'buc', matchedCatalogId: 'g-varza-acra-sauerkraut', suggestedStoreId: 'PENNY', estimatedPrice: 3.79 },
      { name: 'Muștar dulce bavarez', quantity: 1, unit: 'buc', matchedCatalogId: 'g-mustar-bavarez', suggestedStoreId: 'LIDL', estimatedPrice: 4.49 },
      { name: 'Covrigi bavarezi Brezel', quantity: 1, unit: 'pachet', matchedCatalogId: 'g-covrigi-brezel', suggestedStoreId: 'LIDL', estimatedPrice: 6.49 },
      { name: 'Unt pentru rumenit', quantity: 1, unit: 'buc', estimatedPrice: 4.49 }
    ]
  },
  {
    id: 'recipe-reel-moroccan-tagine',
    title: 'Tajine Marocan de Vită cu Prune Caramelizate & Couscous',
    videoUrl: 'https://www.instagram.com/reels/moroccan_beef_tajine_authentic',
    cuisine: 'MOROCCAN',
    description: 'Capodopera bucătăriei marocane: Vită fragedă gătită lent cu ceapă, scorțișoară, ghimbir, prune dulci și migdale crocante.',
    servings: 4,
    prepTimeMinutes: 60,
    totalEstimatedCost: 63.85,
    cheapestStoreId: 'PENNY',
    instructionsSummary: '1. Marinează carnea cu ghimbir, șofran, scorțișoară și ulei de măsline. 2. Gătește la foc mic în vasul de tajine 45 min. 3. Adaugă prunele caramelizate cu miere și servește pe pat de couscous cald.',
    createdAt: new Date().toISOString(),
    ingredients: [
      { name: 'Pulpă de vită fragedă', quantity: 1, unit: 'kg', matchedCatalogId: 'g-carne-vita-tagine', suggestedStoreId: 'PENNY', estimatedPrice: 37.99 },
      { name: 'Couscous Tradițional Mediu', quantity: 1, unit: 'pachet', matchedCatalogId: 'g-couscous-500g', suggestedStoreId: 'LIDL', estimatedPrice: 5.49 },
      { name: 'Năut boabe fiert', quantity: 1, unit: 'buc', matchedCatalogId: 'g-naut-conserva', suggestedStoreId: 'PENNY', estimatedPrice: 3.39 },
      { name: 'Harissa & mirodenii tajine', quantity: 1, unit: 'buc', matchedCatalogId: 'g-harissa-mirodenii', suggestedStoreId: 'LIDL', estimatedPrice: 6.99 },
      { name: 'Ulei de măsline Extra Virgin', quantity: 1, unit: 'L', matchedCatalogId: 'g-ulei-masline-extra', suggestedStoreId: 'PENNY', estimatedPrice: 9.99 }
    ]
  }
];

export const DEFAULT_SHOPPING_LIST: ShoppingListItem[] = [
  {
    id: 'item-1',
    catalogItemId: 'g-lapte-35',
    name: 'Lapte Proaspăt 3.5%',
    category: 'DAIRY',
    quantity: 2,
    unit: 'L',
    isChecked: false
  },
  {
    id: 'item-2',
    catalogItemId: 'g-couscous-500g',
    name: 'Couscous Tradițional Mediu (500g)',
    category: 'PANTRY',
    quantity: 1,
    unit: 'pachet',
    isChecked: false
  },
  {
    id: 'item-3',
    catalogItemId: 'g-piept-pui',
    name: 'Piept de Pui Dezosat',
    category: 'MEAT_FISH',
    quantity: 1.5,
    unit: 'kg',
    isChecked: false
  },
  {
    id: 'item-4',
    catalogItemId: 'g-telemea-vaca-saramura',
    name: 'Telemea de Vacă în Saramură',
    category: 'DAIRY',
    quantity: 1,
    unit: 'buc',
    isChecked: false
  },
  {
    id: 'item-5',
    catalogItemId: 'g-malai-superior',
    name: 'Mălai Extra Superior',
    category: 'PANTRY',
    quantity: 1,
    unit: 'kg',
    isChecked: false
  },
  {
    id: 'item-6',
    catalogItemId: 'g-oua-30',
    name: 'Ouă Proaspete M30',
    category: 'DAIRY',
    quantity: 1,
    unit: 'pachet',
    isChecked: false
  }
];
