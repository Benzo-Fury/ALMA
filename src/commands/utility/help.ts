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
	},
});
