import { eventModule, EventType } from "@sern/handler";
import type { Client } from "discord.js";
import mongo from '../mongo'
import dotenv from "dotenv";

dotenv.config();

export default eventModule({
  type: EventType.Discord,
  plugins: [],
  name: "ready", //name of event.
  async execute(client: Client) {
   mongo()
  },
});
