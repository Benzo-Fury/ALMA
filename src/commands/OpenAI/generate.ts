import { commandModule, CommandType } from "@sern/handler";
import { publish } from "../../plugins/publish";
import { Configuration, OpenAIApi } from "openai";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";
import { boostAI } from 'boost-ai'

const api = new boostAI(process.env.OPENAI_API_KEY as string)

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default commandModule({
  type: CommandType.Slash,
  plugins: [publish()],
  description: "Generates a image from your prompt.",
  options: [
    {
      name: "prompt",
      description: "The prompt of the image you would like to generate.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  execute: async (ctx, args) => {
    //deferring the interaction
    await ctx.interaction.deferReply();

    const prompt = ctx.interaction.options.getString("prompt")!;

    if (prompt.length > 50) {
      return ctx.interaction.editReply("Your prompt is to long");
    }

    try {
      //creating image
      const response = await api.generateImage({
        prompt: prompt,
        amount: 1,
      })
      //creating embed
      const embed = new EmbedBuilder()
        .setAuthor({
          name: prompt,
          iconURL:
            "https://cdn.discordapp.com/attachments/997760352387338280/1071310712745508984/ghat_gpt.png",
        })
        .setColor("#2f3136")
        .setImage(response as string)
        .setFooter({ text: "Using DALL·E" });

      //sending the image
      ctx.interaction.editReply({ embeds: [embed] });
    } catch (err) {
      ctx.interaction.editReply(
        "A error occurred while trying to generate your image. Chances are that your prompt was inappropriate. Try again or use a different prompt."
      );
    }
  },
});
