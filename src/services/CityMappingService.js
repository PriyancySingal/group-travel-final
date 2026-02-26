// TBO City Code Mapping Service
// Maps city names to TBO API city codes

const cityCodeMap = {
  // Major Indian Cities
  "delhi": "110089",
  "new delhi": "110089",
  "mumbai": "110014",
  "bangalore": "110002",
  "bengaluru": "110002",
  "hyderabad": "110007",
  "chennai": "110008",
  "kolkata": "110044",
  "pune": "110021",
  "ahmedabad": "110001",
  "jaipur": "110010",
  "surat": "110028",
  "lucknow": "110013",
  "kanpur": "110011",
  "nagpur": "110016",
  "indore": "110009",
  "bhopal": "110003",
  "visakhapatnam": "110032",
  "vadodara": "110031",
  "goa": "110005",
  "cochin": "110055",
  "kochi": "110055",
  "munnar": "110060",
  "mysore": "110015",
  "shimla": "110025",
  "manali": "110012",
  "udaipur": "110030",
  "jodhpur": "110043",
  "agra": "110042",
  "varanasi": "110033",
  "amritsar": "110038",
  "chandigarh": "110004",
  "dehradun": "110053",
  "ooty": "110019",
  "madurai": "110045",
  "trivandrum": "110029",
  "tirupati": "110056",
  "rajkot": "110022",
  "jamshedpur": "110046",
  "nashik": "110057",
  "faridabad": "110058",
  "ludhiana": "110035",
  "guwahati": "110006",
  "srinagar": "110027",
  "leh": "110052",
  "dharamshala": "110054",
  "nainital": "110017",
  "mussoorie": "110041",
  "haridwar": "110051",
  "rishikesh": "110059",
  
  // International Cities (common for group travel)
  "dubai": "DXB",
  "bangkok": "BKK",
  "singapore": "SIN",
  "kuala lumpur": "KUL",
  "bali": "DPS",
  "maldives": "MLE",
  "paris": "PAR",
  "london": "LON",
  "new york": "NYC",
  "tokyo": "TYO",
  "sydney": "SYD",
  "melbourne": "MEL",
  "auckland": "AKL",
  "dublin": "DUB",
  "amsterdam": "AMS",
  "berlin": "BER",
  "rome": "ROM",
  "barcelona": "BCN",
  "madrid": "MAD",
  "istanbul": "IST",
  "phuket": "HKT",
  "phnom penh": "PNH",
  "siem reap": "SAI",
  "kolkata": "CCU",
  "chandigarh": "IXC",
  
  // Airport codes (fallback)
  "DEL": "110089",
  "BOM": "110014",
  "BLR": "110002",
  "HYD": "110007",
  "MAA": "110008",
  "CCU": "110044",
  "PNQ": "110021",
  "AMD": "110001",
  "JAI": "110010",
};

/**
 * Get TBO City Code from city name
 * @param {string} cityName - City name or airport code
 * @returns {string|null} - TBO City Code or null if not found
 */
export const getCityCode = (cityName) => {
  if (!cityName) return null;
  
  const normalizedCity = cityName.toLowerCase().trim();
  
  // Direct match
  if (cityCodeMap[normalizedCity]) {
    return cityCodeMap[normalizedCity];
  }
  
  // Partial match - check if any key is contained in the city name
  for (const [key, code] of Object.entries(cityCodeMap)) {
    if (normalizedCity.includes(key) || key.includes(normalizedCity)) {
      return code;
    }
  }
  
  return null;
};

/**
 * Get city name suggestions based on partial input
 * @param {string} partialName - Partial city name
 * @returns {string[]} - Array of matching city names
 */
export const getCitySuggestions = (partialName) => {
  if (!partialName || partialName.length < 2) return [];
  
  const normalizedPartial = partialName.toLowerCase().trim();
  
  return Object.keys(cityCodeMap)
    .filter(city => city.includes(normalizedPartial))
    .slice(0, 10); // Limit to 10 suggestions
};

/**
 * Validate if a city code is valid
 * @param {string} cityCode - TBO City Code
 * @returns {boolean} - True if valid
 */
export const isValidCityCode = (cityCode) => {
  return Object.values(cityCodeMap).includes(cityCode);
};

export default {
  getCityCode,
  getCitySuggestions,
  isValidCityCode
};
