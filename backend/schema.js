const { buildSchema } = require("graphql");

const schema = buildSchema(`
    type Query {
        users: [User],
        userbyid(id: String): User,
        userbyname(name: String): User,
        useradmin: [User],

        projects: [Project],
        projectbyname(name: String): Project,
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
        usbyuser(userId: String): [UserStory],
        usbyuserandboard(userId: String, boardId: String): [UserStory]

        tasks: [Task],
        taskbyname(name: String): Task,
        taskbyid(id: String): Task,
        taskbystatus(status: String): [Task],
        taskbyboard(boardid: String): [Task],
        taskbyus(userst: String): [Task],
        taskbyuser(userid: String): [Task],
        taskbyuserstory(userStoryId: String): [Task],

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
        tvelbyboard(boardid: String): [TeamVelocity],

        projectsbyuser(userId: String): [UserProjectLookup],
        usersbyproject(projectId: String): [UserProjectLookup],
    }

    type User {
        _id: String
        username: String
        isAdmin: Boolean
    }

    type Project {
        _id: String
        name: String
    }

    type Board {
        _id: String
        startDate: String
        endDate: String
        name: String
        board_projectId: String
    }

    type UserStory {
        _id: String
        name: String
        creationDate: String
        completionDate: String
        status: String
        estimate: Float
        hoursWorked: Float
        reestimate: String
        storyPoints: Float
        userStory_boardId: String
        userStory_userId: String
    }

    type Task {
        _id: String
        name: String
        creationDate: String
        completionDate: String
        status: String
        estimate: Float
        timeWorked: Float
        task_sprint: String
        task_userStoryId: String
        task_assignedToId: String
    }

    type UserEstimate {
        _id: String
        userEstimation: Float
        actualValue: Float
        accuracy: Float
        userEstimates_boardId: String
    }

    type TeamEstimate {
        _id: String
        accuracy: Float
        teamEstimates_boardId: String
    }

    type UserVelocity {
        _id: String
        velocity: Float
        userVelocity_userId: String
        userVelocity_boardId: String
    }

    type TeamVelocity {
        _id: String
        velocity: Float
        teamVelocity_boardId: String
    }

    type UserProjectLookup {
        _id: String
        lookupUserId: String
        lookupProjectId: String
    }

    type Mutation {
        adduser(username: String, isAdmin: Boolean): User,
        addproject(name: String): Project,
        adduserstory(name: String, creationDate: String, completionDate: String, status: String, estimate: Float, hoursWorked: Float, reestimate: String, storyPoints: Float, userStory_boardId: String, userStory_userId: String): UserStory,
        addtask(name: String, creationDate: String, completionDate: String, status: String, estimate: Float, timeWorked: Float sprint: String, userstory: String, userassigned: String): Task,
        adduestimate(estimate: Float, actual: Float, accuracy: Float, board: String) : UserEstimate,
        addtestimate(accuracy: Float, boardid: String) : TeamEstimate,
        adduvelocity(velocity: Float, userid: String, boardid: String): UserVelocity,
        addtvelocity(velocity: Float, boardid: String): TeamVelocity,
        addusertoproject(userId: String, projectId: String): UserProjectLookup

        addboard(startDate: String, name: String, board_projectId: String): Board,

        deleteuser(id: String): Int,
        deleteproject(id: String): Int,
        deleteuserstory(id: String): Int,
        deletetask(id: String): Int,
        deleteuestimate(id: String): Int, 
        deletetestimate(id: String): Int,
        deleteuvelocity(id: String): Int, 
        deletetvelocity(id: String): Int,
        deleteUserFromProject(userId: String, projectId: String): Int,
        deleteBoardFromProject(boardId: String, projectId: String): Int,

        updateuser(id: String, name: String, isAdmin: Boolean): User,
        updateboard(id: String, startDate: String, endDate: String, name: String, projectId: String): Board,
        updateproject(id: String, name: String): Project,
        updateuserstory(id: String, name: String, creationDate: String, completionDate: String, status: String, estimate: Float, hoursWorked: Float, reestimate: String, storyPoints: Float, boardId: String, userId: String): UserStory,
        updatetask(id: String, name: String, creationDate: String, completionDate: String, status: String, estimate: Float, timeWorked: Float, sprint: String, userstory: String, userassigned: String): Task,
        updateuestimate(id: String, estimate: Float, actual: Float, accuracy: Float, board: String) : UserEstimate,
        updatetestimate(id: String, accuracy: Float, boardid: String) : TeamEstimate,
        updateuvelocity(id: String, velocity: Float, userid: String, boardid: String): UserVelocity,
        updatetvelocity(id: String, velocity: Float, boardid: String): TeamVelocity,
        updateuserproject(id: String, userId: String, projectId: String): UserProjectLookup,
        
        updateCompleteDateTask(id: String): Task
        logTimeToTask(id: String, time: Float): Task
        closeBoard(id: String, endDate: String): Board
        closeUserStory(id: String): UserStory
    }
`);

module.exports = { schema };
