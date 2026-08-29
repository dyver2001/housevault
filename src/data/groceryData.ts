import {
  SupermarketId,
  GroceryCatalogItem,
  ShoppingListItem,
  GroceryCategory,
  GroceryCuisineType,
  SavedRecipeReel,
  ReceiptPurchaseRecord
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
    specialtyRo: 'Raport calitate/preț imbatabil la lactate (Pilos), brutărie și marcă proprie',
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
    specialtyRo: 'Carne proaspătă (Vreau din România), legume/fructe și varietate uriașă',
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
    specialtyRo: 'Gamă completă, sector internațional/Bio generos, mezeluri și promoții',
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
    specialtyRo: 'Gusturi Românești, produse gourmet, delicatese și Bio de top',
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
    specialtyRo: 'Discounter economic, prețuri minime la alimente esențiale de bază',
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
    specialtyRo: 'Cumpărături mari de volum, baxuri, detergenți și condimente',
    specialtyEn: 'Bulk packaging, household essentials & international spices'
  }
];

export const GROCERY_CATEGORIES_CONFIG: Record<
  GroceryCategory,
  { labelRo: string; labelEn: string; icon: string; color: string }
> = {
  DAIRY: { labelRo: 'Lactate & Ouă', labelEn: 'Dairy & Eggs', icon: '🥛', color: 'text-blue-400' },
  MEAT_FISH: { labelRo: 'Carne & Pește', labelEn: 'Meat & Fish', icon: '🥩', color: 'text-red-400' },
  FRUITS_VEGGIES: { labelRo: 'Fructe & Legume', labelEn: 'Produce & Veggies', icon: '🥦', color: 'text-emerald-400' },
  BAKERY: { labelRo: 'Pâine & Brutărie', labelEn: 'Bakery & Bread', icon: '🍞', color: 'text-amber-400' },
  PANTRY: { labelRo: 'Cămară & Uleiuri', labelEn: 'Pantry & Oils', icon: '🥫', color: 'text-yellow-400' },
  CLEANING: { labelRo: 'Curățenie & Menaj', labelEn: 'Cleaning & Home', icon: '🧼', color: 'text-cyan-400' },
  BEVERAGES: { labelRo: 'Băuturi & Sucuri', labelEn: 'Beverages & Drinks', icon: '🧃', color: 'text-teal-400' },
  SNACKS: { labelRo: 'Snacks & Dulciuri', labelEn: 'Snacks & Sweets', icon: '🍫', color: 'text-pink-400' }
};

