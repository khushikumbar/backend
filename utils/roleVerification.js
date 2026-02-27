const jwt = require("jsonwebtoken");


const protectRoutes = async (req, res, next) => {
  let token;


  if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;

    try {
      const decodedData = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decodedData; 
      return next();
    } catch (err) {
      return res.status(401).json({
        message: "Invalid token or token has expired",
      });
    }
  }

 
  return res.status(401).json({
    status: false,
    message: "Not authorized, token not available",
  });
};


module.exports = {
  protectRoutes
};