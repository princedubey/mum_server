import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod"; // Using Zod for schema validation

export const validateSchema = (schema: AnyZodObject) => (req: Request, res: Response, next: NextFunction): void => {
  try {
    console.log(req.body);
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

export interface CustomRequest extends Request {
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
  try {
    const {
      page = "1",
      limit = "10",
      get_all = "false",
      order_type = "asc",
      order_by,
      projection,
      search,
    } = req.query;

    const isGetAll = get_all === "true";
    const parsedPage = isGetAll ? 1 : Math.max(Number(page), 1);
    const parsedLimit = isGetAll ? null : Math.max(Number(limit), 1);
    const parsedSkip = isGetAll ? 0 : (parsedPage - 1) * (parsedLimit as number);

    const sort = order_by
      ? { [String(order_by)]: String(order_type).toLowerCase() === "desc" ? -1 : 1 }
      : null;

    // Parse projection fields into an object
    const parsedProjection = typeof projection === "string"
      ? projection.split(",").reduce((acc, field) => {
          acc[field.trim()] = 1;
          return acc;
        }, {} as Record<string, number>)
      : {};

    const searchQuery = search
      ? {
          $or: [
            { firstName: { $regex: search, $options: "i" } },
            { lastName: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    req.parsedFilterParams = {
      query: { ...searchQuery },
      skip: parsedSkip,
      limit: parsedLimit,
      sort,
      projection: parsedProjection,
    };

    next();
  } catch (error) {
    res.status(400).json({ error: "Invalid query parameters" });
  }
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

export const adminOrEmployeeValidation = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { role } = req.user as { role: string };
  if (role !== "admin" && role !== "employee") {
    res.status(403).json({
      success: false,
      message: "Access denied!",
      error_code: "INVALID_ACCESS",
    });
    return;
  }

  next();
};