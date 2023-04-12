const express = require("express");
const path = require("path");
const cors = require("cors");
const passport = require("passport");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const userRouter = require("./routes/userRoutes");
const answersRouter = require("./routes/answersRoutes");
const questionsRouter = require("./routes/questionRoutes");
const commentsRouter = require("./routes/commentRoutes");
const notificationsRouter = require("./routes/notificationsRoutes");
const rewardsRouter = require("./routes/rewardsRoutes");
const rewardLogRouter = require("./routes/rewardLogRoutes");
const FAQRouter = require("./routes/faqRoutes");
const authRouter = require("./routes/authRoutes");
const contactsRouter = require("./routes/contactsRoutes");
const dotenv = require("dotenv");
var bodyParser = require("body-parser");
const socketio = require("socket.io");
const passportSetup = require("./passport");
const jwt = require("jsonwebtoken");
const authSocketMiddleware = require("./middlewares/authSocketMiddleware");

dotenv.config({ path: "./config.env" });

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use("/static/users", express.static(path.join(__dirname, "uploads/users")));
app.use(
  "/static/questions",
  express.static(path.join(__dirname, "uploads/questions"))
);
app.use(
  "/static/answers",
  express.static(path.join(__dirname, "uploads/answers"))
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;

const server = require("http").Server(app);
let users = {};

const io = socketio(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  const token = socket.handshake.query.token;
  console.log("tokens", token);
  if (token && token !== "") {
    try {
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      if (decoded.id in users) {
        delete users[decoded.id];
        users[decoded.id] = socket.id;
      } else {
        users[decoded.id] = socket.id;
      }
    } catch (err) {
      console.log("no token");
    }
  }
  console.log("users", users);
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("send-notification", (user_id) => {
    console.log("nots", user_id, users[user_id]);
    socket.to(users[user_id]).emit("receive_notification");
  });

  socket.on("send-coins", (user_id) => {
    console.log("coin", user_id, users[user_id]);
    socket.to(users[user_id]).emit("receive_coins");
  });

  // socket.on("leave-room", (chatId) => {
  //   socket.leave(chatId);
  // });

  // socket.on("new-message", (event) => {
  //   socket.to(event.data.events[1]).emit("push-new-message", event);
  // });

  socket.on("valor", ({ id, name }, callback) => {
    console.log("data::", id, name);

    socket.emit(
      "receiveGreet",
      { data: "This message from server" },
      (error) => {
        console.log("error::", error);
      }
    );
    callback();
  });

  socket.on("send-message", (message) => {
    io.emit("receive-message", message);
  });

  // socket.on("typing", (data) => {
  //   console.log({ data });
  //   socket.to(data.chatId).emit("typing-status", data);
  // });
});

app.use(
  cookieSession({
    name: "session",
    keys: ["answerout"],
    maxAge: 24 * 60 * 60 * 100,
  })
);

app.use(passport.initialize());
app.use(passport.session());

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose.set("strictQuery", false);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("mongodb database connected"))
  .catch((err) => console.log("error mongo", err));

app.use(cors());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/answers", answersRouter);
app.use("/api/v1/questions", questionsRouter);
app.use("/api/v1/comments", commentsRouter);
app.use("/api/v1/notifications", notificationsRouter);
app.use("/api/v1/rewards", rewardsRouter);
app.use("/api/v1/rewardLog", rewardLogRouter);
app.use("/api/v1/contacts", contactsRouter);
app.use("/api/v1/faq", FAQRouter);
app.use("/auth", authRouter);

server.listen(port, () => console.log(`app is started at ${port}`));
