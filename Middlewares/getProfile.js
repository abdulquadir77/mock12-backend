const jwt = require("jsonwebtoken");

const authenticate = async (req, res, next) => {
  const header_token = req.headers.authorization;

  if (header_token === undefined) {
    res.send("Header not passed");
  } else {
    const token = header_token.split(" ")[1];
    try {
      const decode = await jwt.verify(token, "mock12");
      if (decode?.userId.length > 0) {
        req.body.userId = decode.userId;
        next();
      } else {
        res.send("login again");
      }
    } catch (error) {
      res.send("user not authenticate");
      res.send(error);
    }
  }
};

module.exports = authenticate;
