import { commandModule, CommandType } from "@sern/handler";
import { guildOnly } from "../../plugins/guildOnly";
import { permCheck } from "../../plugins/permCheck";
import { publish } from "../../plugins/publish";
import {
  ComponentType,
  EmbedBuilder,
} from "discord.js";
import { addButtonsEnabled } from "../../utility/buttons/openAI/hub/adding/addButtonsEnabled";
import { addButtonsDisabled } from "../../utility/buttons/openAI/hub/adding/addButtonsDisabled";
import { start } from "../../utility/buttons/openAI/hub/watching/start";
import { personality } from "../../utility/buttons/openAI/hub/watching/personality";
import { stop } from "../../utility/buttons/openAI/hub/watching/stop";

export default commandModule({
  type: CommandType.Slash,
  plugins: [
    publish(),
    permCheck(
      "Administrator",
      "This command requires Administrator to operated."
    ),
    guildOnly(),
  ],
  description: "Starts the AI watching algorithm in this channel.",
  //alias : [],
  execute: async (ctx, args) => {
    //GOAL: CREATE EMBED WITH BUTTONS THAT CAN BE CLICKED TO CHANGE THINGS WITHIN AI WATCHING CHANNEL
    const embed = new EmbedBuilder()
      .setColor("#2f3136")
      .setAuthor({
        name: "AI Monitoring",
        iconURL:
          "https://cdn.discordapp.com/attachments/997760352387338280/1071310712745508984/ghat_gpt.png",
      })
      .setDescription(
        "Use the buttons below to change settings or features regarding AI monitoring.\n***Any changes made will apply to this channel.***"
      );

    //buttons are being added and imported from the function
    const message = await ctx.reply({
      embeds: [embed],
      components: [addButtonsEnabled()],
    });
    const collector = message.createMessageComponentCollector({
      componentType: ComponentType.Button,
      time: 15000,
    });

    collector.on("collect", (i) => {
      if (i.user.id !== ctx.interaction.user.id || !i.isButton()) return;
      if(i.customId === 'start') start(i);
      if(i.customId === 'personality') personality(i)
      if(i.customId === 'stop') stop(i)
      message.edit({embeds: [embed], components: [addButtonsDisabled()]})
    });
  },
});