export const DEFAULT_GROCERY_CATALOG: GroceryCatalogItem[] = [
  // --- MOROCCAN ESSENTIALS (🇲🇦) ---
  {
    id: 'g-couscous-500g',
    name: 'Couscous Tradițional Dari Mediu (1kg)',
    category: 'PANTRY',
    defaultUnit: 'kg',
    cuisine: 'MOROCCAN',
    culturalTag: 'Marocan Tradițional',
    stores: {
      LIDL: { price: 5.49, qualityScore: 5, brandName: '1001 Delights Couscous' },
      CARREFOUR: { price: 5.89, qualityScore: 5, brandName: 'Dari Maroc' },
      PENNY: { price: 5.79, qualityScore: 4, brandName: 'San Fabio Couscous' },
      KAUFLAND: { price: 6.29, qualityScore: 4, brandName: 'K-Classic Couscous' },
      AUCHAN: { price: 5.65, qualityScore: 4, brandName: 'Auchan Oriental' },
      MEGA_IMAGE: { price: 7.19, qualityScore: 5, brandName: 'Dari Maroc' }
    }
  },
  {
    id: 'g-carne-vita-tagine',
    name: 'Pulpă de Vită Fragedă pentru Tajine & Couscous (1kg)',
    category: 'MEAT_FISH',
    defaultUnit: 'kg',
    cuisine: 'MOROCCAN',
    culturalTag: 'Marocan Tradițional',
    stores: {
      PENNY: { price: 37.99, qualityScore: 4, brandName: 'Casa Gustului Vită' },
      KAUFLAND: { price: 38.99, qualityScore: 5, brandName: 'Purland Vită' },
      LIDL: { price: 39.99, qualityScore: 4, brandName: 'Lidl Proaspăt' },
      AUCHAN: { price: 39.50, qualityScore: 4, brandName: 'Auchan Măcelărie' },
      CARREFOUR: { price: 41.50, qualityScore: 5, brandName: 'Filiera Calității Carrefour' },
      MEGA_IMAGE: { price: 46.99, qualityScore: 5, brandName: 'Gourmet Vită Fragedă' }
    }
  },
  {
    id: 'g-prune-uscate-tajine',
    name: 'Prune Uscate Dulci fără Sâmburi (300g)',
    category: 'PANTRY',
    defaultUnit: 'pachet',
    cuisine: 'MOROCCAN',
    culturalTag: 'Tajine Barqoq',
    stores: {
      PENNY: { price: 7.49, qualityScore: 4, brandName: 'Penny Prune Uscate' },
      LIDL: { price: 7.99, qualityScore: 5, brandName: 'Alesto Prune Uscate' },
      KAUFLAND: { price: 8.29, qualityScore: 4, brandName: 'K-Bio Prune' },
      CARREFOUR: { price: 8.99, qualityScore: 4, brandName: 'Carrefour Prune' },
      MEGA_IMAGE: { price: 10.49, qualityScore: 5, brandName: 'Mega Apetit' }
    }
  },
  {
    id: 'g-naut-conserva',
    name: 'Năut Boabe Fiert la Conservă (400g)',
    category: 'PANTRY',
    defaultUnit: 'buc',
    cuisine: 'MOROCCAN',
    culturalTag: 'Marocan Tradițional',
    stores: {
      PENNY: { price: 3.39, qualityScore: 4, brandName: 'Penny Năut' },
      LIDL: { price: 3.49, qualityScore: 5, brandName: 'Freshona Năut' },
      AUCHAN: { price: 3.59, qualityScore: 4, brandName: 'Auchan Năut' },
      KAUFLAND: { price: 3.69, qualityScore: 4, brandName: 'K-Classic Năut' },
      CARREFOUR: { price: 3.99, qualityScore: 4, brandName: 'Carrefour Năut' },
      MEGA_IMAGE: { price: 4.49, qualityScore: 4, brandName: 'Mega Image Năut' }
    }
  },
  {
    id: 'g-harissa-mirodenii',
    name: 'Pastă de Harissa & Mirodenii Tajine (150g)',
    category: 'PANTRY',
    defaultUnit: 'buc',
    cuisine: 'MOROCCAN',
    culturalTag: 'Condimente Marocane',
    stores: {
      LIDL: { price: 6.99, qualityScore: 4, brandName: '1001 Delights Harissa' },
      CARREFOUR: { price: 7.89, qualityScore: 5, brandName: 'Le Phare du Cap Bon Harissa' },
      AUCHAN: { price: 7.99, qualityScore: 4, brandName: 'Auchan Harissa' },
      KAUFLAND: { price: 8.49, qualityScore: 4, brandName: 'Oriental Spices' },
      MEGA_IMAGE: { price: 9.99, qualityScore: 5, brandName: 'Harissa Berbere' }
    }
  },
  {
    id: 'g-lamaie-murata-confit',
    name: 'Lămâi Murate Confit Tradiționale (Hhamid Msir) (350g)',
    category: 'PANTRY',
    defaultUnit: 'buc',
    cuisine: 'MOROCCAN',
    culturalTag: 'Marocan Tradițional',
    stores: {
      AUCHAN: { price: 8.50, qualityScore: 4, brandName: 'Auchan Citrons Confit' },
      CARREFOUR: { price: 8.99, qualityScore: 5, brandName: 'Carrefour Saveurs Citron' },
      KAUFLAND: { price: 9.20, qualityScore: 4, brandName: 'Oriental Pickled Lemons' },
      MEGA_IMAGE: { price: 9.99, qualityScore: 5, brandName: 'Gourmet Citron Confit' }
    }
  },
  {
    id: 'g-ceai-gunpowder-menta',
    name: 'Ceai Verde Gunpowder cu Mentă Proaspătă (250g)',
    category: 'BEVERAGES',
    defaultUnit: 'pachet',
    cuisine: 'MOROCCAN',
    culturalTag: 'Ceai Marocan Maghrebi',
    stores: {
      LIDL: { price: 7.99, qualityScore: 4, brandName: 'Lord Nelson Green' },
      AUCHAN: { price: 8.50, qualityScore: 4, brandName: 'Auchan Thé Vert' },
      CARREFOUR: { price: 8.99, qualityScore: 5, brandName: 'Al-Arouss Gunpowder Tea' },
      KAUFLAND: { price: 9.49, qualityScore: 4, brandName: 'K-Classic Gunpowder' },
      MEGA_IMAGE: { price: 11.20, qualityScore: 5, brandName: 'Twinings Mentol' }
    }
  },

  // --- SPANISH ESSENTIALS (🇪🇸) ---
  {
    id: 'g-orez-bomba-paella',
    name: 'Orez Bomba Spaniol pentru Paella (1kg)',
    category: 'PANTRY',
    defaultUnit: 'kg',
    cuisine: 'SPANISH',
    culturalTag: 'Spaniol Tradițional',
    stores: {
      LIDL: { price: 12.99, qualityScore: 4, brandName: 'Sol&Mar Bomba' },
      AUCHAN: { price: 13.80, qualityScore: 4, brandName: 'Auchan Paella' },
      CARREFOUR: { price: 13.99, qualityScore: 5, brandName: 'Carrefour Especial Paella' },
      KAUFLAND: { price: 14.49, qualityScore: 4, brandName: 'Scotti Paella Rice' },
      MEGA_IMAGE: { price: 16.50, qualityScore: 5, brandName: 'SOS Arroz Bomba' }
    }
  },
  {
    id: 'g-chorizo-spaniol',
    name: 'Cârnați Chorizo Spaniol Tradițional (200g)',
    category: 'MEAT_FISH',
    defaultUnit: 'buc',
    cuisine: 'SPANISH',
    culturalTag: 'Spaniol Tradițional',
    stores: {
      PENNY: { price: 8.99, qualityScore: 4, brandName: 'San Fabio Chorizo' },
      LIDL: { price: 9.49, qualityScore: 5, brandName: 'Sol&Mar Chorizo' },
      KAUFLAND: { price: 10.29, qualityScore: 4, brandName: 'K-Classic Chorizo' },
      CARREFOUR: { price: 11.20, qualityScore: 5, brandName: 'Palacios Chorizo' },
      MEGA_IMAGE: { price: 12.80, qualityScore: 5, brandName: 'El Pozo Chorizo' }
    }
  },
  {
    id: 'g-jamon-serrano',
    name: 'Jamón Serrano Reserva Feliat Fin (100g)',
    category: 'MEAT_FISH',
    defaultUnit: 'pachet',
    cuisine: 'SPANISH',
    culturalTag: 'Tapas Spaniol',
    stores: {
      PENNY: { price: 8.29, qualityScore: 3, brandName: 'Penny Select Serrano' },
      LIDL: { price: 8.49, qualityScore: 5, brandName: 'Sol&Mar Jamon' },
      KAUFLAND: { price: 8.99, qualityScore: 4, brandName: 'K-Favourites Serrano' },
      CARREFOUR: { price: 9.49, qualityScore: 5, brandName: 'Carrefour Selection' },
      MEGA_IMAGE: { price: 10.99, qualityScore: 5, brandName: 'Campofrio Serrano' }
    }
  },
  {
    id: 'g-creveti-decorticati',
    name: 'Creveți Decorticați Black Tiger Congelați (400g)',
    category: 'MEAT_FISH',
    defaultUnit: 'pachet',
    cuisine: 'SPANISH',
    culturalTag: 'Tapas & Paella',
    stores: {
      PENNY: { price: 23.49, qualityScore: 4, brandName: 'Penny Creveți' },
      AUCHAN: { price: 24.50, qualityScore: 4, brandName: 'Auchan Fructe Mare' },
      LIDL: { price: 24.99, qualityScore: 5, brandName: 'Ocean Sea Creveți' },
      KAUFLAND: { price: 25.99, qualityScore: 4, brandName: 'K-Classic Creveți' },
      CARREFOUR: { price: 26.50, qualityScore: 4, brandName: 'Carrefour Pescărie' }
    }
  },

  // --- ITALIAN ESSENTIALS (🇮🇹) ---
  {
    id: 'g-spaghetti-bronzo',
    name: 'Paste Spaghetti Barilla n.5 / De Cecco (500g)',
    category: 'PANTRY',
    defaultUnit: 'pachet',
    cuisine: 'ITALIAN',
    culturalTag: 'Italian Autentic',
    stores: {
      PENNY: { price: 4.69, qualityScore: 4, brandName: 'San Fabio Spaghetti' },
      LIDL: { price: 4.89, qualityScore: 4, brandName: 'Combino / Barilla' },
      AUCHAN: { price: 4.95, qualityScore: 4, brandName: 'Barilla n.5' },
      KAUFLAND: { price: 5.19, qualityScore: 5, brandName: 'Barilla n.5' },
      CARREFOUR: { price: 5.49, qualityScore: 5, brandName: 'Barilla / De Cecco' },
      MEGA_IMAGE: { price: 6.20, qualityScore: 5, brandName: 'De Cecco Spaghetti' }
    }
  },
  {
    id: 'g-guanciale-pancetta',
    name: 'Guanciale / Pancetta Italiană Cuburi (150g)',
    category: 'MEAT_FISH',
    defaultUnit: 'pachet',
    cuisine: 'ITALIAN',
    culturalTag: 'Carbonara & Amatriciana',
    stores: {
      LIDL: { price: 10.99, qualityScore: 4, brandName: 'Italiamo Guanciale' },
      KAUFLAND: { price: 11.49, qualityScore: 5, brandName: 'K-Favourites Guanciale' },
      AUCHAN: { price: 11.90, qualityScore: 4, brandName: 'Auchan Salumi' },
      CARREFOUR: { price: 12.20, qualityScore: 5, brandName: 'Carrefour Italian' },
      MEGA_IMAGE: { price: 13.99, qualityScore: 5, brandName: 'Negroni Pancetta' }
    }
  },
  {
    id: 'g-parmigiano-reggiano',
    name: 'Parmigiano Reggiano DOP 24 Luni (200g)',
    category: 'DAIRY',
    defaultUnit: 'buc',
    cuisine: 'ITALIAN',
    culturalTag: 'Italian Autentic',
    stores: {
      LIDL: { price: 16.49, qualityScore: 5, brandName: 'Italiamo Parmigiano 24m' },
      AUCHAN: { price: 16.90, qualityScore: 4, brandName: 'Parmareggio' },
      KAUFLAND: { price: 17.29, qualityScore: 5, brandName: 'K-Favourites Parmigiano' },
      CARREFOUR: { price: 17.99, qualityScore: 5, brandName: 'Zanetti Parmigiano' },
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

  // --- AMERICAN ESSENTIALS (🇺🇸) ---
  {
    id: 'g-carne-angus-burger',
    name: 'Carne Tocată Vită Black Angus 15% Grăsime (500g)',
    category: 'MEAT_FISH',
    defaultUnit: 'pachet',
    cuisine: 'AMERICAN',
    culturalTag: 'Smash Burger American',
    stores: {
      PENNY: { price: 17.99, qualityScore: 4, brandName: 'Casa Gustului Vită' },
      LIDL: { price: 18.49, qualityScore: 5, brandName: 'Grill&Chill Black Angus' },
      KAUFLAND: { price: 18.99, qualityScore: 4, brandName: 'Purland Angus Burger' },
      CARREFOUR: { price: 20.50, qualityScore: 4, brandName: 'Carrefour Black Angus' },
      MEGA_IMAGE: { price: 23.50, qualityScore: 5, brandName: 'Mega Gourmet Angus' }
    }
  },
  {
    id: 'g-cheddar-burger',
    name: 'Brânză Cheddar Maturată Felii Burger (150g)',
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

  // --- GERMAN ESSENTIALS (🇩🇪) ---
  {
    id: 'g-carnati-bratwurst',
    name: 'Cârnați Bratwurst Bavarezi de Porc (400g / 4 buc)',
    category: 'MEAT_FISH',
    defaultUnit: 'pachet',
    cuisine: 'GERMAN',
    culturalTag: 'Bavarez Tradițional',
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
      AUCHAN: { price: 3.95, qualityScore: 4, brandName: 'Auchan Varză' },
      LIDL: { price: 3.99, qualityScore: 5, brandName: 'Freshona Sauerkraut' },
      KAUFLAND: { price: 4.29, qualityScore: 4, brandName: 'K-Classic Varză Acră' },
      CARREFOUR: { price: 4.69, qualityScore: 4, brandName: 'Hengstenberg Sauerkraut' }
    }
  },

  // --- ROMANIAN ESSENTIALS (🇷🇴) ---
  {
    id: 'g-telemea-vaca-saramura',
    name: 'Telemea de Vacă în Saramură (400g)',
    category: 'DAIRY',
    defaultUnit: 'buc',
    cuisine: 'ROMANIAN',
    culturalTag: 'Tradițional Românesc',
    stores: {
      PENNY: { price: 11.99, qualityScore: 4, brandName: 'Boni Telemea' },
      LIDL: { price: 12.99, qualityScore: 5, brandName: 'Pilos Telemea Vacă' },
      AUCHAN: { price: 13.10, qualityScore: 4, brandName: 'Auchan Telemea' },
      KAUFLAND: { price: 13.49, qualityScore: 4, brandName: 'Vreau din România Telemea' },
      CARREFOUR: { price: 14.20, qualityScore: 4, brandName: 'Hochland / Carrefour' },
      MEGA_IMAGE: { price: 15.99, qualityScore: 5, brandName: 'Gusturi Românești Telemea' }
    }
  },
  {
    id: 'g-smantana-20',
    name: 'Smântână Românească 20% Grăsime (400g / 850g)',
    category: 'DAIRY',
    defaultUnit: 'buc',
    cuisine: 'ROMANIAN',
    culturalTag: 'Tradițional Românesc',
    stores: {
      PENNY: { price: 5.69, qualityScore: 4, brandName: 'Boni Smântână 20%' },
      LIDL: { price: 5.99, qualityScore: 5, brandName: 'Pilos Smântână 20%' },
      AUCHAN: { price: 6.10, qualityScore: 4, brandName: 'Auchan Smântână' },
      KAUFLAND: { price: 6.29, qualityScore: 4, brandName: 'K-Classic Smântână' },
      CARREFOUR: { price: 6.79, qualityScore: 4, brandName: 'Carrefour Simpl' },
      MEGA_IMAGE: { price: 7.99, qualityScore: 5, brandName: 'Gusturi Românești Smântână' }
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
      PENNY: { price: 3.19, qualityScore: 4, brandName: 'Penny Mălai' },
      LIDL: { price: 3.29, qualityScore: 4, brandName: 'Castello Mălai Extra' },
      AUCHAN: { price: 3.39, qualityScore: 4, brandName: 'Auchan Mălai' },
      KAUFLAND: { price: 3.49, qualityScore: 4, brandName: 'K-Classic Mălai' },
      CARREFOUR: { price: 3.89, qualityScore: 4, brandName: 'Băneasa Mălai Extra' },
      MEGA_IMAGE: { price: 4.49, qualityScore: 5, brandName: 'Băneasa / Gusturi Românești' }
    }
  },

  // --- SNACKS & GUSTĂRI (🍿 SNACKS) ---
  {
    id: 'g-chips-lays',
    name: 'Chipsuri Rumene Lays / Chio Paprika (140g)',
    category: 'SNACKS',
    defaultUnit: 'pachet',
    cuisine: 'UNIVERSAL',
    stores: {
      PENNY: { price: 6.49, qualityScore: 4, brandName: 'Penny Chips / Chio' },
      LIDL: { price: 6.99, qualityScore: 5, brandName: 'Snack Day / Lays' },
      KAUFLAND: { price: 7.29, qualityScore: 4, brandName: 'Lays Paprika' },
      CARREFOUR: { price: 7.89, qualityScore: 4, brandName: 'Lays Wavy' },
      MEGA_IMAGE: { price: 8.99, qualityScore: 5, brandName: 'Lays Max' }
    }
  },
  {
    id: 'g-alune-alesto',
    name: 'Arahide & Caju Prăjite și Sărate Alesto / Mogyi (200g)',
    category: 'SNACKS',
    defaultUnit: 'pachet',
    cuisine: 'UNIVERSAL',
    stores: {
      PENNY: { price: 5.49, qualityScore: 4, brandName: 'Penny Arahide' },
      LIDL: { price: 5.99, qualityScore: 5, brandName: 'Alesto Arahide' },
      KAUFLAND: { price: 6.49, qualityScore: 4, brandName: 'K-Classic Caju' },
      CARREFOUR: { price: 7.20, qualityScore: 4, brandName: 'Mogyi Arahide' },
      MEGA_IMAGE: { price: 8.50, qualityScore: 5, brandName: 'Mogyi Caju' }
    }
  },
  {
    id: 'g-popcorn-unt',
    name: 'Popcorn cu Unt pentru Microunde (Pachet 3x100g)',
    category: 'SNACKS',
    defaultUnit: 'pachet',
    cuisine: 'UNIVERSAL',
    stores: {
      PENNY: { price: 3.99, qualityScore: 4, brandName: 'Penny Popcorn Unt' },
      LIDL: { price: 4.29, qualityScore: 5, brandName: 'Snack Day Popcorn' },
      KAUFLAND: { price: 4.49, qualityScore: 4, brandName: 'K-Classic Popcorn' },
      CARREFOUR: { price: 4.99, qualityScore: 4, brandName: 'Chio Popcorn' }
    }
  },
  {
    id: 'g-biscuiti-tuc',
    name: 'Biscuiți Sărați Tuc / Salatini Crackers (100g)',
    category: 'SNACKS',
    defaultUnit: 'pachet',
    cuisine: 'UNIVERSAL',
    stores: {
      PENNY: { price: 3.29, qualityScore: 4, brandName: 'Salatini Crackers' },
      LIDL: { price: 3.49, qualityScore: 4, brandName: 'Tastino Crackers' },
      KAUFLAND: { price: 3.69, qualityScore: 5, brandName: 'Tuc Original' },
      CARREFOUR: { price: 3.99, qualityScore: 5, brandName: 'Tuc Paprika' },
      MEGA_IMAGE: { price: 4.50, qualityScore: 5, brandName: 'Tuc Bacon' }
    }
  },

  // --- DULCIURI & CIOCOLATĂ (🍫 SWEETS) ---
  {
    id: 'g-ciocolata-milka',
    name: 'Ciocolată Fină cu Lapte din Alpi Milka (100g)',
    category: 'SNACKS',
    defaultUnit: 'buc',
    cuisine: 'UNIVERSAL',
    stores: {
      LIDL: { price: 4.29, qualityScore: 5, brandName: 'Fin Carré / Milka' },
      PENNY: { price: 4.49, qualityScore: 4, brandName: 'Milka Lapte Alpin' },
      KAUFLAND: { price: 4.89, qualityScore: 5, brandName: 'Milka Lapte' },
      CARREFOUR: { price: 5.49, qualityScore: 5, brandName: 'Milka Alune' },
      MEGA_IMAGE: { price: 6.20, qualityScore: 5, brandName: 'Milka Oreo' }
    }
  },
  {
    id: 'g-napolitane-dare',
    name: 'Napolitane Crocante cu Cremă Cacao Joe / Dare (150g)',
    category: 'SNACKS',
    defaultUnit: 'pachet',
    cuisine: 'UNIVERSAL',
    stores: {
      PENNY: { price: 3.79, qualityScore: 4, brandName: 'Joe Napolitane' },
      LIDL: { price: 3.99, qualityScore: 5, brandName: 'Sondey Napolitane' },
      KAUFLAND: { price: 4.29, qualityScore: 4, brandName: 'Dare Ciocolată' },
      CARREFOUR: { price: 4.59, qualityScore: 4, brandName: 'Joe Cacao' }
    }
  },
  {
    id: 'g-croissant-7days',
    name: 'Croissant cu Cacao 7Days Max (Bax 4+1 gratis / 5 buc)',
    category: 'SNACKS',
    defaultUnit: 'pachet',
    cuisine: 'UNIVERSAL',
    stores: {
      PENNY: { price: 11.49, qualityScore: 4, brandName: '7Days Max Bax' },
      LIDL: { price: 11.99, qualityScore: 5, brandName: '7Days Cacao' },
      KAUFLAND: { price: 12.49, qualityScore: 4, brandName: '7Days Max Cacao' },
      CARREFOUR: { price: 13.20, qualityScore: 4, brandName: '7Days Multipack' }
    }
  },
  {
    id: 'g-biscuiti-oreo',
    name: 'Biscuiți Oreo Original cu Cremă de Vanilie (176g)',
    category: 'SNACKS',
    defaultUnit: 'pachet',
    cuisine: 'UNIVERSAL',
    stores: {
      PENNY: { price: 5.49, qualityScore: 4, brandName: 'Oreo Original' },
      LIDL: { price: 5.89, qualityScore: 5, brandName: 'Neo / Oreo' },
      KAUFLAND: { price: 6.19, qualityScore: 4, brandName: 'Oreo Vanilie' },
      CARREFOUR: { price: 6.49, qualityScore: 5, brandName: 'Oreo 176g' },
      MEGA_IMAGE: { price: 7.20, qualityScore: 5, brandName: 'Oreo Double Cream' }
    }
  },

  // --- BĂUTURI & SUCURI (🧃 BEVERAGES) ---
  {
    id: 'g-apa-minerala-borsec',
    name: 'Apă Minerală Carbogazoasă Borsec / Dorna (Bax 6 x 2L)',
    category: 'BEVERAGES',
    defaultUnit: 'pachet',
    cuisine: 'UNIVERSAL',
    stores: {
      AUCHAN: { price: 17.95, qualityScore: 5, brandName: 'Borsec Bax 6x2L' },
      PENNY: { price: 17.99, qualityScore: 4, brandName: 'Borsec Bax 6x2L' },
      LIDL: { price: 18.49, qualityScore: 5, brandName: 'Saguaro / Borsec' },
      KAUFLAND: { price: 18.99, qualityScore: 5, brandName: 'Borsec Cărbogazoasă' },
      CARREFOUR: { price: 19.80, qualityScore: 5, brandName: 'Borsec 6x2L' },
      MEGA_IMAGE: { price: 22.50, qualityScore: 5, brandName: 'Borsec Bax' }
    }
  },
  {
    id: 'g-apa-plata-bucovina',
    name: 'Apă Minerală Plată Bucovina / Aquatique (Bax 6 x 2L)',
    category: 'BEVERAGES',
    defaultUnit: 'pachet',
    cuisine: 'UNIVERSAL',
    stores: {
      AUCHAN: { price: 17.50, qualityScore: 5, brandName: 'Bucovina Bax 6x2L' },
      PENNY: { price: 17.49, qualityScore: 4, brandName: 'Bucovina Plată' },
      LIDL: { price: 17.99, qualityScore: 5, brandName: 'Saguaro / Bucovina' },
      KAUFLAND: { price: 18.49, qualityScore: 5, brandName: 'Bucovina Bax' },
      CARREFOUR: { price: 19.20, qualityScore: 5, brandName: 'Bucovina 6x2L' }
    }
  },
  {
    id: 'g-suc-portocale-100',
    name: 'Suc Natural Portocale 100% Cappy / Solevita (1L / 2L)',
    category: 'BEVERAGES',
    defaultUnit: 'L',
    cuisine: 'UNIVERSAL',
    stores: {
      PENNY: { price: 6.19, qualityScore: 4, brandName: 'Penny Portocale 100%' },
      LIDL: { price: 6.49, qualityScore: 5, brandName: 'Solevita Portocale 100%' },
      KAUFLAND: { price: 6.99, qualityScore: 4, brandName: 'K-Classic Portocale' },
      CARREFOUR: { price: 7.50, qualityScore: 5, brandName: 'Cappy Portocale 100%' },
      MEGA_IMAGE: { price: 8.99, qualityScore: 5, brandName: 'Santal Portocale' }
    }
  },
  {
    id: 'g-coca-cola-2x2',
    name: 'Băutură Răcoritoare Coca-Cola / Pepsi Max (Pachet 2 x 1.5L)',
    category: 'BEVERAGES',
    defaultUnit: 'pachet',
    cuisine: 'UNIVERSAL',
    stores: {
      PENNY: { price: 13.99, qualityScore: 4, brandName: 'Coca-Cola 2x1.5L' },
      LIDL: { price: 14.49, qualityScore: 5, brandName: 'Freeway / Coca-Cola' },
      KAUFLAND: { price: 14.89, qualityScore: 5, brandName: 'Coca-Cola Pachet' },
      CARREFOUR: { price: 15.50, qualityScore: 5, brandName: 'Coca-Cola Regular' },
      MEGA_IMAGE: { price: 16.99, qualityScore: 5, brandName: 'Coca-Cola Zero' }
    }
  },
  {
    id: 'g-cafea-lavazza-500g',
    name: 'Cafea Măcinată Lavazza Crema e Gusto / Tchibo (500g)',
    category: 'BEVERAGES',
    defaultUnit: 'pachet',
    cuisine: 'UNIVERSAL',
    stores: {
      PENNY: { price: 23.99, qualityScore: 4, brandName: 'Tchibo / Lavazza' },
      LIDL: { price: 24.99, qualityScore: 5, brandName: 'Bellarom / Lavazza' },
      KAUFLAND: { price: 25.99, qualityScore: 5, brandName: 'Lavazza Crema e Gusto' },
      CARREFOUR: { price: 27.50, qualityScore: 5, brandName: 'Lavazza 500g' },
      MEGA_IMAGE: { price: 31.99, qualityScore: 5, brandName: 'Lavazza Qualita Oro' }
    }
  },

  // --- CURĂȚENIE & MENAJ (🧼 CLEANING) ---
  {
    id: 'g-detergent-ariel-capsule',
    name: 'Detergent Capsule Rufe Ariel All-in-1 / Formil (35-40 spălări)',
    category: 'CLEANING',
    defaultUnit: 'pachet',
    cuisine: 'UNIVERSAL',
    stores: {
      LIDL: { price: 47.99, qualityScore: 5, brandName: 'Formil Duo / Ariel' },
      PENNY: { price: 49.99, qualityScore: 4, brandName: 'Ariel All in 1 Pods' },
      KAUFLAND: { price: 52.99, qualityScore: 5, brandName: 'Ariel Mountain Spring' },
      AUCHAN: { price: 51.50, qualityScore: 4, brandName: 'Ariel Pods Bax' },
      CARREFOUR: { price: 56.50, qualityScore: 5, brandName: 'Ariel Color Pods' },
      MEGA_IMAGE: { price: 64.99, qualityScore: 5, brandName: 'Ariel Pods Extra' }
    }
  },
  {
    id: 'g-balsam-lenor',
    name: 'Balsam de Rufe Parfumat Lenor / Coccolino (1.7L / 68 spălări)',
    category: 'CLEANING',
    defaultUnit: 'buc',
    cuisine: 'UNIVERSAL',
    stores: {
      PENNY: { price: 16.99, qualityScore: 4, brandName: 'Lenor Spring Awakening' },
      LIDL: { price: 17.49, qualityScore: 5, brandName: 'Doussy / Lenor' },
      KAUFLAND: { price: 17.99, qualityScore: 5, brandName: 'Lenor Gold Orchid' },
      CARREFOUR: { price: 19.50, qualityScore: 5, brandName: 'Lenor Parfum' },
      MEGA_IMAGE: { price: 22.99, qualityScore: 5, brandName: 'Lenor Floral' }
    }
  },
  {
    id: 'g-detergent-vase-fairy',
    name: 'Detergent Lichid pentru Vase Fairy Max Power / W5 (900ml)',
    category: 'CLEANING',
    defaultUnit: 'buc',
    cuisine: 'UNIVERSAL',
    stores: {
      PENNY: { price: 11.49, qualityScore: 4, brandName: 'Fairy Lemon 900ml' },
      LIDL: { price: 11.99, qualityScore: 5, brandName: 'W5 / Fairy Max' },
      KAUFLAND: { price: 12.49, qualityScore: 5, brandName: 'Fairy Rodie & Lămâie' },
      CARREFOUR: { price: 13.20, qualityScore: 5, brandName: 'Fairy 900ml' },
      MEGA_IMAGE: { price: 14.99, qualityScore: 5, brandName: 'Fairy Platinum' }
    }
  },
  {
    id: 'g-hartie-igienica-zewa',
    name: 'Hârtie Igienică Zewa Deluxe 3 Straturi (Pachet 10 role)',
    category: 'CLEANING',
    defaultUnit: 'pachet',
    cuisine: 'UNIVERSAL',
    stores: {
      PENNY: { price: 19.99, qualityScore: 4, brandName: 'Penny Soft 10 role' },
      LIDL: { price: 20.49, qualityScore: 5, brandName: 'Floralys Deluxe 10 role' },
      KAUFLAND: { price: 21.99, qualityScore: 5, brandName: 'Zewa Deluxe Piersică' },
      CARREFOUR: { price: 23.50, qualityScore: 5, brandName: 'Zewa Deluxe 3 straturi' },
      MEGA_IMAGE: { price: 26.99, qualityScore: 5, brandName: 'Zewa Softis' }
    }
  },
  {
    id: 'g-prosoape-bucatarie',
    name: 'Role Prosoape Bucătărie Absorbante 3 Straturi (Pachet 2 role mari)',
    category: 'CLEANING',
    defaultUnit: 'pachet',
    cuisine: 'UNIVERSAL',
    stores: {
      PENNY: { price: 8.99, qualityScore: 4, brandName: 'Penny Prosoape Bucătărie' },
      LIDL: { price: 9.29, qualityScore: 5, brandName: 'Floralys Maxi 2 role' },
      KAUFLAND: { price: 9.99, qualityScore: 4, brandName: 'K-Classic Prosoape' },
      CARREFOUR: { price: 10.50, qualityScore: 4, brandName: 'Carrefour Prosoape' }
    }
  },
  {
    id: 'g-saci-menajeri-60l',
    name: 'Saci Menajeri Rezistenți cu Șnur 60L (20 bucăți)',
    category: 'CLEANING',
    defaultUnit: 'buc',
    cuisine: 'UNIVERSAL',
    stores: {
      PENNY: { price: 5.49, qualityScore: 4, brandName: 'Penny Saci Menajeri 60L' },
      LIDL: { price: 5.79, qualityScore: 5, brandName: 'W5 Saci Șnur 60L' },
      KAUFLAND: { price: 5.99, qualityScore: 4, brandName: 'K-Classic Saci Menaj' },
      CARREFOUR: { price: 6.49, qualityScore: 4, brandName: 'Fino Saci 60L' }
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
      LIDL: { price: 23.99, qualityScore: 5, brandName: 'Lidl Carne Proaspătă' },
      AUCHAN: { price: 24.20, qualityScore: 4, brandName: 'Auchan Pui' },
      KAUFLAND: { price: 24.49, qualityScore: 4, brandName: 'Purland Pui' },
      CARREFOUR: { price: 25.50, qualityScore: 4, brandName: 'Carrefour Măcelărie' },
      MEGA_IMAGE: { price: 27.99, qualityScore: 5, brandName: 'Avicola Pui' }
    }
  },
  {
    id: 'g-lapte-35',
    name: 'Lapte Proaspăt 3.5% Grăsime (1L)',
    category: 'DAIRY',
    defaultUnit: 'L',
    cuisine: 'UNIVERSAL',
    stores: {
      PENNY: { price: 4.59, qualityScore: 4, brandName: 'Boni Lapte 3.5%' },
      LIDL: { price: 4.69, qualityScore: 5, brandName: 'Pilos Lapte 3.5%' },
      AUCHAN: { price: 4.75, qualityScore: 4, brandName: 'Auchan Lapte' },
      KAUFLAND: { price: 4.79, qualityScore: 4, brandName: 'K-Classic Lapte' },
      CARREFOUR: { price: 5.19, qualityScore: 4, brandName: 'Carrefour Lapte' },
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
      PENNY: { price: 20.99, qualityScore: 4, brandName: 'Boni Ouă M30' },
      LIDL: { price: 21.49, qualityScore: 5, brandName: 'Lidl Ouă Proaspete 30buc' },
      AUCHAN: { price: 21.80, qualityScore: 4, brandName: 'Auchan Ouă 30buc' },
      KAUFLAND: { price: 21.99, qualityScore: 4, brandName: 'K-Classic Ouă 30buc' },
      CARREFOUR: { price: 23.50, qualityScore: 4, brandName: 'Carrefour Ouă 30buc' },
      MEGA_IMAGE: { price: 26.99, qualityScore: 5, brandName: 'Mega Image Ouă M30' }
    }
  },
  {
    id: 'g-ulei-masline-extra',
    name: 'Ulei de Măsline Extra Virgin Presat la Rece (1L)',
    category: 'PANTRY',
    defaultUnit: 'L',
    cuisine: 'UNIVERSAL',
    stores: {
      PENNY: { price: 33.99, qualityScore: 4, brandName: 'San Fabio Ulei Măsline' },
      LIDL: { price: 34.99, qualityScore: 5, brandName: 'Primadonna Extra Virgin' },
      AUCHAN: { price: 35.90, qualityScore: 4, brandName: 'Auchan Extra Virgin' },
      KAUFLAND: { price: 36.99, qualityScore: 4, brandName: 'K-Bio Ulei Măsline' },
      CARREFOUR: { price: 38.50, qualityScore: 4, brandName: 'Carrefour Extra Virgin' },
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
      PENNY: { price: 6.29, qualityScore: 4, brandName: 'Penny Roșii Cherry' },
      LIDL: { price: 6.49, qualityScore: 5, brandName: 'Piața Lidl Roșii Cherry' },
      AUCHAN: { price: 6.80, qualityScore: 4, brandName: 'Auchan Roșii' },
      KAUFLAND: { price: 6.99, qualityScore: 4, brandName: 'Kaufland Roșii Ciorchine' },
      CARREFOUR: { price: 7.49, qualityScore: 4, brandName: 'Carrefour Legume' },
      MEGA_IMAGE: { price: 8.99, qualityScore: 5, brandName: 'Mega Gusturi Românești' }
    }
  },
  {
    id: 'g-banane',
    name: 'Banane Premium Proaspete (1kg)',
    category: 'FRUITS_VEGGIES',
    defaultUnit: 'kg',
    cuisine: 'UNIVERSAL',
    stores: {
      PENNY: { price: 6.29, qualityScore: 4, brandName: 'Penny Banane' },
      LIDL: { price: 6.49, qualityScore: 5, brandName: 'Lidl Banane' },
      AUCHAN: { price: 6.45, qualityScore: 4, brandName: 'Auchan Banane' },
      KAUFLAND: { price: 6.59, qualityScore: 4, brandName: 'Kaufland Banane' },
      CARREFOUR: { price: 6.99, qualityScore: 4, brandName: 'Carrefour Banane' },
      MEGA_IMAGE: { price: 7.49, qualityScore: 5, brandName: 'Mega Banane' }
    }
  },
  {
    id: 'g-iaurt-grecesc',
    name: 'Iaurt Grecesc Autentic 10% Grăsime (400g / 1kg)',
    category: 'DAIRY',
    defaultUnit: 'buc',
    cuisine: 'UNIVERSAL',
    stores: {
      PENNY: { price: 4.29, qualityScore: 4, brandName: 'San Fabio Iaurt Grecesc' },
      LIDL: { price: 4.49, qualityScore: 5, brandName: 'Pilos Iaurt Grecesc 10%' },
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
      PENNY: { price: 3.99, qualityScore: 4, brandName: 'Penny Toast Integral' },
      LIDL: { price: 4.29, qualityScore: 5, brandName: 'Tastino Toast Secară' },
      KAUFLAND: { price: 4.49, qualityScore: 4, brandName: 'K-Classic Toast' },
      CARREFOUR: { price: 4.89, qualityScore: 4, brandName: 'Carrefour Toast' },
      MEGA_IMAGE: { price: 5.49, qualityScore: 5, brandName: 'Toast Toast Secară' }
    }
  }
];

export interface GroceryQuickBundle {
  id: string;
  titleRo: string;
  titleEn: string;
  icon: string;
  cuisine: GroceryCuisineType;
  duration?: 'DAYS_7' | 'DAYS_15' | 'DAYS_30';
  badgeRo: string;
  descriptionRo: string;
  descriptionEn: string;
  items: { catalogId: string; quantity: number }[];
}

export const QUICK_BUNDLES: GroceryQuickBundle[] = [
  // --- STOCK-UP LONG-TERM BUNDLES (15 ZILE & 30 ZILE) ---
  {
    id: 'bundle-monthly-30days',
    titleRo: 'Coș Lunar Complet (30 Zile) • Alimente, Gustări, Băuturi & Menaj',
    titleEn: 'Full Monthly Stock-Up (30 Days) • Food, Snacks, Drinks & Home',
    icon: '🗓️',
    cuisine: 'UNIVERSAL',
    duration: 'DAYS_30',
    badgeRo: 'Aprovizionare 30 Zile',
    descriptionRo: 'Pachetul complet pentru o lună întreagă: carne, lactate, baxuri apă, cafea, orez, paste, detergenți, gustări și dulciuri.',
    descriptionEn: 'Full 30-day stock up: meats, dairy, bulk water packs, coffee, rice, pasta, detergents, snacks & sweets.',
    items: [
      { catalogId: 'g-piept-pui', quantity: 4 },
      { catalogId: 'g-carne-vita-tagine', quantity: 3 },
      { catalogId: 'g-lapte-35', quantity: 8 },
      { catalogId: 'g-oua-30', quantity: 2 },
      { catalogId: 'g-ulei-masline-extra', quantity: 2 },
      { catalogId: 'g-spaghetti-bronzo', quantity: 4 },
      { catalogId: 'g-couscous-500g', quantity: 2 },
      { catalogId: 'g-naut-conserva', quantity: 6 },
      { catalogId: 'g-apa-minerala-borsec', quantity: 3 },
      { catalogId: 'g-apa-plata-bucovina', quantity: 3 },
      { catalogId: 'g-cafea-lavazza-500g', quantity: 2 },
      { catalogId: 'g-detergent-ariel-capsule', quantity: 1 },
      { catalogId: 'g-balsam-lenor', quantity: 1 },
      { catalogId: 'g-detergent-vase-fairy', quantity: 2 },
      { catalogId: 'g-hartie-igienica-zewa', quantity: 2 },
      { catalogId: 'g-chips-lays', quantity: 3 },
      { catalogId: 'g-ciocolata-milka', quantity: 4 }
    ]
  },
  {
    id: 'bundle-biweekly-15days',
    titleRo: 'Pachet Aprovizionare 15 Zile (Bi-Săptămânal)',
    titleEn: 'Bi-Weekly Stock-Up Pack (15 Days)',
    icon: '📅',
    cuisine: 'UNIVERSAL',
    duration: 'DAYS_15',
    badgeRo: 'Aprovizionare 15 Zile',
    descriptionRo: 'Tot ce ai nevoie pentru 2 săptămâni fără drumuri suplimentare la magazin.',
    descriptionEn: 'Everything you need for 2 full weeks with optimal store savings.',
    items: [
      { catalogId: 'g-piept-pui', quantity: 2 },
      { catalogId: 'g-carne-vita-tagine', quantity: 1 },
      { catalogId: 'g-lapte-35', quantity: 4 },
      { catalogId: 'g-oua-30', quantity: 1 },
      { catalogId: 'g-spaghetti-bronzo', quantity: 2 },
      { catalogId: 'g-telemea-vaca-saramura', quantity: 2 },
      { catalogId: 'g-apa-minerala-borsec', quantity: 2 },
      { catalogId: 'g-suc-portocale-100', quantity: 2 },
      { catalogId: 'g-chips-lays', quantity: 2 },
      { catalogId: 'g-ciocolata-milka', quantity: 2 },
      { catalogId: 'g-hartie-igienica-zewa', quantity: 1 },
      { catalogId: 'g-prosoape-bucatarie', quantity: 1 }
    ]
  },

  // --- CULTURAL CUISINE BUNDLES ---
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
      { catalogId: 'g-ulei-masline-extra', quantity: 1 }
    ]
  },
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
      { catalogId: 'g-rosii-cherry', quantity: 1 }
    ]
  },
  {
    id: 'bundle-german-bratwurst',
    titleRo: 'Bavarian Dinner: Bratwurst, Sauerkraut & Brezel',
    titleEn: 'German Dinner: Bratwurst, Sauerkraut & Brezel',
    icon: '🥨',
    cuisine: 'GERMAN',
    badgeRo: 'Bucătărie Germană',
    descriptionRo: 'Cârnați bratwurst bavarezi, varză acră călită sauerkraut, muștar dulce cu boabe și covrigi brezel',
    descriptionEn: 'Bavarian pork bratwurst, authentic sauerkraut, sweet whole-grain mustard & pretzels',
    items: [
      { catalogId: 'g-carnati-bratwurst', quantity: 1 },
      { catalogId: 'g-varza-acra-sauerkraut', quantity: 1 }
    ]
  },
  {
    id: 'bundle-moroccan-tagine',
    titleRo: 'Cina Tradițională Marocană (Tagine & Couscous)',
    titleEn: 'Moroccan Tagine & Couscous Night',
    icon: '🇲🇦',
    cuisine: 'MOROCCAN',
    badgeRo: 'Bucătărie Marocană',
    descriptionRo: 'Pulpă de vită fragedă, couscous fin, prune dulci, năut fiert, pastă harissa și ceai verde cu mentă',
    descriptionEn: 'Tender beef, fine couscous, prunes, chickpeas, harissa spice paste & mint tea',
    items: [
      { catalogId: 'g-carne-vita-tagine', quantity: 1 },
      { catalogId: 'g-couscous-500g', quantity: 1 },
      { catalogId: 'g-prune-uscate-tajine', quantity: 1 },
      { catalogId: 'g-naut-conserva', quantity: 2 },
      { catalogId: 'g-harissa-mirodenii', quantity: 1 },
      { catalogId: 'g-ceai-gunpowder-menta', quantity: 1 }
    ]
  },
  {
    id: 'bundle-romanian-feast',
    titleRo: 'Ospăț Tradițional Românesc (Mămăliguță & Telemea)',
    titleEn: 'Traditional Romanian Family Feast',
    icon: '🇷🇴',
    cuisine: 'ROMANIAN',
    badgeRo: 'Bucătărie Românească',
    descriptionRo: 'Mălai auriu, telemea de vacă în saramură, smântână 20%, piept de pui și ouă',
    descriptionEn: 'Polenta cornmeal, salted telemea cheese, sour cream, chicken and fresh eggs',
    items: [
      { catalogId: 'g-malai-superior', quantity: 1 },
      { catalogId: 'g-telemea-vaca-saramura', quantity: 1 },
      { catalogId: 'g-smantana-20', quantity: 1 },
      { catalogId: 'g-piept-pui', quantity: 1 },
      { catalogId: 'g-oua-30', quantity: 1 }
    ]
  }
];

