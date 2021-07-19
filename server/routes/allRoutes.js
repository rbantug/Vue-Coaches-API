const express = require("express");

const coachController = require("../controllers/coachController");
const requestController = require("../controllers/requestController");
const authController = require("../controllers/authController");

const router = express.Router();

router.get("/coach", coachController.getAllCoaches);
router.post("/coach", authController.protect, coachController.postCoach);
router
	.route("/coach/:id")
	.get(coachController.getSingleCoach)
	.delete(coachController.deleteSingleCoach);

router.get("/request", authController.protect, requestController.getAllRequest);
router.get(
	"/request/:id",
	authController.protect,
	requestController.getOneRequest
);
router.post("/request", requestController.postRequest);

router.post("/signup", authController.signup);
router.post("/login", authController.login);

module.exports = router;
