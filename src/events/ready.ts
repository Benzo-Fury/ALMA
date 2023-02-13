import { eventModule, EventType } from "@sern/handler";
import type { Client } from "discord.js";
import { REST, Routes } from 'discord.js'
import mongo from '../utility/other/database/mongo.js'
import dotenv from "dotenv";

dotenv.config();

export default eventModule({
  type: EventType.Discord,
  plugins: [],
  name: "ready", //name of event.
  async execute(client: Client) {
   mongo() //connecting to database
   /*const rest = new REST({ version: '10' }).setToken(`${process.env.TOKEN}`);

   rest.put(Routes.applicationCommands(`${client.user?.id}`), { body: [] })
	.then(() => console.log('Successfully deleted all application commands.'))
	.catch(console.error);*/
  },
});
