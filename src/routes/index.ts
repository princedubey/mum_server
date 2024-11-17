import express, { Router } from 'express';
const router: Router = express.Router();

import userRoute from './userRoute';
import employeeRoute from './employeeRoute';

// Use the userRoute for any routes defined in userRoute
router.use('/users', userRoute);

// Use the employeeRoute for any routes defined in employeeRoute
router.use('/employee', employeeRoute);

export default router;
