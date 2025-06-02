import jwt from "jsonwebtoken";

export const userMiddleware = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token)
      return res.status(401).json({ success: false, message: "Unauthorized" });
  
    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      
      // console.log("DECODED TOKEN PAYLOAD:", decoded);
      
      if (err) {
        const message =
          err.name === "TokenExpiredError"
            ? "Token has expired"
            : "Invalid token";
        return res.status(401).json({ success: false, message });
      }
  
      
      if (!decoded?.userType) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid token payload" });
      }
  
      if (decoded.userType !== "USER") {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });
      }
  
     
      req.user = decoded;
      next();
    });
  };