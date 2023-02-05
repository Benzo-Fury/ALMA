import { ButtonInteraction, CacheType, EmbedBuilder } from "discord.js";
import serverSchema from "../../../../../schemas/serverSchema";

export async function stop(i: ButtonInteraction<CacheType>) {

    //updating database
    await serverSchema.findOneAndUpdate(
        {
            _id: i.guild?.id
        },
        {
            AIChannel: null,
        },
        {
            upsert:true
        }
    )

    //creating embed
    const embed = new EmbedBuilder()
    .setColor('#2f3136')
    .setAuthor({
        name: "AI Monitoring - Stopped",
        iconURL:
          "https://cdn.discordapp.com/attachments/997760352387338280/1071310712745508984/ghat_gpt.png",
      })
    .setDescription('AI monitoring for this server has now been disabled. If you did this as a mistake or you would like to reenable AI monitoring press the green "start" button.')

    i.reply({embeds: [embed]})
}
