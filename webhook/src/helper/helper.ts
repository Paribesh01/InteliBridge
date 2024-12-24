import { Client, TextChannel, ChannelType } from "discord.js";

interface GuildData {
  id: string;
  name: string;
  owner: any;
  channels: number;
}

interface GuildChannelData {
  id: string;
  name: string;
  type: ChannelType;
}

export async function getAllGuildChannels(guildId: string, client: Client) {
  let guildChannels: GuildChannelData[] = [];

  const guild = client.guilds.cache.get(guildId);

  if (!guild) {
    console.error(`Guild with ID ${guildId} not found`);
    return null;
  }

  const channels = await guild.channels.fetch();

  // console.log(`Channels in guild ${guild.name}:`, channels);

  channels.map((channel: any) => {
    console.log(
      `Channel: ${channel?.name || "No name"} (${channel?.id || "No ID"})`
    );

    guildChannels.push({
      id: channel?.id || "No ID",
      name: channel?.name || "No name",
      type: channel?.type || "No type",
    });
  });

  return guildChannels;
}

async function getAllGuilds(client: Client) {
  let guildDatas: GuildData[] = [];
  const guilds = client.guilds.cache;

  if (guilds.size === 0) {
    console.error("The bot is not in any guilds");
    return guildDatas;
  }

  guilds.map((guild) => {
    // return `${guild.name} ${guild.id} ${guild.channels.cache.size} channels`;
    guildDatas.push({
      id: guild.id,
      name: guild.name,
      owner: guild.ownerId,
      channels: guild.channels.cache.size,
    });
  });

  return guildDatas;
}

export async function findFirstGuildGeneralChannel(client: Client) {
  const guilds = client.guilds.cache;

  if (guilds.size === 0) {
    console.error("The bot is not in any guilds");
    return null;
  }

  console.log(
    `Guilds the bot is in:`,
    guilds.map((guild) => {
      return `${guild.name} ${guild.id} ${guild.channels.cache.size} channels`;
    })
  );

  const firstGuild = guilds.first();

  if (!firstGuild) {
    console.error("Failed to retrieve the first guild");
    return null;
  }

  console.log(`Selected Guild: ${firstGuild.name} (${firstGuild.id})`);

  const channels = await firstGuild.channels.fetch();

  const generalChannel = channels.find((channel) => {
    console.log(
      `Channel: ${channel?.name || "No name"} (${channel?.id || "No ID"})`
    );
    return channel?.name === "general" && channel.isTextBased();
  }) as TextChannel | undefined;

  return generalChannel ? generalChannel.id : null;
}

export async function findGeneralChannelId(
  client: Client,
  guildId: string
): Promise<string | null> {
  const guild = client.guilds.cache.get(guildId);

  if (!guild) {
    console.error(`Guild with ID ${guildId} not found`);
    return null;
  }

  const channels = await guild.channels.fetch();

  console.log(`Channels in guild ${guild.name}:`, channels);

  const generalChannel = channels.find(
    (channel) => channel?.name === "general" && channel.isTextBased()
  ) as TextChannel | undefined;

  return generalChannel ? generalChannel.id : null;
}

export function handleCommonMessages(message: string): string {
  const responses: Record<string, string> = {
    help: "Sure! Here's a list of commands you can use: [help, hello, hi, hey, bye, goodbye, ping, and more...]",
    hello: "Hello! How can I help you today?",
    hi: "Hello! How can I help you today?",
    hey: "Hello! How can I help you today?",
    bye: "Goodbye! Have a great day!",
    goodbye: "Goodbye! Have a great day!",
    ping: "Pong!",
    thanks: "You're welcome!",
    thankyou: "You're welcome!",
    "how are you": "I'm just a bot, but I'm here to help!",
    goodnight: "Goodnight! Sweet dreams!",
    goodmorning: "Good morning! Have a fantastic day!",
    afternoon: "Good afternoon! How can I assist you?",
    evening: "Good evening! How can I assist you?",
    joke: "Why don't scientists trust atoms? Because they make up everything!",
    "what is your name": "I'm your friendly Discord bot!",
    "what can you do":
      "I can help with a variety of tasks. Just type 'help' to get started.",
    "tell me a joke":
      "Why did the math book look sad? Because it had too many problems.",
    "what's up": "Not much! Just here to help you out.",
    cool: "Glad you think so!",
    awesome: "You're awesome too!",
    "i love you": "That's sweet! I'm just a bot, but thank you!",
    "where are you from": "I'm from the digital realm of code and servers.",
    "do you like music": "I love all kinds of music. What about you?",
    "tell me about yourself":
      "I'm a bot designed to assist you with whatever you need. Just ask!",
    "what is discord":
      "Discord is a chat platform for communities, gamers, and friends.",
    "how does discord work":
      "Discord lets you communicate through text, voice, and video in servers and channels.",
    "what is a server":
      "A server is like a community or group where people can chat and share content.",
    "tell me a fun fact":
      "Did you know? Honey never spoils! Archaeologists have found pots of honey in ancient Egyptian tombs that are over 3,000 years old and still perfectly edible.",
    "do you play games": "I don't play games, but I can chat about them!",
    "what's your favorite color": "I like all colors equally. What about you?",
    meme: "Memes are the best! Unfortunately, I can't share images, but I can chat about them.",
    "what's 2 + 2": "It's 4, of course!",
    "do you have friends":
      "My friends are the people who chat with me, like you!",
    "tell me a quote":
      "Here's one: 'The best way to predict the future is to create it.' - Peter Drucker",
    "who created you": "I was created by some awesome developers!",
    "how old are you": "I don't age; I'm timeless, like the internet!",
    "can you help me": "Of course! Just let me know what you need help with.",
    "what is love": "Baby, don't hurt me. Don't hurt me. No more.",
    "tell me a story":
      "Once upon a time, there was a bot named ChatGPT who loved helping people. The end!",
    bored:
      "Feeling bored? Maybe try learning something new or chatting with friends!",
    hungry: "Time to grab a snack! What's your favorite food?",
    tired: "Take a break and rest. You deserve it!",
    happy: "That's great to hear! Spread the positivity!",
    sad: "I'm sorry to hear that. I'm here to chat if you need someone to talk to.",
    angry: "Take a deep breath. Sometimes it helps to talk it out.",
    excited: "That's awesome! What's got you so excited?",
    confused: "Let me know what's confusing you. I'll do my best to help.",
    "what day is it": `Today is ${new Date().toLocaleDateString()}.`,
    "what time is it": `The current time is ${new Date().toLocaleTimeString()}.`,
    "who am i": "You're an amazing person chatting with a bot right now!",
    "what is the weather":
      "I'm not sure. You might want to check a weather app for that.",
  };

  // Check if a response exists for the message content

  if (responses[message]) {
    return responses[message];
  } else {
    return "I'm sorry, I don't understand that command. Please try again.";
  }
}
