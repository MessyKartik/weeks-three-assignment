import mongoose from "mongoose";

const MONDB_URL = process.env.MONDB_URL || "mongodb://localhost:27017/weeks-two-auth";

const databaseConnect = () => {
  mongoose
    .connect(MONDB_URL)
    .then((conn) => console.log(`Conncyted to DB ${conn.connection.host}`))
    .catch((err) => console.log(err.message));
};

export default databaseConnect;
