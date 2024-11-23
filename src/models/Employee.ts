import mongoose, { Schema, model } from "mongoose";
/**
 * Represents an employee in the system.
 * @interface IEmployee
 * @property {string} firstName - The first name of the employee.
 * @property {string} lastName - The last name of the employee.
 * @property {string} email - The email address of the employee.
 * @property {string} password - The password of the employee.
 * @property {string} phoneNumber - The phone number of the employee.
 * @property {string} post - The job post of the employee.
 * @property {string} designation - The designation or job title of the employee.
 * @property {string} postingPlace - The place where the employee is posted or works.
 * @property {string} role - The role of the employee in the system (either 'admin' or 'employee').
 * @property {[string]} access - An array of access rights or permissions granted to the employee.
 * @property {[string]} createdAt - Creation date of the employee
 * @property {[string]} updatedAt - Last update date of the employee
 * @property {[boolean]} isActive - Status of the employee
 * @property {[string]} employeeId - Id of the employee
 */
export interface IEmployee {
  createdBy: string | null; // The id of the admin who created the employee
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber: string;
  post: string;
  designation: string;
  postingPlace: string;
  role: string; // admin | employee
  access: [string]; // edit, read, delete
  createdAt: string;
  updatedAt: string;
  isActive: boolean; // whether the employee is currently active or not
  employeeId: string; // the id of the employee
  companyName: string; // company name
}

const employeeSchema = new Schema<IEmployee>(
  {
    createdBy: { type: String, required: false },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    post: { type: String, required: true },
    designation: { type: String, required: true },
    postingPlace: { type: String, required: true },
    role: { type: String, required: true, enum: ["admin", "employee"] },
    access: [{ type: String, required: true }],
    isActive: { type: Boolean, default: true },
    employeeId: { type: String, default: "NA" },
    companyName: { type: String, default: "NA" }, // company name for employee's details
  },
  { timestamps: true, versionKey: false }
);

const EmployeeModel =
  mongoose.models.Employee || model<IEmployee>("Employee", employeeSchema);

export default EmployeeModel;
