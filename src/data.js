export const COUNTRIES = ['United States', 'Canada'];

export const CATEGORIES = [
  'NICU',
  'Neonatology',
  'Nursing Leadership',
  'Quality',
  'Administration',
  'Research',
  'Other',
];

export const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois',
  'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts',
  'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming', 'Puerto Rico',
];

export const CA_PROVINCES = [
  'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 'Newfoundland and Labrador',
  'Nova Scotia', 'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan',
  'Northwest Territories', 'Nunavut', 'Yukon',
];

export function regionsFor(country) {
  if (country === 'United States') return US_STATES;
  if (country === 'Canada') return CA_PROVINCES;
  return [];
}

export function regionLabel(country) {
  if (country === 'Canada') return 'Province';
  if (country === 'United States') return 'State';
  return 'State / province';
}

export const TIMEZONES = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Phoenix',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'America/Halifax',
  'America/St_Johns',
  'America/Toronto',
  'America/Winnipeg',
  'America/Edmonton',
  'America/Vancouver',
];

// Best-fit IANA zone for each US state / Canadian province.
// States that span multiple zones use the dominant zone.
export const STATE_TIMEZONES = {
  // United States
  'Alabama': 'America/Chicago',
  'Alaska': 'America/Anchorage',
  'Arizona': 'America/Phoenix',
  'Arkansas': 'America/Chicago',
  'California': 'America/Los_Angeles',
  'Colorado': 'America/Denver',
  'Connecticut': 'America/New_York',
  'Delaware': 'America/New_York',
  'District of Columbia': 'America/New_York',
  'Florida': 'America/New_York',
  'Georgia': 'America/New_York',
  'Hawaii': 'Pacific/Honolulu',
  'Idaho': 'America/Denver',
  'Illinois': 'America/Chicago',
  'Indiana': 'America/New_York',
  'Iowa': 'America/Chicago',
  'Kansas': 'America/Chicago',
  'Kentucky': 'America/New_York',
  'Louisiana': 'America/Chicago',
  'Maine': 'America/New_York',
  'Maryland': 'America/New_York',
  'Massachusetts': 'America/New_York',
  'Michigan': 'America/New_York',
  'Minnesota': 'America/Chicago',
  'Mississippi': 'America/Chicago',
  'Missouri': 'America/Chicago',
  'Montana': 'America/Denver',
  'Nebraska': 'America/Chicago',
  'Nevada': 'America/Los_Angeles',
  'New Hampshire': 'America/New_York',
  'New Jersey': 'America/New_York',
  'New Mexico': 'America/Denver',
  'New York': 'America/New_York',
  'North Carolina': 'America/New_York',
  'North Dakota': 'America/Chicago',
  'Ohio': 'America/New_York',
  'Oklahoma': 'America/Chicago',
  'Oregon': 'America/Los_Angeles',
  'Pennsylvania': 'America/New_York',
  'Rhode Island': 'America/New_York',
  'South Carolina': 'America/New_York',
  'South Dakota': 'America/Chicago',
  'Tennessee': 'America/Chicago',
  'Texas': 'America/Chicago',
  'Utah': 'America/Denver',
  'Vermont': 'America/New_York',
  'Virginia': 'America/New_York',
  'Washington': 'America/Los_Angeles',
  'West Virginia': 'America/New_York',
  'Wisconsin': 'America/Chicago',
  'Wyoming': 'America/Denver',
  'Puerto Rico': 'America/Halifax',
  // Canada
  'Alberta': 'America/Edmonton',
  'British Columbia': 'America/Vancouver',
  'Manitoba': 'America/Winnipeg',
  'New Brunswick': 'America/Halifax',
  'Newfoundland and Labrador': 'America/St_Johns',
  'Nova Scotia': 'America/Halifax',
  'Ontario': 'America/Toronto',
  'Prince Edward Island': 'America/Halifax',
  'Quebec': 'America/Toronto',
  'Saskatchewan': 'America/Winnipeg',
  'Northwest Territories': 'America/Edmonton',
  'Nunavut': 'America/Toronto',
  'Yukon': 'America/Vancouver',
};

// Reverse: detected browser timezone → likely country + state default.
// Used only on first load to prefill — user can override.
export const TZ_TO_COUNTRY_STATE = {
  'America/Los_Angeles': { country: 'United States', state: 'California' },
  'America/Denver': { country: 'United States', state: 'Colorado' },
  'America/Phoenix': { country: 'United States', state: 'Arizona' },
  'America/Chicago': { country: 'United States', state: 'Illinois' },
  'America/New_York': { country: 'United States', state: 'New York' },
  'America/Anchorage': { country: 'United States', state: 'Alaska' },
  'Pacific/Honolulu': { country: 'United States', state: 'Hawaii' },
  'America/Vancouver': { country: 'Canada', state: 'British Columbia' },
  'America/Edmonton': { country: 'Canada', state: 'Alberta' },
  'America/Winnipeg': { country: 'Canada', state: 'Manitoba' },
  'America/Toronto': { country: 'Canada', state: 'Ontario' },
  'America/Halifax': { country: 'Canada', state: 'Nova Scotia' },
  'America/St_Johns': { country: 'Canada', state: 'Newfoundland and Labrador' },
};