export const DEFAULT_SAVED_RECIPES: SavedRecipeReel[] = [
  {
    id: 'recipe-reel-moroccan-tagine',
    title: 'طاجين اللحم بالبرقوق • Tajine Marocan de Vită cu Prune & Migdale',
    videoUrl: 'https://www.facebook.com/reel/moroccan_beef_tajine',
    cuisine: 'MOROCCAN',
    description: 'Capodopera bucătăriei marocane: Vită fragedă gătită lent cu ceapă, scorțișoară, ghimbir, prune dulci și migdale crocante.',
    servings: 4,
    prepTimeMinutes: 50,
    totalEstimatedCost: 101.44,
    cheapestStoreId: 'PENNY',
    instructionsSummary: '1. Marinează carnea cu ghimbir, șofran, scorțișoară și ulei de măsline. 2. Gătește la foc mic în vasul de tajine 45 min. 3. Adaugă prunele caramelizate cu miere și migdalele prăjite.',
    createdAt: new Date().toISOString(),
    ingredients: [
      { name: 'Pulpă de vită fragedă pentru Tajine (1kg)', quantity: 1, unit: 'kg', matchedCatalogId: 'g-carne-vita-tagine', suggestedStoreId: 'PENNY', estimatedPrice: 37.99 },
      { name: 'Prune uscate dulci fără sâmburi (300g)', quantity: 1, unit: 'pachet', matchedCatalogId: 'g-prune-uscate-tajine', suggestedStoreId: 'LIDL', estimatedPrice: 7.99 },
      { name: 'Migdale crude blanșate fără coajă (150g)', quantity: 1, unit: 'pachet', suggestedStoreId: 'PENNY', estimatedPrice: 10.99 },
      { name: 'Couscous Tradițional Dari Mediu (1kg)', quantity: 1, unit: 'kg', matchedCatalogId: 'g-couscous-500g', suggestedStoreId: 'LIDL', estimatedPrice: 5.49 },
      { name: 'Năut boabe fiert la conservă (400g)', quantity: 2, unit: 'buc', matchedCatalogId: 'g-naut-conserva', suggestedStoreId: 'PENNY', estimatedPrice: 6.78 },
      { name: 'Ulei de măsline Extra Virgin (1L)', quantity: 1, unit: 'L', matchedCatalogId: 'g-ulei-masline-extra', suggestedStoreId: 'PENNY', estimatedPrice: 33.99 }
    ]
  },
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
      { name: 'Șofran Spaniol Firicele', quantity: 1, unit: 'buc', suggestedStoreId: 'AUCHAN', estimatedPrice: 17.50 },
      { name: 'Boia Dulce Afumată Pimentón', quantity: 1, unit: 'buc', suggestedStoreId: 'KAUFLAND', estimatedPrice: 6.48 }
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
      { name: 'Ouă proaspete (Cofraj 30)', quantity: 1, unit: 'pachet', matchedCatalogId: 'g-oua-30', suggestedStoreId: 'PENNY', estimatedPrice: 20.99 }
    ]
  }
];

