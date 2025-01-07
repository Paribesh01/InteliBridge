import axios from "axios";


const url = 'https://api.github.com/user/repos';

const fetchRepos = async(token)=> {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/vnd.github.v3+json',
      },
    });

    const repos = response.data;
    return repos
  } catch (error) {
    if (error.response) {
      console.error(
        `Error: ${error.response.status} - ${error.response.statusText}`
      );
    } else {
      console.error('Error:', error.message);
    }
  }
}

export default fetchRepos;
