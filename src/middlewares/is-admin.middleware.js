const { checkToken } = require("../utils/jwt");

const isAdmin = async (req, res, next) => {
  if (!req.headers.token) {
    res.status(401).json({ message: "Permission denied" });
  }

  checkToken(req.headers.token, async (err, data) => {
    if (err) {
      return res.status(401).json({ message: "Permission denied" });
    }

    req.user = data;

    if (!data.isAdmin) {
      return res.status(401).json({ message: "Permission denied" });
    }
    next();
  });
};

module.exports = isAdmin;


