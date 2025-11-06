import userModel from "../models/userSchema.js";
import bcrypt from "bcryptjs";

const signup = async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;
  console.log(name, email, password, confirmPassword);

  if (!name || !email || !password || !confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "All field are required",
    });
  }
  if (password !== confirmPassword) {
    return res.status(400).json({
      success: false,
      message: "Password Do Not Match",
    });
  }
  try {
    const userInfo = userModel(req.body);
    const result = await userInfo.save();
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const signin = async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "All field are required",
    });
  }

  try {
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Eamil Not Registered",
      });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({
        success: false,
        message: "Wrong Password",
      });
    }

    const token = user.jwtToken();
    user.password = undefined;
    user.confirmPassword = undefined;

    const cookieOption = {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    };
    res.cookie("token", token, cookieOption);

    return res.status(200).json({
      success: true,
      message: "Login successfully",
      user,
      token,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const getUser = async (req, res, next) => {
  const userId = req.user.id;
  console.log("User Id is", userId);

  try {
    const user = await userModel.findById(userId);
    console.log("user is ", user);
    return res.status(200).json({
      success: true,
      message: "User Fetch Sucessfully",
      user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const logout = async (req, res, next) => {
  try {
    const cookieOption = {
      expires: new Date(),
      httpOnly: true,
    };
    res.cookie("token", null, cookieOption);
    return res.status(200).json({
      success: true,
      message: "Logout Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export { signup, signin, getUser, logout };
