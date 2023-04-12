const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(401); // unauthorized
    const rolesArray = [...allowedRoles];
    const result = req.roles
      .map((role) => rolesArray.includes(role))
      .find((val) => val === true); //? we need at least one to be true
    if (!result) return res.sendStatus(401); //! no trues
    next();
  };
};

module.exports = verifyRoles;