// Sample Purchase Records for AI Bill Analyzer
export const DEFAULT_PURCHASE_HISTORY: ReceiptPurchaseRecord[] = [
  {
    id: 'rec-sample-1',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    storeId: 'MEGA_IMAGE',
    storeName: 'Mega Image',
    totalSpent: 168.50,
    payer: 'WIFE_SALARY',
    items: [
      { name: 'Detergent Rufe Ariel Pods Extra', price: 64.99, quantity: 1, unit: 'pachet', category: 'CLEANING', brandName: 'Ariel' },
      { name: 'Parmigiano Reggiano 24m', price: 21.50, quantity: 1, unit: 'buc', category: 'DAIRY', brandName: 'Parmareggio' },
      { name: 'Piept de Pui Avicola', price: 27.99, quantity: 1, unit: 'kg', category: 'MEAT_FISH', brandName: 'Avicola' },
      { name: 'Coca-Cola Zero 2x1.5L', price: 16.99, quantity: 1, unit: 'pachet', category: 'BEVERAGES', brandName: 'Coca-Cola' },
      { name: 'Chipsuri Lays Max Paprika', price: 8.99, quantity: 1, unit: 'pachet', category: 'SNACKS', brandName: 'Lays' },
      { name: 'Lapte 3.5% Mega Image', price: 5.89, quantity: 2, unit: 'L', category: 'DAIRY', brandName: 'Mega' },
      { name: 'Ciocolată Milka Oreo', price: 6.20, quantity: 2, unit: 'buc', category: 'SNACKS', brandName: 'Milka' }
    ]
  },
  {
    id: 'rec-sample-2',
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    storeId: 'CARREFOUR',
    storeName: 'Carrefour Hypermarket',
    totalSpent: 215.30,
    payer: 'FREELANCE_BUFFER',
    items: [
      { name: 'Pulpă de Vită Filiera Calității', price: 41.50, quantity: 1.5, unit: 'kg', category: 'MEAT_FISH' },
      { name: 'Balsam Rufe Lenor Parfum', price: 19.50, quantity: 1, unit: 'buc', category: 'CLEANING' },
      { name: 'Hârtie Igienică Zewa Deluxe', price: 23.50, quantity: 1, unit: 'pachet', category: 'CLEANING' },
      { name: 'Cafea Măcinată Lavazza', price: 27.50, quantity: 1, unit: 'pachet', category: 'BEVERAGES' },
      { name: 'Ulei Măsline Extra Virgin', price: 38.50, quantity: 1, unit: 'L', category: 'PANTRY' }
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
    name: 'Couscous Tradițional Dari Mediu (1kg)',
    category: 'PANTRY',
    quantity: 1,
    unit: 'kg',
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
    catalogItemId: 'g-chips-lays',
    name: 'Chipsuri Rumene Lays Paprika',
    category: 'SNACKS',
    quantity: 2,
    unit: 'pachet',
    isChecked: false
  },
  {
    id: 'item-6',
    catalogItemId: 'g-apa-minerala-borsec',
    name: 'Apă Minerală Borsec (Bax 6x2L)',
    category: 'BEVERAGES',
    quantity: 1,
    unit: 'pachet',
    isChecked: false
  }
];
