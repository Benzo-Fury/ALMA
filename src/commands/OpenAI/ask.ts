import { commandModule, CommandType } from "@sern/handler";
import {
  ApplicationCommandOptionType,
  ComponentType,
  EmbedBuilder,
} from "discord.js";
import { publish } from "../../plugins/publish";
import textTrainer from "../../utility/other/openAI/personalityDesc.json";
import userSchema from "../../utility/database/schemas/userSchema";
import { addButtonsEnabled } from "../../utility/buttons/openAI/ask/adding/addButtonsEnabled";
import { askAgain } from "../../utility/buttons/openAI/ask/automation-functions/askAgain";
import { addButtonsDisabled } from "../../utility/buttons/openAI/ask/adding/addButtonsDisabled";
import { boostAI } from "boost-ai";

const connection = new boostAI(process.env.OPENAI_API_KEY as string);

export default commandModule({
  name: "ask",
  type: CommandType.Slash,
  plugins: [publish()],
  description: "Asks openAI (chat GPT) questions.",
  options: [
    {
      name: "question",
      type: ApplicationCommandOptionType.String,
      description: "The question you would like to ask OpenAI.",
      required: true,
    },
    {
      name: "personality",
      type: ApplicationCommandOptionType.String,
      description: "A personality you might like OpenAI to respond with.",
      required: false,
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
    //deferring interaction
    await ctx.interaction.deferReply();

    //gathering personality
    let personality = ctx.interaction.options.getString("personality");

    let personalityPrompt = "";

    switch (personality) {
      case "maria":
        personalityPrompt = textTrainer.maria["text-trainer"];
        break;
      case "marv":
        personalityPrompt = textTrainer.marv["text-trainer"];
        break;
      case "trevor":
        {
          const userResult = await userSchema.findOne({ _id: ctx.user.id });
          if (!userResult || userResult.trevorAllowed === false)
            return ctx.interaction.editReply(
              "This chatbot is not accessible by you."
            );
          personalityPrompt = textTrainer.trevor["text-trainer"];
        }
        break;
      default:
        "default";
        personalityPrompt = " ";
        personality = "default";
        break;
    }

    const question = ctx.interaction.options.getString("question")!;

    //checking if question too long
    if (question.length > 255)
      return ctx.interaction.editReply("This question is too long");

    //asking the question to openai
    try {
      const response = await connection.generateText({
        prompt: question,
        prefix: personalityPrompt,
        creativity: 1,
      });
      //Turning the text into a embed
      const answer = response as string;
      const embed = new EmbedBuilder()
        .setAuthor({
          name: question,
          iconURL:
            "https://cdn.discordapp.com/attachments/997760352387338280/1071310712745508984/ghat_gpt.png",
        })
        .setColor("#2f3136")
        .setDescription(
          answer.length > 2000 ? answer.substring(0, 2000) : answer
        )
        .setFooter({
          text: `Using davinci-003 text completion. ??? ${personality?.toUpperCase()}`,
        });

      //checking the response inst to long and responding
      const msg = await ctx.interaction.editReply({
        embeds: [embed],
        components: [addButtonsEnabled()],
      });

      const collector = msg.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 60000,
      });

      collector.on("collect", (i) => {
        if (i.user.id !== ctx.interaction.user.id) {
          i.reply({
            content: `You cannot use that!`,
            ephemeral: true,
          });
        } else if (i.customId === "aa") {
          askAgain(i, connection, question, personalityPrompt, embed);
        }
      });
      collector.on("end", (i) => {
        ctx.interaction.editReply({
          embeds: [embed],
          components: [addButtonsDisabled()],
        });
      });
    } catch (err) {
      console.log(err);
      return ctx.interaction.editReply(
        "There was an error while processing your request. Try again."
      );
    }
  },
});
