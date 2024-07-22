const { Router } = require("express");
const router = Router();
const {
  createCourse,
  showCourses,
  updateCourse,
  deleteCourse,
} = require("../controllers/course.controller");
const isAdmin = require("../middlewares/is-admin.middleware");
const isAuth = require("../middlewares/is-auth.middlewares");

const route = "/courses";

router.post(`${route}/`, isAdmin, createCourse);
router.get(`${route}/`, isAuth, showCourses);
router.put(`${route}/:id`, isAdmin, updateCourse);
router.delete(`${route}/:id`, isAdmin, deleteCourse);

module.exports = router;
