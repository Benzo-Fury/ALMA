import type { boostAI } from "boost-ai";
import type { ButtonInteraction, CacheType, EmbedBuilder } from "discord.js";
import { addButtonsDisabled } from "../adding/addButtonsDisabled";

export async function askAgain(
  i: ButtonInteraction<CacheType>,
  api: boostAI,
  question: string,
  textTrainer: string,
  embed: EmbedBuilder
) {
  await i.deferReply();
  const response = await api.generateText({
    model: "text-davinci-003",
    prompt: `${textTrainer} ${question}.`,
    temperature: 1.5,
    max_tokens: 100,
  });
  await i.editReply({ embeds: [embed] });
}