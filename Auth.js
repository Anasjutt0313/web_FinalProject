const jwt = require("jsonwebtoken");
const JWT_SECRET = "your_jwt_secret";

const authenticateToken = (req, res, next) => {
  try {
  
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) {
      return res.status(403).json({ message: "Access denied. No token provided." });
    }

    
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token." });
      }
      req.user = decoded; 
      next();
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = authenticateToken;
