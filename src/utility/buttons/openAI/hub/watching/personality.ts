import {
  ActionRowBuilder,
  ButtonInteraction,
  CacheType,
  ComponentType,
  EmbedBuilder,
  StringSelectMenuBuilder,
} from "discord.js";
import serverSchema from "../../../../../schemas/serverSchema";
import personalityDesc1 from "../../../../other/openAI/personalityDesc.json";

export async function personality(i: ButtonInteraction<CacheType>) {
  const serverResult = await serverSchema.findOne({ _id: i.guild?.id });

  //running checks

  if (!serverResult || !serverResult.AIChannel)
    return await i.reply(
      'This server does not yet have a AI monitoring channel set up. Set one up with the "Start" button.'
    );
  if (serverResult.AIChannel !== i.channel?.id)
    return await i.reply(
      `This is not the channel that AI monitoring was setup in. Please reuse this command in <#${serverResult.AIChannel}>.`
    );

  //creating the select menu
  const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId("select")
      .setPlaceholder("Select a personality.")
      .addOptions({
        label: "Marv",
        description:
          "Marv is a chatbot that reluctantly answers questions with sarcastic responses.",
        value: "marv",
      })
      .addOptions({
        label: "Maria",
        description:
          "Maria is a chatbot designed to provide helpful and informative responses.",
        value: "maria",
      })
  );

  //sending the select menu
  const message = await i.reply({
    content: "Please select a new AI personality.",
    components: [row],
  });

  //filter
  const filter = (c: any) => {
    return c.user.id === i.user.id;
  };

  //creating collector and responding to it
  message
    .awaitMessageComponent({
      filter,
      componentType: ComponentType.SelectMenu,
      time: 60000,
    })
    .then(async (interaction) => {
      const personality = interaction.values[0];
      if (!personality) throw new Error("No personality!");
      await serverSchema.findOneAndUpdate(
        {
          _id: interaction.guild?.id,
        },
        {
          AIChannel: interaction.channel?.id,
          AIPersonality: personality,
        },
        {
          upsert: true,
        }
      );

      let personalityDesc;

      //setting personality desc for right chatbot
      switch (personality) {
        case "maria":
          personalityDesc = personalityDesc1.maria;
          break;
        default:
          "marv";
          personalityDesc = personalityDesc1.marv;
          break;
      }
      //creating embed to send with edit
      const embed = new EmbedBuilder()
        .setColor("#2f3136")
        .setAuthor({
          name: `AI Monitoring - ${personality.toUpperCase()}`,
          iconURL:
            "https://cdn.discordapp.com/attachments/997760352387338280/1071310712745508984/ghat_gpt.png",
        })
        .setDescription(
          `This channel will now respond to all messages with the custom text trained AI called ${personality}. ${personalityDesc} Have fun. `
        )
        .addFields({
          name: `Some Questions to Ask ${personality}`,
          value:
            "- What is the time? ⏰\n- What is the biggest animal in the world? 🐱\n- What is the most vibrant color? 🟪",
        });
      await interaction.reply({ embeds: [embed] });
    })
    .catch((err) => {
      throw new Error(err);
    });
}
