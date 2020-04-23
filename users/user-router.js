express = require("express");

const usersModel = require("./user-model");

const router = express.Router();

//GET request - this will get us all the users in the database
//method is async
router.get("/", async (req, res) => {
  const allUsers = await usersModel.findUsers();
  try {
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(500).json("Error, please contact the developer of this API");
  }
});

module.exports = router;
