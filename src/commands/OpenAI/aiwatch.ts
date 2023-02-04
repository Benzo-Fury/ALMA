import { commandModule, CommandType } from "@sern/handler";
import { guildOnly } from "../../plugins/guildOnly";
import { permCheck } from "../../plugins/permCheck";
import { publish } from "../../plugins/publish";
import { confirmation } from '../../plugins/buttonConfirmation'
import serverSchema from "../../schemas/serverSchema";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";

export default commandModule({
  type: CommandType.Slash,
  plugins: [publish(), permCheck('Administrator', 'This command requires Administrator to operate.'), guildOnly(), confirmation({})],
  description: "Starts the AI watching algorithm in this channel.",
  options: [
    {
      name: "personality",
      type: ApplicationCommandOptionType.String,
      description: 'The personality the AI will talk to you with.',
      choices: [
        {
          name: 'marv',
          value: "marv" 
        }
      ]
    }
  ],
  //alias : [],
  execute: async (ctx, args) => {
    const personality = ctx.interaction.options.getString('personality')
    let personalityDesc
    if(personality == 'Marv') {
      personalityDesc = 'Marv is a chatbot that reluctantly answers questions with sarcastic responses that is trained by text to answer text.'
    }

    //updating database
    await serverSchema.findOneAndUpdate(
      {
        _id: ctx.guild?.id,
      },
      {
        AIChannel: ctx.channel?.id,
        AIPersonality: personality
      },
      {
        upsert: true,
      }
    );
    const embed = new EmbedBuilder()
    .setColor('#2f3136')
    .setAuthor({
      name: 'AI Monitoring',
      iconURL:
        "https://cdn.discordapp.com/attachments/997760352387338280/1071310712745508984/ghat_gpt.png",
    })
    .setDescription(`This channel will now respond to all messages with the custom text trained AI called ${personality}. ${personalityDesc} Have fun. `)
    ctx.interaction.editReply({embeds: [embed]})
  },
});
