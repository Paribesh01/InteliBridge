import axios from "axios";

const fetchTextChannels = async (accessToken, metaData) => {
  const url = `https://discord.com/api/v10/guilds/${metaData.guildId}/channels`;
  console.log("url", url);
  console.log("Access token", accessToken);
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bot ${DISCORDBOTTOKEN}`,
        Accept: "application/json",
      },
    });

    const textChannels = response.data.filter((channel) => channel.type === 0);
    console.log("textChannels", textChannels);

    return textChannels;
  } catch (error) {
    console.error("Error fetching text channels:", error);
  }
};

export default fetchTextChannels;
