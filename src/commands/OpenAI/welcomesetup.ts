import { commandModule, CommandType } from "@sern/handler";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { guildOnly } from "../../plugins/guildOnly.js";
import { permCheck } from "../../plugins/permCheck.js";
import { publish } from "../../plugins/publish.js";
import serverSchema from "../../schemas/serverSchema.js";
import userSchema from "../../schemas/userSchema.js";

export default commandModule({
  type: CommandType.Both,
  plugins: [publish(), guildOnly(), permCheck('Administrator', 'You must be a server administrator to run this command.')],
  description: "Sets up the welcome channel.",
  //alias : [],
  options: [
    {
      name: "chat-bot",
      type: ApplicationCommandOptionType.String,
      description:
        "The chat-bot/personality you would like to welcome new members.",
      required: true,
      choices: [
        {
          name: "marv",
          value: "marv",
        },
        {
          name: "maria",
          value: "maria",
        },
        {
          name: "trevor",
          value: "trevor",
        },
      ],
    },
  ],
  execute: async (ctx, args) => {
    //gathering info
    const personality = ctx.interaction.options.getString("chat-bot")!;

    //running checks for trevor
    if (personality === "trevor") {
      const userResult = await userSchema.findOne({ _id: ctx.user.id });
      if (!userResult || userResult.trevorAllowed === false)
        return ctx.interaction.reply(
          "This chatbot is not accessible by you."
        );
    }

    //updating database
    await serverSchema.findOneAndUpdate(
      {
        _id: ctx.guild?.id
      },
      {
        welcomeChannel: ctx.channel?.id,
        welcomeAIPersonality: personality
      },
      {
        upsert: true
      }
    )

    //creating and sending embed
    const embed = new EmbedBuilder()
        .setColor("#2f3136")
        .setAuthor({
          name: `Welcome Channel - ${personality.toUpperCase()}`,
          iconURL:
            "https://cdn.discordapp.com/attachments/997760352387338280/1071310712745508984/ghat_gpt.png",
        })
        .setDescription(
          `This channel will now send a custom made message from ${personality} each time a new user joins.`
        )
    ctx.reply({embeds: [embed]})
  },
});
