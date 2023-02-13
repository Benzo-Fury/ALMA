import { commandModule, CommandType } from "@sern/handler";
import { publish } from "../../plugins/publish.js";
import { Configuration, OpenAIApi } from "openai";
import { ApplicationCommandOptionType, EmbedBuilder } from "discord.js";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default commandModule({
  type: CommandType.Slash,
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
    //deferring the interaction
    await ctx.interaction.deferReply();

    const prompt = ctx.interaction.options.getString("prompt")!;

    if (prompt.length > 50) {
      return ctx.interaction.editReply("Your prompt is to long");
    }

    try {
      //creating image
      const response = await openai.createImage({
        prompt,
        n: 1,
        size: "1024x1024",
      });
      //creating embed
      const embed = new EmbedBuilder()
        .setAuthor({
          name: prompt,
          iconURL:
            "https://cdn.discordapp.com/attachments/997760352387338280/1071310712745508984/ghat_gpt.png",
        })
        .setColor("#2f3136")
        .setImage(`${response.data.data[0].url}`)
        .setFooter({ text: "Using DALL·E" });

      //sending the image
      ctx.interaction.editReply({ embeds: [embed] });
    } catch {
      ctx.interaction.editReply(
        "A error occurred while trying to generate your image. Chances are that your prompt was inappropriate. Try again or use a different prompt."
      );
    }
  },
});
