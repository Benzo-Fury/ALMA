import { commandModule, CommandType } from "@sern/handler";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { publish } from "../../plugins/publish";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

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
  ],
  execute: async (ctx, args) => {
    //deferring interaction
    await ctx.interaction.deferReply();

    const question = ctx.interaction.options.getString("question")!;
    let uniqueness =
      ctx.interaction.options.getString("uniqueness") === "HIGH" ? 1 : 0;

    //asking the question to openai
    try {
      const response = await openai.createCompletion({
        model: "text-davinci-003",
        prompt: question,
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
        .setFooter({ text: "Using davinci-003 text completion." });

      //checking the response inst to long and responding
      await ctx.interaction.editReply({ embeds: [embed] });
    } catch {
      return ctx.reply(
        "There was an error while processing your request. Try again."
      );
    }
  },
});
