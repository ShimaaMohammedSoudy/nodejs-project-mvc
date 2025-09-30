
 const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Access denied. Admins only." });
  }
  next();
};


const isUser = (req, res, next) => {
  if (req.user.role !== "user") {
    return res.status(403).json({ msg: "Access denied. Users only." });
  }
  next();
};
 
export {isAdmin,isUser}
