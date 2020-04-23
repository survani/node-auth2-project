const db = require("../data/config");

//helper - to find all users with only id and username selected.
function findUsers() {
  return db("users").select("id", "username").orderBy("id", "asc");
}

//helper - to filter where the user is getting obtained...
function findBy(userFilter) {
  return db("users").where(userFilter);
}

//helper - to add a user to the database --
async function addUsers(user) {
  const [id] = await db("users").insert(user, "id");
  return findUsersById(id);
}

//helper - to find the user by id. This is important to the addUsers function above.
function findUsersById(id) {
  return db("users").where({ id }).first();
}

//exports the functions above to later be use in the user-router -- file.
module.exports = {
  findUsers,
  addUsers,
  findUsersById,
  findBy,
};
