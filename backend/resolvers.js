const rts = require("./routines");
const mongo = require("mongodb");
const moment = require("moment");

const resolvers = {
  // Queries
  // User
  users: async () => {
    // load db, get all users
    let db = await rts.loadDB();
    return await rts.findAll(db, "Users", {}, {});
  },
  userbyname: async (args) => {
    // load db, find user by name
    let db = await rts.loadDB();
    return await rts.findOne(db, "Users", { username: args.name });
  },
  userbyid: async (args) => {
    // load db, find user by id
    let db = await rts.loadDB();
    let o_id = new mongo.ObjectID(args.id);
    return await rts.findOne(db, "Users", { _id: o_id });
  },
  // usersbyproject: async args => {
  //   // load db, find user by project id
  //   let db = await rts.loadDB();
  //   return await rts.findAll(
  //     db,
  //     "UserProjectLookup",
  //     { lookupProjectId: mongo.ObjectID.createFromHexString(args.id) },
  //     {}
  //   );
  // },
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
  projectbyname: async (args) => {
    // load db and find project by name
    let db = await rts.loadDB();
    return await rts.findOne(db, "Projects", { name: args.name });
  },
  projectbyid: async (args) => {
    // load db and find project by id
    let db = await rts.loadDB();
    return await rts.findOne(db, "Projects", {
      _id: new mongo.ObjectID(args.id),
    });
  },

  // Boards
  boards: async () => {
    // load db and return all boards
    let db = await rts.loadDB();
    return await rts.findAll(db, "Boards", {}, {});
  },
  boardbyname: async (args) => {
    // load db and find board by name
    let db = await rts.loadDB();
    return await rts.findOne(db, "Boards", { name: args.name });
  },
  boardbyid: async (args) => {
    // load db and find board by id
    let db = await rts.loadDB();
    return await rts.findOne(db, "Boards", {
      _id: new mongo.ObjectID(args.id),
    });
  },
  boardbyproj: async (args) => {
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
  usbyname: async (args) => {
    // load db and find userstory by name
    let db = await rts.loadDB();
    return await rts.findOne(db, "UserStories", { name: args.name });
  },
  usbyid: async (args) => {
    // load db and find userstory by id
    let db = await rts.loadDB();
    return await rts.findOne(db, "UserStories", {
      _id: new mongo.ObjectID(args.id),
    });
  },
  usbystatus: async (args) => {
    // find userstory by status
    let db = await rts.loadDB();
    return await rts.findAll(db, "UserStories", { status: args.status }, {});
  },
  usbyboard: async (args) => {
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
  taskbyname: async (args) => {
    // load db and find task by name
    let db = await rts.loadDB();
    return await rts.findOne(db, "Tasks", { name: args.name });
  },
  taskbyid: async (args) => {
    // load db and find task by id
    let db = await rts.loadDB();
    return await rts.findOne(db, "Tasks", {
      _id: new mongo.ObjectID(args.id),
    });
  },
  taskbystatus: async (args) => {
    // load db and find task by status
    let db = await rts.loadDB();
    return await rts.findAll(db, "Tasks", { status: args.status }, {});
  },
  taskbyboard: async (args) => {
    // find task by board id
    let db = await rts.loadDB();
    return await rts.findAll(
      db,
      "Tasks",
      { task_sprint: new mongo.ObjectID(args.boardid) },
      {}
    );
  },
  taskbyus: async (args) => {
    // find task by user story id
    let db = await rts.loadDB();
    return await rts.findAll(
      db,
      "Tasks",
      { task_userStoryId: new mongo.ObjectID(args.userst) },
      {}
    );
  },
  taskbyuser: async (args) => {
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
  uestbyid: async (args) => {
    // load db and find user estimate by id
    let db = await rts.loadDB();
    return await rts.findOne(db, "UserEstimates", {
      _id: new mongo.ObjectID(args.id),
    });
  },
  uestbyboard: async (args) => {
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
  testbyid: async (args) => {
    // load db and find team estimates by id
    let db = await rts.loadDB();
    return await rts.findOne(db, "TeamEstimates", {
      _id: new mongo.ObjectID(args.id),
    });
  },
  testbyboard: async (args) => {
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
  uvelbyid: async (args) => {
    // load db and find user velocity by id
    let db = await rts.loadDB();
    return await rts.findOne(db, "UserVelocity", {
      _id: new mongo.ObjectID(args.id),
    });
  },
  uvelbyuser: async (args) => {
    // find user velocity by user id
    let db = await rts.loadDB();
    return await rts.findAll(
      db,
      "UserVelocity",
      { userVelocity_userId: new mongo.ObjectID(args.userid) },
      {}
    );
  },
  uvelbyboard: async (args) => {
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
  tvelbyid: async (args) => {
    // load db and find user velocity by id
    let db = await rts.loadDB();
    return await rts.findOne(db, "TeamVelocity", {
      _id: new mongo.ObjectID(args.id),
    });
  },
  tvelbyboard: async (args) => {
    // find user velocity by board id
    let db = await rts.loadDB();
    return await rts.findAll(
      db,
      "TeamVelocity",
      { teamVelocity_boardId: new mongo.ObjectID(args.boardid) },
      {}
    );
  },
  // UserProjectLookup
  // Get all projects a user is part of
  projectsbyuser: async (args) => {
    let db = await rts.loadDB();
    return await rts.findAll(
      db,
      "UserProjectLookup",
      { lookupUserId: new mongo.ObjectID(args.userId) },
      {}
    );
  },
  // Get all users in a project
  usersbyproject: async (args) => {
    let db = await rts.loadDB();
    return await rts.findAll(
      db,
      "UserProjectLookup",
      { lookupProjectId: new mongo.ObjectID(args.projectId) },
      {}
    );
  },

  //
  // Mutations
  //

  // Adds
  // Add a User
  adduser: async (args) => {
    let db = await rts.loadDB();
    let user = {
      username: args.username,
      isAdmin: args.isAdmin,
      //projectId: new mongo.ObjectID(args.projectId)
    };
    let results = await rts.addOne(db, "Users", user);
    return results.insertedCount === 1 ? user : null;
  },

  // Add a Project by name
  addproject: async (args) => {
    let db = await rts.loadDB();
    let project = {
      name: args.name,
    };
    let results = await rts.addOne(db, "Projects", project);
    return results.insertedCount === 1 ? project : null;
  },

  addboard: async (args) => {
    let db = await rts.loadDB();
    let board = {
      startDate: args.startDate,
      name: args.name,
      board_projectId: args.board_projectId,
    };

    let results = await rts.addOne(db, "Boards", board);
    return results.insertedCount === 1 ? board : null;
  },

  // Add a user story
  adduserstory: async (args) => {
    let db = await rts.loadDB();
    let userStory = {
      name: args.name,
      creationDate: moment().format("YYYY-MM-DD"),
      completionDate: null,
      status: args.status,
      estimate: args.estimate,
      hoursWorked: args.hoursWorked,
      reestimate: args.reestimate,
      userStory_boardId: new mongo.ObjectID(args.boardId),
    };

    let results = await rts.addOne(db, "UserStories", userStory);
    return results.insertedCount === 1 ? userStory : null;
  },

  // Add a new task
  addtask: async (args) => {
    let db = await rts.loadDB();
    let task = {
      name: args.name,
      creationDate: moment().format("YYYY-MM-DD"),
      completionDate: null,
      status: args.status,
      estimate: args.estimate,
      task_sprint: new mongo.ObjectID(args.sprint),
      task_userStoryId: new mongo.ObjectID(args.userstory),
      task_assignedToId: new mongo.ObjectID(args.userassigned),
    };

    let results = await rts.addOne(db, "Tasks", task);
    return results.insertedCount === 1 ? task : null;
  },

  // Add user estimate
  adduestimate: async (args) => {
    let db = await rts.loadDB();
    let userEstimate = {
      userEstimation: args.estimate,
      actualValue: args.actual,
      accuracy: args.accuracy,
      userEstimates_boardId: new mongo.ObjectID(args.board),
    };

    let results = await rts.addOne(db, "UserEstimates", userEstimate);
    return results.insertedCount === 1 ? userEstimate : null;
  },

  // Add Team Estimate
  addtestimate: async (args) => {
    let db = await rts.loadDB();
    let teamEstimate = {
      accuracy: args.accuracy,
      teamEstimates_boardId: new mongo.ObjectID(args.boardid),
    };

    let results = await rts.addOne(db, "TeamEstimates", teamEstimate);
    return results.insertedCount === 1 ? teamEstimate : null;
  },

  // Add User Velocity
  adduvelocity: async (args) => {
    let db = await rts.loadDB();
    let userVelocity = {
      velocity: args.velocity,
      userVelocity_userId: new mongo.ObjectID(args.userid),
      userVelocity_boardId: new mongo.ObjectID(args.boardid),
    };

    let results = await rts.addOne(db, "UserVelocity", userVelocity);
    return results.insertedCount === 1 ? userVelocity : null;
  },

  // Team VVelocity
  addtvelocity: async (args) => {
    let db = await rts.loadDB();
    let teamVelocity = {
      velocity: args.velocity,
      teamVelocity_boardId: new mongo.ObjectID(args.boardid),
    };

    let results = await rts.addOne(db, "TeamVelocity", teamVelocity);
    return results.insertedCount === 1 ? teamVelocity : null;
  },

  // Add User To Project
  addusertoproject: async (args) => {
    let db = await rts.loadDB();
    let userToProject = {
      lookupUserId: new mongo.ObjectID(args.userId),
      lookupProjectId: new mongo.ObjectID(args.projectId),
    };

    let results = await rts.addOne(db, "UserProjectLookup", userToProject);
    return results.insertedCount === 1 ? userToProject : null;
  },

  //
  // Deletes
  //
  // Delete User
  deleteuser: async (args) => {
    let db = await rts.loadDB();
    let results = await rts.deleteOne(db, "Users", {
      _id: new mongo.ObjectID(args.id),
    });
    return results.deletedCount;
  },

  // Delete Project by ID
  deleteproject: async (args) => {
    let db = await rts.loadDB();
    let results = await rts.deleteOne(db, "Projects", {
      _id: new mongo.ObjectID(args.id),
    });
    return results.deletedCount;
  },

  // Delete a User Story
  deleteuserstory: async (args) => {
    let db = await rts.loadDB();
    let results = await rts.deleteOne(db, "UserStories", {
      _id: new mongo.ObjectID(args.id),
    });
    return results.deletedCount;
  },

  // Delete a Task
  deletetask: async (args) => {
    let db = await rts.loadDB();
    let results = await rts.deleteOne(db, "Tasks", {
      _id: new mongo.ObjectID(args.id),
    });
    return results.deletedCount;
  },

  // Delete User Estimates
  deleteuestimate: async (args) => {
    let db = await rts.loadDB();
    let results = await rts.deleteOne(db, "UserEstimates", {
      _id: new mongo.ObjectID(args.id),
    });
    return results.deletedCount;
  },

  // Delete Team Estimates
  deletetestimate: async (args) => {
    let db = await rts.loadDB();
    let results = await rts.deleteOne(db, "TeamEstimates", {
      _id: new mongo.ObjectID(args.id),
    });
    return results.deletedCount;
  },

  // Delete User Velocity
  deleteuvelocity: async (args) => {
    let db = await rts.loadDB();
    let results = await rts.deleteOne(db, "UserVelocity", {
      _id: new mongo.ObjectID(args.id),
    });
    return results.deletedCount;
  },

  // Delete Team Velocity
  deletetvelocity: async (args) => {
    let db = await rts.loadDB();
    let results = await rts.deleteOne(db, "TeamVelocity", {
      _id: new mongo.ObjectID(args.id),
    });
    return results.deletedCount;
  },

  // Delete User From Project
  deleteUserFromProject: async (args) => {
    let db = await rts.loadDB();
    let results = await rts.deleteOne(db, "UserProjectLookup", {
      lookupUserId: mongo.ObjectID.createFromHexString(args.userId),
      lookupProjectId: mongo.ObjectID.createFromHexString(args.projectId),
    });
    return results.deletedCount;
  },

  //
  // Updates
  //

  // Update User
  updateuser: async (args) => {
    let db = await rts.loadDB();
    let newUser = {
      username: args.name,
      isAdmin: args.isAdmin,
      projectId: new mongo.ObjectID(args.projectId),
    };

    let results = await rts.updateOne(
      db,
      "Users",
      {
        _id: new mongo.ObjectID(args.id),
      },
      newUser
    );
    return results.value ? newUser : null;
  },

  // Update Project
  updateproject: async (args) => {
    let db = await rts.loadDB();
    let newProject = {
      name: args.name,
    };

    let results = await rts.updateOne(
      db,
      "Projects",
      {
        _id: new mongo.ObjectID(args.id),
      },
      newProject
    );
    return results.value ? newProject : null;
  },

  // Update User Story
  updateuserstory: async (args) => {
    let db = await rts.loadDB();
    let newUserStory = {
      name: args.name,
      creationDate: args.creationDate,
      completionDate: args.completionDate,
      status: args.status,
      estimate: args.estimate,
      hoursWorked: args.hoursWorked,
      reestimate: args.reestimate,
      userStory_boardId: new mongo.ObjectID(args.boardId),
    };

    let results = await rts.updateOne(
      db,
      "UserStories",
      {
        _id: new mongo.ObjectID(args.id),
      },
      newUserStory
    );
    return results.value ? newUserStory : null;
  },

  // Update Task
  updatetask: async (args) => {
    let db = await rts.loadDB();
    let newTask = {
      name: args.name,
      creationDate: args.creationDate,
      completionDate: args.completionDate,
      status: args.status,
      estimate: args.estimate,
      task_sprint: new mongo.ObjectID(args.sprint),
      task_userStoryId: new mongo.ObjectID(args.userstory),
      task_assignedToId: new mongo.ObjectID(args.userassigned),
    };

    let results = await rts.updateOne(
      db,
      "Tasks",
      {
        _id: new mongo.ObjectID(args.id),
      },
      newTask
    );
    return results.value ? newTask : null;
  },

  // Update User Estimate
  updateuestimate: async (args) => {
    let db = await rts.loadDB();
    let newUserEstimate = {
      userEstimation: args.estimate,
      actualValue: args.actual,
      accuracy: args.accuracy,
      userEstimates_boardId: new mongo.ObjectID(args.board),
    };

    let results = await rts.updateOne(
      db,
      "UserEstimates",
      {
        _id: new mongo.ObjectID(args.id),
      },
      newUserEstimate
    );
    return results.value ? newUserEstimate : null;
  },

  // Update Team Estimate
  updatetestimate: async (args) => {
    let db = await rts.loadDB();
    let newTeamEstimate = {
      accuracy: args.accuracy,
      teamEstimates_boardId: new mongo.ObjectID(args.boardid),
    };

    let results = await rts.updateOne(
      db,
      "TeamEstimates",
      {
        _id: new mongo.ObjectID(args.id),
      },
      newTeamEstimate
    );
    return results.value ? newTeamEstimate : null;
  },

  // Update User Velocity
  updateuvelocity: async (args) => {
    let db = await rts.loadDB();
    let newUserVelocity = {
      velocity: args.velocity,
      userVelocity_userId: new mongo.ObjectID(args.userid),
      userVelocity_boardId: new mongo.ObjectID(args.boardid),
    };

    let results = await rts.updateOne(
      db,
      "UserVelocity",
      {
        _id: new mongo.ObjectID(args.id),
      },
      newUserVelocity
    );
    return results.value ? newUserVelocity : null;
  },

  // Update Team Velocity
  updatetvelocity: async (args) => {
    let db = await rts.loadDB();
    let newTeamVelocity = {
      velocity: args.velocity,
      teamVelocity_boardId: new mongo.ObjectID(args.boardid),
    };

    let results = await rts.updateOne(
      db,
      "TeamVelocity",
      {
        _id: new mongo.ObjectID(args.id),
      },
      newTeamVelocity
    );
    return results.value ? newTeamVelocity : null;
  },
};

module.exports = { resolvers };
