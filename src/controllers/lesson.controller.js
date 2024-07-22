const path = require("path");
const Joi = require("joi");
const { v4: uuid } = require("uuid");
const { prisma } = require("../utils/connection");

const createLesson = async (req, res) => {
  try {
    const { title, course_id, user_id } = req.body;
    const { video } = req.files;

    const schema = Joi.object({
      title: Joi.string().required(),
      course_id: Joi.string().required(),
      user_id: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const findCourse = await prisma.courses.findUnique({
      where: { id: course_id },
    });
    if (!findCourse) {
      return res.status(404).json({ message: "Course not found" });
    }

    const findUser = await prisma.users.findUnique({ where: { id: user_id } });
    if (!findUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const videoName = `${uuid()}${path.extname(video.name)}`;
    video.mv(`${process.cwd()}/uploads/${videoName}`);

    const newLesson = await prisma.lessons.create({
      data: { title, course_id, user_id, video: videoName },
    });

    res.status(201).json({ message: "Lesson created", newLesson });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const showLessons = async (req, res) => {
  try {
    const lessons = await prisma.lessons.findMany({
      select: {
        id: true,
        title: true,
        course_id: true,
        user_id: true,
        video: true,
        course: {
          select: {
            id: true,
            title: true,
          },
        },
        user: {
          select: {
            id: true,
            fullname: true,
            phone_number: true,
          },
        },
      },
    });
    res.json({ lessons });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const updateLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, course_id, user_id } = req.body;
    const video = req.files?.video;

    const schema = Joi.object({
      title: Joi.string(),
      course_id: Joi.string(),
      user_id: Joi.string(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(400).json({ message: error.message });
    }

    const findLesson = await prisma.lessons.findUnique({ where: { id } });
    if (!findLesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    let videoName;
    if (video) {
      videoName = `${uuid()}${path.extname(video.name)}`;
      video.mv(`${process.cwd()}/uploads/${videoName}`);
    } else {
      videoName = findLesson.video;
    }

    const updatedLesson = await prisma.lessons.update({
      where: { id },
      data: { title, course_id, user_id, video: videoName },
    });

    res.status(200).json({ message: "Lesson updated", updatedLesson });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteLesson = async (req, res) => {
  try {
    const { id } = req.params;
    const findLesson = await prisma.lessons.findUnique({ where: { id } });
    if (!findLesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    await prisma.lessons.delete({ where: { id } });
    res.json({ message: "Lesson deleted" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  createLesson,
  showLessons,
  updateLesson,
  deleteLesson,
};
