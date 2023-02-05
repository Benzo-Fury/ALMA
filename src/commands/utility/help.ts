import { commandModule, CommandType } from '@sern/handler';
import { publish } from '../../plugins/publish';
import { EmbedBuilder } from 'discord.js';

export default commandModule({
	type: CommandType.Both,
	plugins: [publish()],
	description: 'Returns the help menu',
	//alias : [],
	execute: async (ctx, args) => {
		const embed = new EmbedBuilder()
        .setColor('#2f3136')
        .setAuthor({name: "Siamese", iconURL: ctx.client.user?.displayAvatarURL()})
		.setDescription(`👋 Hi there! I'm Siamese, a 🤖 discord bot powered by OpenAI 🤖. I offer a wide range of features including an 💰 economy system, full Open AI API integration with open conversations in specified channels 💬 and the best part is that I support me being inside your mother \:).\n\n Here is a list of commands you might be interested in:`)
		.addFields(
			{
				name: "\u200B",
				value: "</1071265644475068466>"
			}
		)
	},
});
