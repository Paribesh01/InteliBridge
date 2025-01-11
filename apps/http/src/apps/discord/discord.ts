import "dotenv/config";
import {
  Client,
  Events,
  GatewayIntentBits,
  Message,
  TextChannel,
  Webhook,
  WebhookClient,
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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/data", (req, res) => {
  const q = req.query;
  res.json({ message: q });
});

app.get("/api/guilds", async (req, res) => {
  const guilds = client.guilds.cache;

  if (guilds.size === 0) {
    res.status(404).json({ error: "The bot is not in any guilds" });
    return;
  }

  res.json(
    guilds.map((guild) => {
      return {
        name: guild.name,
        id: guild.id,
        owner: guild.ownerId,
        channels: guild.channels.cache.size,
      };
    })
  );
});

app.get("/api/guilds/:guildId", async (req, res) => {
  const { guildId } = req.params;

  if (!guildId) {
    res.status(400).json({ error: "Guild ID is required" });
    return;
  }

  const channel_data = await getAllGuildChannels(guildId, client);

  const channel_id = channel_data![0]?.id;

  if (!channel_id) {
    res.status(404).json({ error: "No channels found in the guild" });
    return;
  }

  if (!channel_data) {
    res.status(404).json({ error: "No channels found in the guild" });
    return;
  }

  res.json({
    channels: channel_data,
  });
});

app.post("/api/hook/:channelId", async (req, res) => {
  //create a webhook at this channel

  const { channelId } = req.params;

  if (!channelId) {
    res.status(400).json({ error: "Channel ID is required" });
    return;
  }

  const channel = client.channels.cache.get(channelId) as TextChannel;

  if (!channel) {
    res.status(404).json({ error: `Channel with ID ${channelId} not found` });
    return;
  }

  const webhook = await channel.createWebhook({
    name: "Webhook",
    avatar: "https://i.imgur.com/AfFp7pu.png",
    reason: "Needed a cool new Webhook",
  });

  res.json({
    webhook: webhook,
  });
});

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
