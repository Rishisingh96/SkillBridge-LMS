const isRole = (...roles) => {
  return (req, res, next) => {
    if (!req.userRole) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    if (!roles.includes(req.userRole)) {
      return res.status(403).json({ message: `Access denied. ${roles.join(" or ")} role required` });
    }
    next();
  };
};

export default isRole;