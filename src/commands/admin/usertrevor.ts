import { commandModule, CommandType } from "@sern/handler";
import { ApplicationCommandOptionType } from "discord.js";
import { ownerOnly } from "../../plugins/ownerOnly.js";
import { publish } from "../../plugins/publish.js";
import userSchema from "../../schemas/userSchema.js";

export default commandModule({
  type: CommandType.Both,
  plugins: [publish(), ownerOnly()],
  description: "A ping command",
  //alias : [],
  options: [
    {
        name: "user",
        type: ApplicationCommandOptionType.User,
        description: "The user",
        required: true
    },
    {
        name: "boolean",
        type: ApplicationCommandOptionType.Boolean,
        description: "boolean",
        required: true
    }
  ],
  execute: async (ctx, args) => {
    const user = ctx.interaction.options.getUser('user')
    const boolean = ctx.interaction.options.getBoolean('boolean')
    const userResult = await userSchema.findOneAndUpdate(
        {
            _id: user?.id
        }, 
        {
            trevorAllowed: boolean
        },
        {
            upsert: true
        }
    )
    await ctx.reply(`${user} has now been given permission to use trevor 😏`);
  },
});
