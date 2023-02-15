import type { ChatGPTAPI, ChatMessage } from "chatgpt";
import {
  ActionRowBuilder,
  ButtonInteraction,
  CacheType,
  ComponentType,
  EmbedBuilder,
  Interaction,
  ModalActionRowComponentBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { addButtonsEnabled } from "../adding/addingButtonsEnabled.js";
import { addButtonsDisabled } from "../adding/addingButtonsDisabled.js";
import { askAgain } from "./askAgain.js";
import type { Context } from "@sern/handler";

export async function continueConversation(
  i: ButtonInteraction<CacheType>,
  api: ChatGPTAPI,
  res: ChatMessage,
  textTrainer: string,
  embed: EmbedBuilder,
  ctx: Context
) {
  //closing last buttons
  await ctx.interaction.editReply({
    embeds: [embed],
    components: [addButtonsDisabled()],
  });

  //creating modal
  const modal = new ModalBuilder()
    .setCustomId("continueConversationModal")
    .setTitle("New Question");

  const newQuestionInput = new TextInputBuilder()
    .setCustomId("newQuestionInput")
    .setLabel("Input New Question")
    .setStyle(TextInputStyle.Short);

  const firstActionRow =
    new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
      newQuestionInput
    );

  modal.addComponents(firstActionRow);
  await i.showModal(modal);

  //receiving results
  const filter = (modalI: Interaction) => modalI.user.id === i.user.id;

  const submitted = await i.awaitModalSubmit({ time: 60000, filter });
  if (!submitted) return;
  await submitted.deferReply();
  const modalResults = submitted.fields.getTextInputValue("newQuestionInput");

  // send new request to API
  try {
    res = await api.sendMessage(`${textTrainer} ${modalResults}.`, {
      conversationId: res.conversationId,
      parentMessageId: res.id,
    });
  } catch {
    return await submitted.editReply(
      'There has been to many requests made. Try again or set the "tool" to davinci-text-003'
    );
  }

  // create embed
  embed.setDescription(res.text.substring(0, 2000));

  // respond to user
  const msg = await submitted.editReply({
    embeds: [embed],
    components: [addButtonsEnabled()],
  });

  // create collector
  const collector = msg.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 60000,
  });

  collector.on("collect", async (ie: ButtonInteraction) => {
    if (ie.user.id !== i.user.id) {
      await ie.reply({ content: "You cannot use that!", ephemeral: true });
    } else if (ie.customId === "cc") {
      await ie.reply({
        content:
          "You cannot continue the conversation to a already continued conversation. If you would like to have full conversations with an AI chatbot you can set up AI monitoring with /aichathub",
      });
      await submitted.editReply({
        embeds: [embed],
        components: [addButtonsDisabled()],
      });
    } else if (ie.customId === "aa") {
      askAgain(ie, api, modalResults, textTrainer, embed);
    }
    setTimeout(async () => {
      await submitted.editReply({
        embeds: [embed],
        components: [addButtonsDisabled()],
      });
    }, 60000);
  });
}
