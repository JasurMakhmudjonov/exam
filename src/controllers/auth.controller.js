const { prisma } = require("../utils/connection");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { createToken, checkToken } = require("../utils/jwt");

const register = async (req, res, next) => {
  try {
    const { fullname, phone_number, password, isAdmin } = req.body;
    const schema = Joi.object({
      fullname: Joi.string().min(3).max(50).required(),
      phone_number: Joi.string()
        .pattern(/^\d{9}$/)
        .required(),
      password: Joi.string().min(4).required(),
      isAdmin: Joi.boolean().optional(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      console.log(error);
      return res.status(400).json({ message: error.message });
    }
    const existsUser = await prisma.users.findUnique({
      where: { phone_number },
    });
    if (existsUser) {
      return res.status(400).json({ message: "Phone number already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
      data: {
        fullname,
        phone_number,
        password: hashedPassword,
        isAdmin: isAdmin || false,
      },
    });

    const token = createToken({ id: user.id, isAdmin: user.isAdmin });
    res
      .status(201)
      .json({ message: "User registered successfully", user, token });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { phone_number, password } = req.body;
    const schema = Joi.object({
      phone_number: Joi.string()
        .pattern(/^\d{9}$/)
        .required(),
      password: Joi.string().min(4).required(),
    });
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }
    const user = await prisma.users.findUnique({
      where: { phone_number },
    });
    if (!user) {
      return res
        .status(401)
        .json({ message: "Invalid phone number or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(401)
        .json({ message: "Invalid phone number or password" });
    }

    const token = createToken({ id: user.id, isAdmin: user.isAdmin });

    res.json({ message: "Logged in successfully", user, token });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login };
