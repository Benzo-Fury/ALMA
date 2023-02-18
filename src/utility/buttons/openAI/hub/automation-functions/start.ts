import {
  ActionRowBuilder,
  CacheType,
  ButtonInteraction,
  StringSelectMenuBuilder,
  ComponentType,
  EmbedBuilder,
} from "discord.js";
import serverSchema from "../../../../database/schemas/serverSchema";
import userSchema from "../../../../database/schemas/userSchema";
import personalityDesc1 from "../../../../other/openAI/personalityDesc.json";
import textTrainer from '../../../../other/openAI/personalityDesc.json'

export async function start(i: ButtonInteraction<CacheType>) {
  //creating modal to gather information to start the AI watching

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
      .addOptions({
        label: "Trevor",
        description:
          "Trevor is a chatbot that... that... yeah its best if I dont say.",
        value: "trevor",
      })
  );

  const message = await i.reply({
    content: "Please select a personality for the AI to have.",
    components: [row],
  });

  //creating the collector to receive personality answer

  let personality: any;

  //filter

  const filter = (c: any) => {
    return c.user.id === i.user.id;
  };

  //creating the collector and editing message while preparing for db update

  message
    .awaitMessageComponent({
      filter,
      componentType: ComponentType.SelectMenu,
      time: 60000,
    })
    .then(async (interaction) => {
      //gathering personality info
      personality = interaction.values[0];
      let personalityDesc;

      //setting personality desc for right chatbot
      switch (personality) {
        case "maria":
          personalityDesc = personalityDesc1.maria.desc;
          break;
        case "trevor":
          {
            const userResult = await userSchema.findOne({ _id: interaction.user.id });
            if (!userResult || userResult.trevorAllowed === false)
              return interaction.reply(
                "This chatbot is not accessible by you."
              );
            personalityDesc = textTrainer.trevor.desc;
          }
          break;
        default:
          "marv";
          personalityDesc = personalityDesc1.marv.desc;
          break;
      }

      //updating database with new AI watching info

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

      //replying/editing with successful AI watch start/update.
      interaction.reply({ embeds: [embed] });
    })
    .catch((err) => {
      throw new Error(err);
    });
}
