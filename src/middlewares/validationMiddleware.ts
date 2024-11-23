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

// export const parseFilterParams = async (
//   req: CustomRequest,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   let {
//     page = 1,
//     limit = 10,
//     skip = 0,
//     sort = null,
//     get_all,
//     order_type,
//     order_by,
//   } = req.query as Record<string, any>;

//   // console.log(req.query)
//   // Convert query params to expected types
//   page = Number(page);
//   limit = get_all ? null : Number(limit);
//   skip = get_all ? 0 : (page - 1) * (limit as number);

//   const sortObj: Record<string, number> = {};
//   if (order_by) {
//     sortObj[order_by] = order_type === 'desc' ? -1 : 1;
//   }

//   req.query = {
//     query: {},
//     skip,
//     limit,
//     sort: order_by ? JSON.stringify(sortObj) : undefined,
//     projection: {},
//   };

//   next();
// };

// example to send request parameters
// GET /all-employee?page=2&limit=10&order_by=name&order_type=asc&projection=name,email,department

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
          acc[field.trim()] = 1; // Include field in projection
          return acc;
        }, {} as Record<string, number>)
      : {};

    req.parsedFilterParams = {
      query: {},
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

