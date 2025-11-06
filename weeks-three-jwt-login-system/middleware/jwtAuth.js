import JWT from "jsonwebtoken";

const jwtAuth = (req, res, next) => {
  const token =
    req.cookies?.token ||
    (req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
      ? req.headers.authorization.split(" ")[1]
      : null);
  console.log("Token is : ", token);
  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Unverified User",
    });
  }

  try {
    const payload = JWT.verify(token, process.env.SECRET);
    console.log("Payload is", payload);
    console.log("Payload id is ", payload.id);
    console.log("Payload email is ", payload.email);
    req.user = { id: payload.id, email: payload.email };
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
  next();
};

export default jwtAuth;
