export interface UserProfile {
  id: string;
  name: string;
  designation: string;
  station: string;
  payLevel: string;
  basicPay: string;
  pfNumber: string;
  headquarters: string;
  branch: string;
  division: string;
}

export interface TaEntry {
  id: string;
  date: string; // YYYY-MM-DD
  trainNo: string;
  departureTime: string; // HH:mm
  arrivalTime: string;   // HH:mm
  fromStation: string;
  toStation: string;
  kms: string;
  dayNightPercent: string; // 30%, 70%, 100%
  purpose: string;
  rate: string;
  conveyanceDistance: string; // Column 11
  reference: string; // Column 12
}

export interface MonthData {
  id: string; // year-month-profileId
  profileId: string;
  year: number;
  month: number;
  entries: TaEntry[];
  isLocked?: boolean;
}

export const COLUMNS = [
  { id: 1, label: "Month & Date", subLabel: "माह और तारीख" },
  { id: 2, label: "Train No.", subLabel: "गाड़ी का क्रमांक" },
  { id: 3, label: "Time Left", subLabel: "प्रस्थान समय" },
  { id: 4, label: "Time Arrived", subLabel: "आगमन समय" },
  { id: 5, label: "From", subLabel: "से" },
  { id: 6, label: "To", subLabel: "तक" },
  { id: 7, label: "Kms.", subLabel: "कि. मी." },
  { id: 8, label: "Day/Night", subLabel: "दिन/रात" },
  { id: 9, label: "Object of Journey", subLabel: "यात्रा का उद्देश्य" },
  { id: 10, label: "Rate", subLabel: "दर" },
  { id: 11, label: "Distance (Pvt/Public)", subLabel: "दूरी (प्राइवेट/सार्वजनिक)" },
  { id: 12, label: "Ref Item 20", subLabel: "दूरी-अनुसूची संदर्भ" },
];
