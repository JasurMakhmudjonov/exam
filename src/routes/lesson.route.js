const { Router } = require("express");
const {
  createLesson,
  showLessons,
  updateLesson,
  deleteLesson,
} = require("../controllers/lesson.controller");
const isAdmin = require("../middlewares/is-admin.middleware");
const isAuth = require("../middlewares/is-auth.middlewares");
const router = Router();

const route = "/lessons";

router.post(`${route}/`, isAdmin, createLesson);
router.get(`${route}/`, isAuth, showLessons);
router.put(`${route}/:id`, isAdmin, updateLesson);
router.delete(`${route}/:id`, isAdmin, deleteLesson);

module.exports = router;

