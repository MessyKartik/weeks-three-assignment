import mongoose from "mongoose";
import JWT from "jsonwebtoken";
import bcrypt from "bcryptjs";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false
    },
    confirmPassword: {
      type: String,
      required: [true, "Please confirm your password"],
    //   select: false
    },
    forgotPasswordToken: {},
    forgotPasswordExpiryDate: {},
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
    if(!this.isModified('password') ){
        return next();
    }
    this.password = await bcrypt.hash(this.password,10);
    return next();
})

userSchema.methods = {
  jwtToken() {
    return JWT.sign(
      { id: this._id, email: this.email },
      process.env.SECRET,
      { expiresIn: '24h' }
    );
  },
};

const userModel = mongoose.model("User", userSchema);
export default userModel;
