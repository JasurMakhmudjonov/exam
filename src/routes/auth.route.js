const { Router } = require("express");
const router = Router();

const { register, login } = require("../controllers/auth.controller");

const route = "/auth";

router.post(`${route}/register`, register);
router.post(`${route}/login`, login);

module.exports = router;
