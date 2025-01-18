import axios from "axios";

const url = "https://slack.com/api/conversations.list";

const fetchSlackChannels = async (token) => {
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.data.ok) {
      throw new Error(`Slack API Error: ${response.data.error}`);
    }

    const channels = response.data.channels;
    return channels;
  } catch (error) {
    if (error.response) {
      console.error(
        `Error: ${error.response.status} - ${error.response.statusText}`
      );
    } else {
      console.error("Error:", error.message);
    }
  }
};

export default fetchSlackChannels;
