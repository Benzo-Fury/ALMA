import type { ButtonInteraction, CacheType, EmbedBuilder } from "discord.js";
import type { OpenAIApi } from "openai";
import { addButtonsDisabled } from "../adding/addButtonsDisabled";

export async function askAgain(
  i: ButtonInteraction<CacheType>,
  api: OpenAIApi,
  question: string,
  textTrainer: string,
  embed: EmbedBuilder
) {
  await i.deferReply();
  const response = await api.createCompletion({
    model: "text-davinci-003",
    prompt: `${textTrainer} ${question}.`,
    temperature: 1.5,
    max_tokens: 100,
  });
  await i.editReply({ embeds: [embed] });
}