const express = require("express");
const router = express.Router();
const {createActor,updateActor,removeActor,searchActor,getLatestActor,getSingleActor, getActors} = require("../controllers/actor");
const { uploadImage } = require("../middlewares/multer");
const { actorInfoValidator, validate } = require("../middlewares/validator");
const { isAuth, isAdmin } = require("../middlewares/auth");

router.post(
  "/create",
  isAuth,
  isAdmin,
  uploadImage.single("avatar"),
  actorInfoValidator,
  validate,
  createActor
);
router.post(
  "/update/:actorId", // "/actor/update/12152"
  isAuth,
  isAdmin,
  uploadImage.single("avatar"),
  actorInfoValidator,
  validate,
  updateActor
);
router.delete("/:actorId", isAuth, isAdmin, removeActor);
router.get("/search", isAuth, isAdmin, searchActor); // '/search?name=shah'
router.get("/latest-uploads", isAuth, isAdmin, getLatestActor);
router.get("/actors", isAuth, isAdmin, getActors); // "/actors?pageNo=${pageNo}&limit=${limit}"
router.get("/single/:id", getSingleActor);

module.exports = router;
