import express from "express";

import accommodationRoute from "@/routes/accommodation.route";
import attractionRoute from "@/routes/attraction.route";
import authRoute from "@/routes/auth.route";
import cityRoute from "@/routes/city.route";
import festivalRoute from "@/routes/festival.route";
import foodRoute from "@/routes/food.route";
import scheduleRoute from "@/routes/schedule.route";
import uploadRoute from "@/routes/upload.route";
import chatRoute from "@/routes/chat.route";

const router = express.Router();
router.use("/", authRoute);
router.use("/upload", uploadRoute);
router.use("/cities", cityRoute);
router.use("/schedules", scheduleRoute);
router.use("/foods", foodRoute);
router.use("/accommodations", accommodationRoute);
router.use("/festivals", festivalRoute);
router.use("/attractions", attractionRoute);
router.use("/chat", chatRoute);

export default router;
