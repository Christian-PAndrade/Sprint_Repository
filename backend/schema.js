const { buildSchema } = require("graphql");

const schema = buildSchema(`
    type Query {
        users: [User],
        userbyid(id: String): User,
        usersbyproject(id: String): [User],
        useradmin: [User],
        userbyproj(projid: String): [User],

        projects: [Project],
        projectsbyname(name: String): Project,
        projectbyid(id: String): Project,

        boards: [Board],
        boardbyname(name: String): Board,
        boardbyid(id: String): Board,
        boardbyproj(projid: String): [Board],

        userstories: [UserStory],
        usbyname(name: String): UserStory,
        usbyid(id: String): UserStory,
        usbystatus(status: String): [UserStory],
        usbyboard(boardid: String): [UserStory],

        tasks: [Task],
        taskbyname(name: String): Task,
        taskbyid(id: String): Task,
        taskbystatus(status: String): [Task],
        taskbysprint(sprint: String): [Task],
        taskbyus(userst: String): [Task],
        taskbyuser(userid: String): [Task],

        uestimates: [UserEstimate],
        uestbyid(id: String): UserEstimate,
        uestbyboard(boardid: String): [UserEstimate],

        testimates: [TeamEstimate],
        testbyid(id: String): TeamEstimate,
        testbyboard(boardid: String): [TeamEstimate],

        uvelocities: [UserVelocity],
        uvelbyid(id: String): UserVelocity,
        uvelbyuser(userid: String): [UserVelocity],
        uvelbyboard(boardid: String): [UserVelocity],

        tvelocities: [TeamVelocity],
        tvelbyid(id: String): TeamVelocity,
        tvelbyboard(boardId: String): [TeamVelocity],
    }

    type User {
        username: String
        isAdmin: Boolean
        projectId: String
    }

    type Project {
        name: String
    }

    type Board {
        startDate: String
        endDate: String
        name: String
        board_projectId: String
    }

    type UserStory {
        name: String
        creationDate: String
        completionDate: String
        status: String
        estimate: Float
        hoursWorked: Float
        reestimate: String
        userStory_boardId: String
    }

    type Task {
        name: String
        creationDate: String
        completionDate: String
        status: String
        estimate: Float
        task_sprint: String
        task_userStoryId: String
        task_assignedToId: String
    }

    type UserEstimate {
        userEstimation: Float
        actualValue: Float
        accuracy: Float
        userEstimates_boardId: String
    }

    type TeamEstimate {
        accuracy: Float
        teamEstimates_boardId: String
    }

    type UserVelocity {
        velocity: Float
        userVelocity_userId: String
        userVelocity_boardId: String
    }

    type TeamVelocity {
        velocity: Float
        teamVelocity_boardId: String
    }

    type Mutation {
        adduser(name: String, isAdmin: Boolean, projectId: String): User,
        addproject(name: String): Project,
        adduserstory(name: String, creationDate: String, completionDate: String, status: String, estimate: Float, hoursWorked: Float, reestimate: String, boarId: String): UserStory,
        addtask(name: String, creationDate: String, completionDate: String, status: String, estimate: Float, sprint: String, userstory: String, userassigned: String): Task,
        adduestimate(estimate: Float, actual: Float, accuracy: Float, board: String) : UserEstimate,
        addtestimate(accuracy: Float, boardid: String) : TeamEstimate,
        adduvelocity(velocity: Float, userid: String, boardid: String): UserVelocity,
        addtvelocity(velocity: Float, boardid: String): TeamVelocity,

        deleteuser(id: String): Int,
        deleteproject(id: String): Int,
        deleteuserstory(id: String): Int,
        deletetask(id: String): Int,
        deleteuestimate(id: String): Int, 
        deletetestimate(id: String): Int,
        deleteuvelocity(id: String): Int, 
        deletetvelocity(id: String): Int,

        updateuser(name: String, isAdmin: String, projectId: String): User,
        updateproject(name: String): Project,
        updateuserstory(name: String, creationDate: String, completionDate: String, status: String, estimate: Float, hoursWorked: Float, reestimate: String, boarId: String): UserStory,
        updatetask(name: String, creationDate: String, completionDate: String, status: String, estimate: Float, sprint: String, userstory: String, userassigned: String): Task,
        updateuestimate(estimate: Float, actual: Float, accuracy: Float, board: String) : UserEstimate,
        updatetestimate(accuracy: Float, boardid: String) : TeamEstimate,
        updateuvelocity(velocity: Float, userid: String, boardid: String): UserVelocity,
        updatetvelocity(velocity: Float, boardid: String): TeamVelocity,
    }
`);

module.exports = { schema };
