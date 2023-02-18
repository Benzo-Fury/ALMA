import { Client, GatewayIntentBits } from "discord.js";
import {
  Dependencies,
  Sern,
  single,
  Singleton,
  DefaultLogging,
} from "@sern/handler";
import dotenv from "dotenv";
import pkg from 'mongoose'

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

interface MyDependencies extends Dependencies {
  "@sern/client": Singleton<Client>;
  "@sern/logger": Singleton<DefaultLogging>;
  mongoose: Singleton<pkg.Connection>;
}

export const useContainer = Sern.makeDependencies<MyDependencies>({
  build: (root) =>
    root
      .add({ "@sern/client": single(() => client) })
      .upsert({ "@sern/logger": single(() => new DefaultLogging()) })
      .add({ mongoose: single(() => pkg.connection) }),
});

Sern.init({
  commands: "dist/commands",
  events: "dist/events",
  containerConfig: {
    get: useContainer,
  },
});

client.setMaxListeners(0);

client.login(process.env.TOKEN);
