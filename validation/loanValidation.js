import { z } from "zod";

// Guarantor validation schema
const guarantorSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().trim().optional(),
  cnic: z.string().length(13, "CNIC must be 13 characters"),
  location: z.string().min(1, "Location is required"),
});

// Main Loan Request validation schema
const loanValidationSchema = z.object({
  user: z.string().min(1, "User ID is required"), // Assuming ObjectId as string

  userName: z.string().min(1, { message: "Name is required" }),
  userEmail: z.string().email({ message: "Invalid email format" }),
  userCnic: z.string().length(13, { message: "CNIC must be exactly 13 digits" }),

  category: z.string().min(1, "Category is required"),
  subCategory: z.string().min(1, "Subcategory is required"),

  requestedAmount: z.number().min(1, "Requested amount must be positive"),
  initialPayment: z.number().min(1, "Initial payment must be positive"),
  durationMonths: z.number().min(1, "Duration must be greater than 0"),
  monthlyInstallment: z.number().min(1, "Installment must be positive"),

  guarantors: z
    .array(guarantorSchema)
    .length(2, "Exactly 2 guarantors required")
    .refine((guarantors) => guarantors[0].cnic !== guarantors[1].cnic, {
      message: "Guarantors must have different CNICs",
    }),

  salarySlipURL: z
    .string()
    .min(1, "Salary slip URL is required")
    .regex(/^https?:\/\/.*\.(jpg|jpeg|png|gif)$/, "Invalid image URL format!"),

  token: z.string().min(1, "Token is required"),

  qrCodeURL: z.string().min(1, "QR Code URL is required"),

  appointmentDate: z.string(),
  appointmentLocation: z.string(),
  appointmentTime: z.string().min(1, "Time is required"),

  loanStatus: z.enum(["Pending", "Approved", "Rejected"]).default("Pending"),

  createdAt: z.coerce.date().default(() => new Date()),
  updatedAt: z.coerce.date().default(() => new Date()),
});

export { loanValidationSchema };
