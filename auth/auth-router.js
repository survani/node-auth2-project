const router = require("express").Router();
const bcrypt = require("bcryptjs");
const Users = require("../users/user-model");
const jsonwebtoken = require("jsonwebtoken");

const { tokenSecret } = require("../config/secrets");

//registers a user to the database to later be able to login to see the protected user-router endpoint (all users).
router.post("/register", async (req, res) => {
  const userBody = req.body;
  const hash = bcrypt.hashSync(userBody.password, 10);
  userBody.password = hash;

  const addAuthUser = await Users.addUsers(userBody);

  try {
    res.status(201).json(addAuthUser);
  } catch (error) {
    res.status(500).json("Error, please contact the developer of this API");
  }
});

//A user will be able to login with their credentials to access the user-router endpoint. They will get a success message: welcome (username)! if user enters their credentials incorrectly they will be promted to try again.
router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then((user) => {
      console.log(password);
      if (user && bcrypt.compareSync(password, user.password)) {
        const token = generateToken(user);

        req.session.user = username;
        res.status(200).json({ message: `Welcome ${username}!`, token });
      } else {
        res
          .status(401)
          .json("Looks like you enter the wrong username or password");
      }
    })
    .catch((error) => {
      res.status(500).json("Error, please contact the developer of this API");
    });
});

function generateToken(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    department: user.department,
  };

  const options = {
    expiresIn: "1h",
  };
  return jsonwebtoken.sign(payload, tokenSecret, options);
}
//trying to make it work.. Not yet done..
// router.post("/login", async (req, res) => {
//   let { username, password } = req.body,
//     findUsersInfo = Users.findBy({ username }).first();
//   try {
//     if (findUsersInfo && bcrypt.compare(password, findUsersInfo.password)) {
//       req.session.user = username;
//       res.status(200).json({ message: `Welcome ${username}!` });
//     } else {
//       res
//         .status(401)
//         .json("Looks like you entered the wrong credentials. Try again");
//     }
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

//The user has the ability to logout when they are logged in. Cookie will be removed making the session loose their access to the user-router endpoints.
router.delete("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        res.status(400).json("seems like there was an issue logging you out!");
      } else {
        res.json("You have been successfully logged out!");
      }
    });
  }
});
module.exports = router;
