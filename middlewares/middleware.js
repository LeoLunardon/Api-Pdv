function checkToken(req, res, next) {
  const token = localStorage.getItem("token");
  if (!token) return res.sendStatus(401);
  try {
    const secret = process.env.SECRET;
    jwt.verify(token, secret);
    next();
  } catch (error) {
    return res.sendStatus(401);
  }
}

module.exports = {
  checkToken,
};
