import { Client, GatewayIntentBits } from 'discord.js';
import {
	Dependencies,
	Sern,
	single,
	Singleton,
	DefaultLogging,
} from '@sern/handler';
import dotenv from 'dotenv'

dotenv.config()

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.MessageContent, //Make sure this is enabled for text commands!
	],
});

interface MyDependencies extends Dependencies {
	'@sern/client': Singleton<Client>;
	'@sern/logger': Singleton<DefaultLogging>;
}

export const useContainer = Sern.makeDependencies<MyDependencies>({
	build: (root) =>
		root
			.add({ '@sern/client': single(() => client) })
			.upsert({ '@sern/logger': single(() => new DefaultLogging()) }), //using upsert because it replaces the default provided
});

//View docs for all options
Sern.init({
	defaultPrefix: '!', // removing defaultPrefix will shut down text commands
	commands: 'dist/commands',
	// events: 'dist/events' (optional),
	containerConfig: {
		get: useContainer,
	},
});

client.setMaxListeners(0)

client.login(process.env.TOKEN);
