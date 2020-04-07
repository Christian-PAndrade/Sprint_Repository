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

// Calculates the velocity for a user in a board
const CalcUserVelocity = async (userId, sprintId) => {
  try {
    // Get all user stories for that sprint
    let response = await fetch("http://localhost:5000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        query: `query { usbyuserandboard(userId:"${userId}, boardId: "${sprintId}) {
          _id
          name
          creationDate
          completionDate
          status
          estimate
          hoursWorked
          reestimate
          userStory_boardId
          userStory_userId
          }
        }`,
      }),
    });
    let json = await response.json();

    const tasks = json.data.usbyuserandboard;

    // For each user story get all tasks assigned to user

    // Sum those estimates

    // Sum estimates of completed == velocity

    // Calculate accuracy percentage

    // // get the total estimation
    // let totalEst = 0;

    // tasks2.forEach((task) => {
    //   totalEst += task.estimate;
    // });

    // // Find all completed tasks
    // const completedTasks = tasks2.filter(
    //   (task) => task.status.toLowerCase() === "completed"
    // );

    // // get total estimation for completed tasks == velocity
    // let velocity = 0;
    // completedTasks.forEach((task) => {
    //   velocity += task.estimate;
    // });

    // // Calculate accuracy
    // const accuracy = (velocity * 100) / totalEst;

    //console.log({ velocity, accuracy });
  } catch (err) {
    console.log(err);
  }
};

module.exports = { PageTitle, CalcUserVelocity };
