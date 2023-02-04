import { commandModule, CommandType } from "@sern/handler";
import { publish } from "../../plugins/publish";
import { Configuration, OpenAIApi } from "openai";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default commandModule({
  type: CommandType.Both,
  plugins: [publish()],
  description: "Generates a image from your prompt.",
  //alias : [],
  options: [
    {
      name: "prompt",
      description: "The prompt of the image you would like to generate.",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
  ],
  execute: async (ctx, args) => {
    //getting the question from the command
    if (ctx.isMessage()) {
      return ctx.reply(
        "This command can only be used as a interaction (/generate)."
      );
    }

    //deferring the interaction
    await ctx.interaction.deferReply();

    const prompt = ctx.interaction.options.getString("prompt")!;

    try {
      //creating image
      const response = await openai.createImage({
        prompt,
        n: 1,
        size: "1024x1024",
      });
      //creating embed
      const embed = new EmbedBuilder()
      .setColor("#2f3136")
      .setTitle('Image Generation')
      .setImage(`${response.data.data[0].url}`)

      //sending the image
      ctx.interaction.editReply({ content: response.data.data[0].url });
    } catch {
      ctx.interaction.editReply(
        "A error occurred while trying to generate your image. Chances are that your prompt was inappropriate. Try again or use a different prompt."
      );
    }
  },
});
