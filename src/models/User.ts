import mongoose, { Schema, model } from "mongoose";

interface IPersonalInfo {
  // Personal information
  firstName: string;
  middleName: string;
  lastName: string;
  gender: string;
  dob: string;
  bloodGroup: string;
  height: number;
  weight: number;
  complexion: string;
  hobbies: [string];
  aboutMe: string;
  profileImages: [string];
}

interface IContactInfo {
  phoneNumber: string;
  email: string;
}

interface IAddress {
  address: string;
  locality: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
}

interface IEducationalAndProfessionInfo {
  highestEducation: string;
  otherEductionDetail: string;
  jobType: string;
  designation: string;
  workDetail: string;
  income: number;
}

interface ICultureAndReligiousInfo {
  religion: string;
  caste: string;
  subCaste: string;
  gotra: string;
  raasi: string;
}

interface IFamilyInfo {
  fatherName: string;
  fatherOccupation: string;
  motherName: string;
  motherOccupation: string;
  noOfSiblings: number;
  noOfBrothers: number;
  noOfSisters: number;
  familyType: string;
}

export interface IUser {
  createdBy: Schema.Types.ObjectId;

  personalInfo: IPersonalInfo;

  contactInfo: IContactInfo;

  // residential address
  residentialAddr: IAddress;
  permanentAddr: IAddress;
  // Educational and professional information
  eduAndProfInfo: IEducationalAndProfessionInfo;
  // Culture and religious information
  cultureAndReligiousInfo: ICultureAndReligiousInfo;
  // Family information
  familyInfo: IFamilyInfo;

  spouseExpctation: string;

  createdAt: Date;
  updatedAt: Date;

  isApproved: boolean;

  tags: [string];
}

const userSchema = new Schema<IUser>(
  {
    createdBy: { type: Schema.Types.ObjectId, required: true },

    personalInfo: {
      firstname: { type: String, required: true },
      middleName: { type: String },
      lastName: { type: String, required: true },
      gender: { type: String, required: true },
      dob: { type: Date, required: true },
      bloodGroup: { type: String },
      height: { type: Number },
      weight: { type: Number },
      complexion: { type: String },
      hobbies: [{ type: String }],
      aboutMe: { type: String },
      profileImages: [{ type: String }],
    },

    contactInfo: {
      phoneNumber: { type: String, required: true },
      email: { type: String, required: true },
    },
    residentialAddr: {
      address: { type: String },
      locality: { type: String },
      city: { type: String },
      district: { type: String },
      state: { type: String },
      pincode: { type: String },
    },
    permanentAddr: {
      address: { type: String },
      locality: { type: String },
      city: { type: String },
      district: { type: String },
      state: { type: String },
      pincode: { type: String },
    },
    eduAndProfInfo: {
      highestEducation: { type: String },
      otherEductionDetail: { type: String },
      jobType: { type: String },
      designation: { type: String },
      workDetail: { type: String },
      income: { type: Number },
    },
    cultureAndReligiousInfo: {
      religion: { type: String },
      caste: { type: String },
      subCaste: { type: String },
      gotra: { type: String },
      raasi: { type: String },
    },
    familyInfo: {
      fatherName: { type: String },
      fatherOccupation: { type: String },
      motherName: { type: String },
      motherOccupation: { type: String },
      noOfSiblings: { type: Number },
      noOfBrothers: { type: Number },
      noOfSisters: { type: Number },
      familyType: { type: String },
    },
    spouseExpctation: { type: String },
    isApproved: { type: Boolean, default: false },
    tags: [{ type: String }],
  },
  { timestamps: true }
);

const UserModel = mongoose.models.User || model<IUser>("User", userSchema);

export default UserModel;
