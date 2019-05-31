document.getElementById("search-button").addEventListener("click", event => {
  event.preventDefault();
  fetchData();
});

const fetchData = async () => {
  // get value from input
  const searchInput = document.getElementById("search-input").value;

  // fetch user data
  const userResponse = await fetch(
    `https://api.github.com/users/${searchInput}`
  );
  if (userResponse.status === 200) {
    // clear errors if fetch successful
    document.getElementById("error").style.display = "none";

    // store user data
    const userData = await userResponse.json();

    // fetch repositories only if user has any
    let reposData = [];
    if (userData.public_repos) {
      // clear "no repositories" error
      document.getElementById("no-repos").style.display = "none";

      const reposResponse = await fetch(
        `https://api.github.com/users/${searchInput}/repos`
      );
      // store repos data
      reposData = await reposResponse.json();
    } else {
      // show "no repositories" message
      document.getElementById("no-repos").style.display = "block";
    }

    buildResultsTable(userData, reposData);
  } else {
    // display error
    document.getElementById("error").style.display = "block";
    document.getElementById("search-results").style.display = "none";
    if (userResponse.status === 404) {
      document.getElementById("error").innerHTML = `<p>Does not exist.</p>`;
    } else if (userResponse.status === 403) {
      document.getElementById("error").innerHTML = `<p>API limit reached.</p>`;
    }
  }
};

const buildResultsTable = (userData, reposData) => {
  // show search results
  document.getElementById("search-results").style.display = "block";

  // populate user details
  const { avatar_url, login, bio, name } = userData;

  document.getElementById("user-image").setAttribute("src", avatar_url);
  document.getElementById("username").innerHTML = `@${login}`;
  document.getElementById("full-name").innerHTML = name;
  document.getElementById("user-bio").innerHTML = bio;

  const reposTable = document.getElementById("repos-table");

  // reset repositories table from previous search
  reposTable.innerHTML = "";

  // populate repositories table
  reposData.forEach(repo => {
    const { name, html_url, forks_count, stargazers_count } = repo;
    reposTable.innerHTML += `
            <div>
                <h4><a href=${html_url} target="_blank">${name}</a></h4>
                <div>
                <img src="images/fork_icon.png"> ${forks_count}
                <img src="images/star_icon.png"> ${stargazers_count}
                </div>
            </div>`;
  });
};
