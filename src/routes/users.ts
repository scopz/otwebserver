import { Router } from "express";

export const router = Router();

/* GET users listing. */
router.get('/', (req, res, next) =>
  res.send('respond with a resource')
);
