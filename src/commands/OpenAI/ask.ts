import { commandModule, CommandType } from "@sern/handler";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { publish } from "../../plugins/publish";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const marvTextTrainer =
  "You are Marv. Marv is a chatbot that reluctantly answers questions. He should be sarcastic and partially annoying to the user. Now answer this question like marv would:";
const mariaTextTrainer =
  "Maria is a chatbot designed to provide helpful and informative responses to users. With a friendly and approachable personality, Maria prioritizes the needs and satisfaction of the user, delivering clear and accurate answers in a prompt manner. Now answer this question like Maria would:";

export default commandModule({
  name: "ask",
  type: CommandType.Slash,
  plugins: [publish()],
  description: "Asks openAI (chat GPT) questions.",
  //alias : [],
  options: [
    {
      name: "question",
      type: ApplicationCommandOptionType.String,
      description: "The question you would like to ask OpenAI.",
      required: true,
    },
    {
      name: "uniqueness",
      type: ApplicationCommandOptionType.String,
      description: "How unique the text should be",
      required: false,
      choices: [
        {
          name: "low",
          value: "LOW",
        },
        {
          name: "high",
          value: "HIGH",
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
      ],
    },
  ],
  execute: async (ctx, args) => {
    //deferring interaction
    await ctx.interaction.deferReply();

    //gathering personality
    let personality = ctx.interaction.options.getString("personality");

    let personalityPrompt;

    switch (personality) {
      case "maria":
        personalityPrompt = mariaTextTrainer;
        break;
      case "marv":
        personalityPrompt = marvTextTrainer;
        break;
      default:
        "default";
        personalityPrompt = " ";
        personality = 'default'
        break;
    }

    const question = ctx.interaction.options.getString("question")!;
    let uniqueness =
      ctx.interaction.options.getString("uniqueness") === "HIGH" ? 1 : 0;

    //asking the question to openai
    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: personalityPrompt + question,
        temperature: uniqueness,
        max_tokens: 100,
      });
      //Turning the text into a embed
      const answer = response.data.choices[0].text!;
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
        .setFooter({ text: `Using davinci-003 text completion. • ${personality?.toUpperCase()}` });

      //checking the response inst to long and responding
      await ctx.interaction.editReply({ embeds: [embed] });
    } catch {
      return ctx.reply(
        "There was an error while processing your request. Try again."
      );
    }
  },
});
