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

interface CustomRequest extends Request {
  parsedFilterParams?: {
    query: Record<string, any>;
    skip: number;
    limit: number | null;
    sort: Record<string, number> | null;
    projection: Record<string, any>;
  };
}

export const parseFilterParams = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let {
    page = 1,
    limit = 10,
    skip = 0,
    sort = null,
    get_all,
    order_type,
    order_by,
  } = req.query as Record<string, any>;

  console.log(req.query)
  // Convert query params to expected types
  page = Number(page);
  limit = get_all ? null : Number(limit);
  skip = get_all ? 0 : (page - 1) * (limit as number);

  const sortObj: Record<string, number> = {};
  if (order_by) {
    sortObj[order_by] = order_type === 'desc' ? -1 : 1;
  }

  req.parsedFilterParams = {
    query: {},
    skip,
    limit,
    sort: order_by ? sortObj : null,
    projection: {},
  };

  next();
};

export const adminValidation = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
    const { role } = req.user as { role: string };
    if (role != "admin") {
      res.status(403).json({
        success: false,
        message: "Access denied!",
        error_code: "INVALID_ACCESS",
      });
      return;
    }

    next();
};

