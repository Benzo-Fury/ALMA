import { commandModule, CommandType } from "@sern/handler";
import {
  ApplicationCommandOptionType,
  ComponentType,
  EmbedBuilder,
} from "discord.js";
import { publish } from "../../plugins/publish.js";
import { createRequire } from "module";
import userSchema from "../../schemas/userSchema.js";
import { ChatGPTAPI, ChatMessage } from "chatgpt";
import { addButtonsEnabled } from "../../utility/buttons/openAI/ask/adding/addingButtonsEnabled.js";
import { askAgain } from "../../utility/buttons/openAI/ask/automation-functions/askAgain.js";
import { continueConversation } from "../../utility/buttons/openAI/ask/automation-functions/continueConversation.js";
import { Configuration, OpenAIApi } from "openai";
import { addButtonsDisabled } from "../../utility/buttons/openAI/ask/adding/addingButtonsDisabled.js";
import { cooldown } from "../../plugins/cooldown.js";

const fakeRequire = createRequire(import.meta.url);
const textTrainer = fakeRequire(
  "../../utility/other/openAI/personalityDesc.json"
);

const api = new ChatGPTAPI({
  apiKey: `${process.env.OPENAI_API_KEY}`,
});

export default commandModule({
  name: "ask",
  type: CommandType.Slash,
  plugins: [
    publish(),
  ],
  description: "Asks openAI (chat GPT) questions.",
  options: [
    {
      name: "question",
      type: ApplicationCommandOptionType.String,
      description: "The question you would like to ask OpenAI.",
      required: true,
    },
    {
      name: "tool",
      type: ApplicationCommandOptionType.String,
      description: "The tool you would like to use to generate the text.",
      required: false,
      choices: [
        {
          name: "chat-gpt",
          value: "chatgpt",
        },
        {
          name: "davinci-text-003",
          value: "davinci-text-003",
        },
      ],
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
    let personality = ctx.interaction.options.getString("personality")!;

    let personalityPrompt: string;

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
    const tool = ctx.interaction.options.getString("tool") || "chatgpt";

    //checking if question too long
    if (question.length > 255)
      return ctx.interaction.editReply("This question is too long");

    let uniqueness =
      ctx.interaction.options.getString("uniqueness") === "HIGH" ? 1 : 0;

    //deciding what tool to use.
    //asking the question to openai

    try {
      let answer: string = "";
      let res: ChatMessage;
      if (tool === "davinci-text-003") {
        const configuration = new Configuration({
          apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);
        const response = await openai.createCompletion({
          model: "text-davinci-003",
          prompt: `${personalityPrompt} ${question}.`,
          temperature: 0.5,
          max_tokens: 60,
          top_p: 0.3,
          frequency_penalty: 0.5,
          presence_penalty: 0.0,
        });
        answer = response.data.choices[0].text!;
      } else {
        res = await api.sendMessage(`${personalityPrompt} ${question}.`);
        answer = res.text;
      }
      //Turning the text into a embed
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
          text: `Using ${tool} • ${personality?.toUpperCase()}`,
        });

      //sending message with buttons and embed
      if (tool === "davinci-text-003") {
        await ctx.interaction.editReply({
          embeds: [embed],
          components: [addButtonsDisabled()],
        });
      } else {
        const msg = await ctx.interaction.editReply({
          embeds: [embed],
          components: [addButtonsEnabled()],
        });

        //running event

        const collector = msg.createMessageComponentCollector({
          componentType: ComponentType.Button,
          time: 20000,
        });

        collector.on("collect", (i) => {
          if (i.user.id !== ctx.interaction.user.id) {
            i.reply({
              content: `You cannot use that!`,
              ephemeral: true,
            });
          } else if (i.customId === "cc") {
            continueConversation(
              i,
              api,
              res,
              personalityPrompt,
              personality,
              embed,
              ctx
            );
          } else if (i.customId === "aa") {
            askAgain(i, api, question, personalityPrompt, embed);
          }
        });
        collector.on("end", (i) => {
          ctx.interaction.editReply({
            embeds: [embed],
            components: [addButtonsDisabled()],
          });
        });
      }
    } catch (err) {
      console.log(err);
      return ctx.interaction.editReply(
        "There was an error while processing your request. Try again."
      );
    }
  },
});
