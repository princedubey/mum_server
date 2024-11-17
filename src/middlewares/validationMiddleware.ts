import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod"; // Using Zod for schema validation

export const validateSchema = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction): void => {
  try {
    schema.parse(req.body); // Validate the request body using Zod
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const cleanMessage = err.errors
        .map(detail => detail.message.replace(/\"/g, ""))
        .join(", ");

      res.status(400).json({
        success: false,
        message: cleanMessage,
      });
    } else {
      next(err); // Pass unexpected errors to the global error handler
    }
  }
};
