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
      return "Sub Tasks";
  }
};

module.exports = { PageTitle };
