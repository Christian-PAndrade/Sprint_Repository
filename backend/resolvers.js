const rts = require("./routines");
const mongo = require("mongodb");

const resolvers = {
  // Queries
  // User
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
    // load db and find all admin users
    let db = await rts.loadDB();
    return await rts.findAll(db, "Users", { isAdmin: true }, {});
  },

  // Project
  projects: async () => {
    // load db and return all projects
    let db = await rts.loadDB();
    return await rts.findAll(db, "Projects", {}, {});
  },
  projectbyname: async args => {
    // load db and find project by name
    let db = await rts.loadDB();
    return await rts.findOne(db, "Projects", { name: args.name });
  },
  projectbyid: async args => {
    // load db and find project by id
    let db = await rts.loadDB();
    return await rts.findOne(db, "Projects", {
      _id: new mongo.ObjectID(args.id)
    });
  },

  // Boards
  boards: async () => {
    // load db and return all boards
    let db = await rts.loadDB();
    return await rts.findAll(db, "Boards", {}, {});
  },
  boardbyname: async args => {
    // load db and find board by name
    let db = await rts.loadDB();
    return await rts.findOne(db, "Boards", { name: args.name });
  },
  boardbyid: async args => {
    // load db and find board by id
    let db = await rts.loadDB();
    return await rts.findOne(db, "Boards", {
      _id: new mongo.ObjectID(args.id)
    });
  },
  boardbyproj: async args => {
    // find board by project id
    let db = await rts.loadDB();
    return await rts.findAll(
      db,
      "Boards",
      { board_projectId: new mongo.ObjectID(args.projid) },
      {}
    );
  },

  // UserStories
  userstories: async () => {
    // load db and return all userstories
    let db = await rts.loadDB();
    return await rts.findAll(db, "UserStories", {}, {});
  },
  usbyname: async args => {
    // load db and find userstory by name
    let db = await rts.loadDB();
    return await rts.findOne(db, "UserStories", { name: args.name });
  },
  usbyid: async args => {
    // load db and find userstory by id
    let db = await rts.loadDB();
    return await rts.findOne(db, "UserStories", {
      _id: new mongo.ObjectID(args.id)
    });
  },
  usbystatus: async args => {
    // find userstory by status
    let db = await rts.loadDB();
    return await rts.findAll(db, "UserStories", { status: args.status }, {});
  },
  usbyboard: async args => {
    // find userstory by project id
    let db = await rts.loadDB();
    return await rts.findAll(
      db,
      "UserStories",
      { userStory_boardId: new mongo.ObjectID(args.boardid) },
      {}
    );
  },

  // Tasks
  tasks: async () => {
    // load db and return all tasks
    let db = await rts.loadDB();
    return await rts.findAll(db, "Tasks", {}, {});
  },
  taskbyname: async args => {
    // load db and find task by name
    let db = await rts.loadDB();
    return await rts.findOne(db, "Tasks", { name: args.name });
  },
  taskbyid: async args => {
    // load db and find task by id
    let db = await rts.loadDB();
    return await rts.findOne(db, "Tasks", {
      _id: new mongo.ObjectID(args.id)
    });
  },
  taskbystatus: async args => {
    // load db and find task by status
    let db = await rts.loadDB();
    return await rts.findAll(db, "Tasks", { status: args.status }, {});
  },
  taskbyboard: async args => {
    // find task by board id
    let db = await rts.loadDB();
    return await rts.findAll(
      db,
      "Tasks",
      { task_sprint: new mongo.ObjectID(args.boardid) },
      {}
    );
  },
  taskbyus: async args => {
    // find task by user story id
    let db = await rts.loadDB();
    return await rts.findAll(
      db,
      "Tasks",
      { task_userStoryId: new mongo.ObjectID(args.userst) },
      {}
    );
  },
  taskbyuser: async args => {
    // find task by user id
    let db = await rts.loadDB();
    return await rts.findAll(
      db,
      "Tasks",
      { task_assignedToId: new mongo.ObjectID(args.userid) },
      {}
    );
  },

  // User Estimates
  uestimates: async () => {
    // load db and return all user estimates
    let db = await rts.loadDB();
    return await rts.findAll(db, "UserEstimates", {}, {});
  },
  uestbyid: async args => {
    // load db and find user estimate by id
    let db = await rts.loadDB();
    return await rts.findOne(db, "UserEstimates", {
      _id: new mongo.ObjectID(args.id)
    });
  },
  uestbyboard: async args => {
    // find user estimate by board id
    let db = await rts.loadDB();
    return await rts.findAll(
      db,
      "UserEstimates",
      { userEstimates_boardId: new mongo.ObjectID(args.boardid) },
      {}
    );
  },

  // Team Estimates
  testimates: async () => {
    // load db and return all team estimates
    let db = await rts.loadDB();
    return await rts.findAll(db, "TeamEstimates", {}, {});
  },
  testbyid: async args => {
    // load db and find team estimates by id
    let db = await rts.loadDB();
    return await rts.findOne(db, "TeamEstimates", {
      _id: new mongo.ObjectID(args.id)
    });
  },
  testbyboard: async args => {
    // find team estimate by board id
    let db = await rts.loadDB();
    return await rts.findAll(
      db,
      "TeamEstimates",
      { teamEstimates_boardId: new mongo.ObjectID(args.boardid) },
      {}
    );
  },

  // User Velocities
  uvelocities: async () => {
    // load db and return all user velocity
    let db = await rts.loadDB();
    return await rts.findAll(db, "UserVelocity", {}, {});
  },
  uvelbyid: async args => {
    // load db and find user velocity by id
    let db = await rts.loadDB();
    return await rts.findOne(db, "UserVelocity", {
      _id: new mongo.ObjectID(args.id)
    });
  },
  uvelbyuser: async args => {
    // find user velocity by user id
    let db = await rts.loadDB();
    return await rts.findAll(
      db,
      "UserVelocity",
      { userVelocity_userId: new mongo.ObjectID(args.userid) },
      {}
    );
  },
  uvelbyboard: async args => {
    // find user velocity by board id
    let db = await rts.loadDB();
    return await rts.findAll(
      db,
      "UserVelocity",
      { userVelocity_boardId: new mongo.ObjectID(args.boardid) },
      {}
    );
  },

  // Team Velocities
  tvelocities: async () => {
    // load db and return all user velocity
    let db = await rts.loadDB();
    return await rts.findAll(db, "TeamVelocity", {}, {});
  },
  tvelbyid: async args => {
    // load db and find user velocity by id
    let db = await rts.loadDB();
    return await rts.findOne(db, "TeamVelocity", {
      _id: new mongo.ObjectID(args.id)
    });
  },
  tvelbyboard: async args => {
    // find user velocity by board id
    let db = await rts.loadDB();
    return await rts.findAll(
      db,
      "TeamVelocity",
      { teamVelocity_boardId: new mongo.ObjectID(args.boardid) },
      {}
    );
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
    return results.deletedCount;
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
    return results.value ? newUser : null;
  }
};

module.exports = { resolvers };
