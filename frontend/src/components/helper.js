// For title of the page
const PageTitle = (radioSelected) => {
  switch (radioSelected) {
    case "projects":
      return "Projects";
    case "boards":
      return "Boards";
    case "users":
      return "Users";
    case "userStories":
      return "User Stories";
    default:
      return "Tasks";
  }
};

// Calculates velocity for one user
const calcVelocity = async (sprintId, userId) => {
  // fetch all userstories for that sprint with that user
  const response = await fetch("http://localhost:5000/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      query: `{ usbyuserandboard(
          userId: "${userId}", 
          boardId: "${sprintId}"
        ) {
          storyPoints,
          status,
          hoursWorked
        }}`,
    }),
  });

  let json = await response.json();

  // Calculate total number of hours worked
  let totalHoursWorked = 0;
  Object.values(json.data.usbyuserandboard).forEach(
    (us) => (totalHoursWorked += us.hoursWorked)
  );

  // Get the number of story points for completed tasks
  let completedStoryPoints = 0;
  Object.values(json.data.usbyuserandboard).forEach((us) => {
    if (us.status === "Completed") completedStoryPoints += us.storyPoints;
  });

  // Velocity = Hours worked / completed stories
  let velocity;
  if (totalHoursWorked === 0) velocity = 0;
  else velocity = totalHoursWorked / completedStoryPoints;

  // Adds to table
  await fetch("http://localhost:5000/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      query: `mutation { adduvelocity(
          velocity: ${velocity},
          userid: "${userId}", 
          boardid: "${sprintId}"
        ) {
          _id
          velocity
          userVelocity_userId
          userVelocity_boardId
        }}`,
    }),
  });

  return velocity;
};

// Calculates velocties for all users in a given sprint
// and adds it to the db
const calculateUserVelocities = async (sprintId) => {
  // Get all users in that sprint
  const allUsersResp = await fetch("http://localhost:5000/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      query: `{ usbyboard(
          boardid: "${sprintId}"
        ) {
          userStory_userId
        }}`,
    }),
  });

  const allUsersJson = await allUsersResp.json();

  // remove dups
  const usersArr = allUsersJson.data.usbyboard.map((us) => us.userStory_userId);
  const users = Array.from(new Set(usersArr));

  // Call function to calculate velocity on each user
  users.forEach(async (us) => {
    await calcVelocity(sprintId, us);
  });
};

module.exports = { PageTitle, calculateUserVelocities };
