const session = require("express-session");
const knexSessionStore = require("connect-session-knex")(session);
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");

const restricted = require("./auth/restricted-middleware");
const userRouter = require("./users/user-router");
const authRouter = require("./auth/auth-router");

const server = express();

const sessionConfig = {
  name: "project-auth-2",
  secret: "secretsecret",
  cookie: {
    maxAge: 3600 * 1000,
    secure: false,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: false,

  store: new knexSessionStore({
    knex: require("./data/config"),
    tablename: "sessions",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 3600 * 1000,
  }),
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig));
//I will leave all routes from here this will help with limiting the work for this 3 hour sprint time limit.
server.use("/users", restricted, checkRole("hr"), userRouter);
server.use("/", authRouter);

server.get("/", (req, res) => {
  res.json({ ServerStatus: "Ready" });
});

module.exports = server;

function checkRole(department) {
  return (req, res, next) => {
    if (
      req.decodedToken &&
      req.decodedToken.department &&
      req.decodedToken.department.toLowerCase() === department
    ) {
      next();
    } else {
      res.status(403).json({ you: "can't enter" });
    }
  };
}
