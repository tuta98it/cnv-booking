// Enum for Gender
export enum Gender {
  FEMALE = 0,
  MALE = 1,
  OTHER = 2, // Optional: Add more options if needed
}

// Gender options for dropdowns or selection lists
export const GENDER_OPTIONS = [
  { label: 'Nam', value: Gender.MALE },
  { label: 'Nữ', value: Gender.FEMALE },
  { label: 'Khác', value: Gender.OTHER }, // Optional
];

// Mapping Gender enum values to text labels
export const TEXT_GENDER = {
  [Gender.MALE]: 'Nam',
  [Gender.FEMALE]: 'Nữ',
  [Gender.OTHER]: 'Khác', // Optional
};
