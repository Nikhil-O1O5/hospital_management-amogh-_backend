import mongoose from "mongoose";
import express from "express"
import { Router } from "express";
import { patientMiddleware } from "../middlewares/patient.middleware.js";
import { getDetails, signin, signup } from "../controllers/patient.controller.js";

const router = Router();

router.post("/signup",signup);
router.post("/signin",signin);
router.get("/details",patientMiddleware,getDetails);

export default router