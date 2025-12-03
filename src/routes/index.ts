import express from "express";

import accommodationRoute from "@/routes/accommodation.route";
import authRoute from "@/routes/auth.route";
import chatRoute from "@/routes/chat.route";
import cityRoute from "@/routes/city.route";
import festivalRoute from "@/routes/festival.route";
import foodRoute from "@/routes/food.route";
import placeRoute from "@/routes/place.route";
import scheduleRoute from "@/routes/schedule.route";
import uploadRoute from "@/routes/upload.route";
import userRoute from "@/routes/user.route";

const router = express.Router();
router.use("/users", userRoute);
router.use("/auth", authRoute);
router.use("/upload", uploadRoute);
router.use("/cities", cityRoute);
router.use("/schedules", scheduleRoute);
router.use("/foods", foodRoute);
router.use("/accommodations", accommodationRoute);
router.use("/festivals", festivalRoute);
router.use("/chat", chatRoute);
router.use("/places", placeRoute);

export default router;
