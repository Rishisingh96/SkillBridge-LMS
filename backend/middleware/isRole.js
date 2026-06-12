const isRole = (...roles) => {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    console.log("===== ROLE DEBUG =====");
    console.log("User:", req.user);
    console.log("Required Roles:", roles);

    next();
  };
};

export default isRole;