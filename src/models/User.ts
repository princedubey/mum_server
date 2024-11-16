import mongoose, { Schema, model } from "mongoose";

interface IPersonalInfo {
  // Personal information
  firstname: string;
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

interface IUser {
  createdBy: Schema.Types.ObjectId;

  personalInfo: IPersonalInfo;

  contactInfo: IContactInfo

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
