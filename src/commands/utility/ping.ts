import { commandModule, CommandType } from "@sern/handler";
import { publish } from "../../plugins/publish.js";

export default commandModule({
  type: CommandType.Both,
  plugins: [publish()],
  description: "A ping command",
  //alias : [],
  execute: async (ctx, args) => {
    await ctx.reply("Pong 🏓");
  },
});
