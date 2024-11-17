import { z } from 'zod';

// Schema for employee registration
export const registerEmployeeSchema = z.object({
  firstName: z.string().min(3, "First name must be at least 3 characters").max(30, "First name must be at most 30 characters"),
  lastName: z.string().min(3, "Last name must be at least 3 characters").max(30, "Last name must be at most 30 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 characters").max(15, "Phone number must be at most 15 characters"),
  post: z.string().min(3, "Job post must be at least 3 characters"),
  designation: z.string().min(3, "Designation must be at least 3 characters"),
  postingPlace: z.string().min(3, "Posting place must be at least 3 characters"),
  role: z.enum(["admin", "employee"]).superRefine((val, ctx) => {
    if (!["admin", "employee"].includes(val)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Role must be either 'admin' or 'employee'",
        path: ['role'],
      });
    }
  }),
  access: z.array(z.enum(["edit", "read", "delete"])).min(1, "At least one access permission must be provided"),
  password: z.string().min(6, "Password must be at least 6 characters").max(128, "Password must be at most 128 characters"),
  isActive: z.boolean().optional(), // Optional field; defaults to true in the database
});

// Schema for employee login
export const loginEmployeeSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Example of types inferred from the schemas
export type RegisterEmployeeInput = z.infer<typeof registerEmployeeSchema>;
export type LoginEmployeeInput = z.infer<typeof loginEmployeeSchema>;
