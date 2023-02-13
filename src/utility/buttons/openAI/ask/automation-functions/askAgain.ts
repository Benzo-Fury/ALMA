import type { ChatGPTAPI, ChatMessage } from "chatgpt";
import type { ButtonInteraction, CacheType, EmbedBuilder } from "discord.js";
import { addButtonsDisabled } from '../adding/addingButtonsDisabled.js'

export async function askAgain(
  i: ButtonInteraction<CacheType>,
  api: ChatGPTAPI,
  question: string,
  textTrainer: string,
  embed: EmbedBuilder,

) {
  await i.deferReply()
  let res = await api.sendMessage(`${textTrainer} ${question}.`);
  const newEmbed = embed.setDescription(
    res.text.length > 2000 ? res.text.substring(0, 2000) : res.text
  );
  await i.editReply({ embeds: [newEmbed], components: [addButtonsDisabled()]});
}
