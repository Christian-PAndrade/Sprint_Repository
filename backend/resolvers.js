const rts = require("./routines");
const mongo = require("mongodb");

const resolvers = {
  // User queries
  users: async () => {
    // load db, get all users
    let db = await rts.loadDB();
    return await rts.findAll(db, "Users", {}, {});
  },
  userbyid: async args => {
    // load db, find user by id
    let db = await rts.loadDB();
    let o_id = new mongo.ObjectID(args.id);
    return await rts.findOne(db, "Users", { _id: o_id });
  },
  usersbyproject: async args => {
    // load db, find user by project id
    let db = await rts.loadDB();
    let o_id = new mongo.ObjectID(args.id);
    return await rts.findAll(db, "Users", { projectId: o_id }, {});
  },
  useradmin: async () => {
    let db = await rts.loadDB();
    return await rts.findAll(db, "Users", { isAdmin: true }, {});
  },

  // Project
  projects: async () => {
    let db = await rts.loadDB();
    return await rts.findAll(db, "Projects", {}, {});
  },

  // Mutations
  // Adds
  adduser: async args => {
    let db = await rts.loadDB();
    let user = {
      username: args.name,
      isAdmin: args.isAdmin,
      projectId: new mongo.ObjectID(args.projectId)
    };
    let results = await rts.addOne(db, "Users", user);
    return results.insertedCount === 1 ? user : null;
  },

  // Deletes
  deleteuser: async args => {
    let db = await rts.loadDB();
    let results = await rts.deleteOne(db, "Users", {
      _id: new mongo.ObjectID(args.id)
    });
    return results.insertedCount;
  },

  // Updates
  updateuser: async args => {
    let db = await rts.loadDB();
    let newUser = {
      username: args.name,
      isAdmin: args.isAdmin,
      projectId: new mongo.ObjectID(args.projectId)
    };

    let results = await rts.updateOne(
      db,
      "Users",
      {
        _id: new mongo.ObjectID(args.id)
      },
      newUser
    );
    console.log(results);
    return results.value ? newUser : null;
  }
};

module.exports = { resolvers };
