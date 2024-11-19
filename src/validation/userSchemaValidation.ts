import { z } from 'zod';

// Schema for user registration
export const userRegistrationSchema = z.object({
  // Personal Information
  firstName: z.string().min(3, "First name must be at least 3 characters").max(30, "First name must be at most 30 characters"),
  middleName: z.string().min(3, "Middle name must be at least 3 characters").max(30, "Middle name must be at most 30 characters"),
  lastName: z.string().min(3, "Last name must be at least 3 characters").max(30, "Last name must be at most 30 characters"),
  gender: z.string().min(3, "Gender must be at least 3 characters").max(10, "Gender must be at most 10 characters"),
  dob: z.string().min(10, "Date of birth must be in the format YYYY-MM-DD").max(10, "Date of birth must be in the format YYYY-MM-DD"),
  bloodGroup: z.string().min(2, "Blood group must be at least 2 characters").max(5, "Blood group must be at most 5 characters"),
  height: z.number().min(0, "Height must be a positive number"),
  weight: z.number().min(0, "Weight must be a positive number"),
  complexion: z.string().min(3, "Complexion must be at least 3 characters").max(30, "Complexion must be at most 30 characters"),
  hobbies: z.array(z.string()).min(1, "At least one hobby must be provided"),
  aboutMe: z.string().min(10, "About me must be at least 10 characters").max(500, "About me must be at most 500 characters"),
  profileImages: z.array(z.string()).min(1, "At least one profile image URL must be provided"),

  // Contact Information
  phoneNumber: z.string().min(10, "Phone number must be at least 10 characters").max(15, "Phone number must be at most 15 characters"),
  email: z.string().email("Invalid email address"),

  // Address Information
  residentialAddr: z.object({
    address: z.string().min(5, "Address must be at least 5 characters"),
    locality: z.string().min(3, "Locality must be at least 3 characters"),
    city: z.string().min(3, "City must be at least 3 characters"),
    district: z.string().min(3, "District must be at least 3 characters"),
    state: z.string().min(3, "State must be at least 3 characters"),
    pincode: z.string().min(6, "Pincode must be 6 digits").max(6, "Pincode must be 6 digits"),
  }),

  permanentAddr: z.object({
    address: z.string().min(5, "Address must be at least 5 characters"),
    locality: z.string().min(3, "Locality must be at least 3 characters"),
    city: z.string().min(3, "City must be at least 3 characters"),
    district: z.string().min(3, "District must be at least 3 characters"),
    state: z.string().min(3, "State must be at least 3 characters"),
    pincode: z.string().min(6, "Pincode must be 6 digits").max(6, "Pincode must be 6 digits"),
  }),

  // Educational and Professional Information
  eduAndProfInfo: z.object({
    highestEducation: z.string().min(3, "Highest education must be at least 3 characters"),
    otherEductionDetail: z.string().min(3, "Other education details must be at least 3 characters"),
    jobType: z.string().min(3, "Job type must be at least 3 characters"),
    designation: z.string().min(3, "Designation must be at least 3 characters"),
    workDetail: z.string().min(3, "Work details must be at least 3 characters"),
    income: z.number().min(0, "Income must be a positive number"),
  }),

  // Culture and Religious Information
  cultureAndReligiousInfo: z.object({
    religion: z.string().min(3, "Religion must be at least 3 characters"),
    caste: z.string().min(3, "Caste must be at least 3 characters"),
    subCaste: z.string().min(3, "Sub-caste must be at least 3 characters"),
    gotra: z.string().min(3, "Gotra must be at least 3 characters"),
    raasi: z.string().min(3, "Raasi must be at least 3 characters"),
  }),

  // Family Information
  familyInfo: z.object({
    fatherName: z.string().min(3, "Father's name must be at least 3 characters"),
    fatherOccupation: z.string().min(3, "Father's occupation must be at least 3 characters"),
    motherName: z.string().min(3, "Mother's name must be at least 3 characters"),
    motherOccupation: z.string().min(3, "Mother's occupation must be at least 3 characters"),
    noOfSiblings: z.number().min(0, "Number of siblings must be a positive number"),
    noOfBrothers: z.number().min(0, "Number of brothers must be a positive number"),
    noOfSisters: z.number().min(0, "Number of sisters must be a positive number"),
    familyType: z.string().min(3, "Family type must be at least 3 characters"),
  }),

  spouseExpctation: z.string().min(10, "Spouse expectation must be at least 10 characters"),

  // Additional Fields
  isApproved: z.boolean().optional(),
  tags: z.array(z.string()).min(1, "At least one tag must be provided"),
});

// Schema for employee login
export const loginUserSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  accessType: z.string()
});

// Example of types inferred from the schema
export type RegisterUserInput = z.infer<typeof userRegistrationSchema>;
export type LoginUserInput = z.infer<typeof loginUserSchema>;
