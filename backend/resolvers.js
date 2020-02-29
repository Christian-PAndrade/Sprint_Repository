const rts = require("./routines");

const resolvers = {
  users: async () => {
    // load db, get all users
    let db = await rts.loadDB();
    console.log("in here");
    return await rts.findAll(db, "Users", {}, {});
  },
  userbyid: async args => {
    // load db, find user by id
    let db = await rts.loadDB();
    return await rts.findOne(db, "Users", { _id: `ObjectId("${args.id}")` });
  },
  projects: async () => {
    let db = await rts.loadDB();
    return await rts.findAll(db, "Projects", {}, {});
  },
  hello: () => "Hello World!"
};

module.exports = { resolvers };
