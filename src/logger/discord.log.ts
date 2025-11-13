import { Client, GatewayIntentBits, type TextChannel } from "discord.js";
import dotenv from "dotenv";

dotenv.config();
const { DISCORD_BOT_TOKEN, DISCORD_CHANNEL_ID } = process.env;

interface EmbedCodeMessage {
  title: string;
  content: string;
  code: string;
}

export class DiscordLoggerService {
  client: Client<boolean>;
  channelId: string;

  constructor() {
    this.client = new Client({
      intents: [
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
      ],
    });

    this.channelId = DISCORD_CHANNEL_ID!;

    this.client.on("ready", () => {
      console.info(`[Discord] Logged in as ${this.client.user?.tag}`);
    });

    void this.client.login(DISCORD_BOT_TOKEN);
  }

  sendFormatCodeMsg({ content, title, code }: EmbedCodeMessage) {
    const codeMsg = {
      content,
      embeds: [
        {
          title,
          color: parseInt("00ff00", 16),
          description: "```json\n" + JSON.stringify(code, null, 2) + "\n```",
        },
      ],
    };

    const channel = this.client.channels.cache.get(this.channelId);

    if (!channel) {
      console.error(`Channel not found :: ${this.channelId}`);
      return;
    }

    if (channel.isTextBased()) {
      (channel as TextChannel).send(codeMsg).catch(console.error);
    }
  }
}
