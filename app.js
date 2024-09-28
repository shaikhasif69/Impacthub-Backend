import express from "express";
import MongoStore from "connect-mongo";
import { connectDB } from "./db.js";
import fileUpload from "express-fileupload";
import cors from "cors";
import http from "http";
import userRouter from "./routers/userRoutes.js";
import driveRouter from "./routers/driveRoutes.js";

const port = 3000;
const app = express();
const server = http.createServer(app);
app.use(express.json());
connectDB();

app.use("/users", userRouter);
app.use("/drives", driveRouter);
app.use(express.static("public"));

app.set("views", "views");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.send(`OSCAR is very Cute`);
});

// socketHandler(server);
server.listen(port, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${port}`);
});
