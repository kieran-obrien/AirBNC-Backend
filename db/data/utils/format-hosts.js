const formatHosts = (usersData) => {
  // Create a deep copy
  const copiedUsersData = JSON.parse(JSON.stringify(usersData));
  for (const user of copiedUsersData) {
    user.role === "host" ? (user.role = true) : (user.role = false);
  }
  return copiedUsersData;
};

module.exports = formatHosts;
