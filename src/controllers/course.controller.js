const path = require("path");
const Joi = require("joi");
const { v4: uuid } = require("uuid");
const { prisma } = require("../utils/connection");

const createCourse = async (req, res) => {
  try {
    const { title, description } = req.body;
    const { image } = req.files;

    const schema = Joi.object({
      title: Joi.string().required(),
      description: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const imageName = `${uuid()}${path.extname(image.name)}`;
    image.mv(`${process.cwd()}/uploads/${imageName}`);

    const newCourse = await prisma.courses.create({
      data: { title, description, image: imageName },
    });

    res.status(201).json({ message: "Course created", newCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const showCourses = async (req, res) => {
  try {
    const courses = await prisma.courses.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        image: true,
      },
    });
    res.json({ courses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const image = req.files?.image;

    const schema = Joi.object({
      title: Joi.string(),
      description: Joi.string(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const findCourse = await prisma.courses.findUnique({ where: { id } });
    if (!findCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    let imageName;
    if (image) {
      imageName = `${uuid()}${path.extname(image.name)}`;
      image.mv(`${process.cwd()}/uploads/${imageName}`);
    } else {
      imageName = findCourse.image;
    }

    const updatedCourse = await prisma.courses.update({
      where: { id },
      data: { title, description, image: imageName },
    });

    res.status(200).json({ message: "Course updated", updatedCourse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params;
    const findCourse = await prisma.courses.findUnique({ where: { id } });
    if (!findCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    await prisma.courses.delete({ where: { id } });
    res.json({ message: "Course deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createCourse,
  showCourses,
  updateCourse,
  deleteCourse,
};
