const form = document.querySelector('form');
const searchInput = document.querySelector('#search-input');
const searchTypeInput = document.querySelector('#search-type');
const userList = document.querySelector('#user-list');
const repoList = document.querySelector('#repo-list');

let searchType = 'users';

form.addEventListener('submit', (event) => {
  event.preventDefault();

  const searchTerm = searchInput.value;

  if (searchTerm) {
    const endpoint = `https://api.github.com/search/${searchType}?q=${searchTerm}`;
    const headers = {
      Accept: 'application/vnd.github.v3+json'
    };

    axios.get(endpoint, { headers })
      .then((response) => {
        if (searchType === 'users') {
          const users = response.data.items;

          userList.innerHTML = '';

          users.forEach((user) => {
            const userElement = document.createElement('div');
            const username = document.createElement('h2');
            const avatar = document.createElement('img');
            const profileLink = document.createElement('a');

            username.textContent = user.login;
            avatar.src = user.avatar_url;
            profileLink.textContent = 'View profile';
            profileLink.href = user.html_url;

            userElement.appendChild(username);
            userElement.appendChild(avatar);
            userElement.appendChild(profileLink);
            userList.appendChild(userElement);

            userElement.addEventListener('click', () => {
              getRepos(user.login);
            });
          });
        } else {
          const repos = response.data;

          repoList.innerHTML = '';

          repos.forEach((repo) => {
            const repoElement = document.createElement('div');
            const repoName = document.createElement('h2');
            const repoLink = document.createElement('a');

            repoName.textContent = repo.name;
            repoLink.textContent = 'View repository';
            repoLink.href = repo.html_url;

            repoElement.appendChild(repoName);
            repoElement.appendChild(repoLink);
            repoList.appendChild(repoElement);
          });
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
});

function getRepos(username) {
  const endpoint = `https://api.github.com/users/${username}/repos`;
  const headers = {
    Accept: 'application/vnd.github.v3+json'
  };

  axios.get(endpoint, { headers })
    .then((response) => {
      const repos = response.data;

      repoList.innerHTML = '';

      repos.forEach((repo) => {
        const repoElement = document.createElement('div');
        const repoName = document.createElement('h2');
        const repoLink = document.createElement('a');

        repoName.textContent = repo.name;
        repoLink.textContent = 'View repository';
        repoLink.href = repo.html_url;

        repoElement.appendChild(repoName);
        repoElement.appendChild(repoLink);
        repoList.appendChild(repoElement);
      });
    })
    .catch((error) => {
      console.log(error);
    });
}

searchTypeInput.addEventListener('click', () => {
  searchType = searchTypeInput.value;
  searchInput.placeholder = `Search ${searchType}`;
});
