import { eventModule, EventType } from "@sern/handler";
import type { Client } from "discord.js";
import { REST, Routes } from "discord.js";
import mongo from "../../utility/database/connection/mongooseConnect";
import dotenv from "dotenv";

dotenv.config();

export default eventModule({
  type: EventType.Discord,
  plugins: [],
  name: "ready",
  async execute(client: Client) {
    mongo(); 
    /*const rest = new REST({ version: '10' }).setToken(`${process.env.TOKEN}`);

   rest.put(Routes.applicationCommands(`${client.user?.id}`)*/
  },
});
