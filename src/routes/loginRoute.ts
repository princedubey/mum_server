import express from 'express'
import { validateSchema } from '../middlewares/validationMiddleware';
import { loginUserSchema } from '../validation/userSchemaValidation';
import { login } from '../controllers/loginController';
const router = express.Router()


router.post('/',[validateSchema(loginUserSchema)],login)


export default router;