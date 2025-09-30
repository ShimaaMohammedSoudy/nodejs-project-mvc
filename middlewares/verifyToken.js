import jwt from "jsonwebtoken";

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token){
  res.status(401).json({ msg: "No token provided" });
  }else{
  jwt.verify(token, "mysecretpassword", (err, decoded) => {
    if (err) return res.status(401).json({ msg: "Invalid token" });

    req.user = decoded; 
    next();
  
  });
}
};

export default verifyToken;
