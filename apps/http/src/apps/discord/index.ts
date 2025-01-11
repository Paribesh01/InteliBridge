import "dotenv/config";
import {
  Client,
  Events,
  GatewayIntentBits,
  Message,
  TextChannel,
} from "discord.js";
import express from "express";
import {
  findFirstGuildGeneralChannel,
  getAllGuildChannels,
  handleCommonMessages,
} from "./helper/helper";

const app = express();

app.use(express.json());

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const token = process.env.DISCORD_BOT_TOKEN;

if (!token) {
  console.error(
    "DISCORD_BOT_TOKEN is not defined in the environment variables"
  );
  process.exit(1);
}

client.login(token).catch((err) => {
  console.error("Failed to log in:", err);
});

client.once(Events.ClientReady, () => {
  if (!client.user) {
    console.error("Client user not found!");
    return;
  }
  console.log(`Ready! Logged in as ${client.user.tag}`);
});

client.on(Events.MessageCreate, (message: Message) => {
  if (message.author.bot) return;
  console.log(`Message received: ${message.content}`);

  const messageContent = message.content.toLowerCase();
  const message_content = handleCommonMessages(messageContent);
  if (message_content) {
    message
      .reply(message_content)
      .then(() => {
        console.log(`Replied to message: ${message.content}`);
      })
      .catch((err) => {
        console.error(`Failed to reply to message: ${err}`);
      });
  }
});

async function SendMessageToChannel(message: string) {
  const channelId = await findFirstGuildGeneralChannel(client);

  if (!channelId) {
    console.error("General channel not found");
    return;
  }
  const channel = client.channels.cache.get(channelId) as TextChannel;
  channel
    .send(message)
    .then((data) => {
      console.log("Message sent successfully");
    })
    .catch((err) => {
      console.error(`Failed to send message: ${err}`);
    });
}

async function getBotGuilds() {
  const guilds = client.guilds.cache;
  return guilds;
}


async function getGuildChannels(guildId: string) {
  if (!guildId) {
    return;
  }

  const channel_data = await getAllGuildChannels(guildId, client);

  return channel_data;
}

app.post("/api/message", async (req, res) => {
  const { message } = req.body;

  if (!message) {
    res.status(400).json({ error: "Message is required" });
    return;
  }

  const channelId = await findFirstGuildGeneralChannel(client);

  if (!channelId) {
    res.status(404).json({ error: "General channel not found" });
    return;
  }

  const channel = client.channels.cache.get(channelId) as TextChannel;

  if (!channel) {
    res.status(404).json({ error: `Channel with ID ${channelId} not found` });
    return;
  }

  channel
    .send(message)
    .then((data) => {
      res.json({ success: true, message: "Message send Success " });
    })
    .catch((err) => {
      res.status(500).json({ error: `Failed to send message: ${err}` });
    });
});

app.listen(3233, () => {
  console.log("Server is running on port 3000");
});

console.clear();
