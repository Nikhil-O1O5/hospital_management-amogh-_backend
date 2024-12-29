import mongoose from "mongoose";
import express from "express"
import { Router } from "express";
import { addAppointment, addPrescription, deletePatient, getPatients, signin, signup } from "../controllers/doctor.controller.js";
import { doctorAuth } from "../middlewares/doctor.middleware.js";

const router = Router();

router.post("/signup",signup);
router.post("/signin",signin);
router.get("/",doctorAuth,getPatients);
router.delete("/deletepatient",doctorAuth,deletePatient);
router.put("/addpatientappointment",doctorAuth,addAppointment);
router.put("/giveprescription",doctorAuth,addPrescription);

export default router