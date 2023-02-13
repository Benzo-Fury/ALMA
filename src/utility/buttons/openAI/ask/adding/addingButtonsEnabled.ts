import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export function addButtonsEnabled() {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder() //Continue Conversation
      .setCustomId("cc")
      .setLabel("➡️ Continue Conversation")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder() //STOP
      .setCustomId("aa")
      .setLabel("🔁 Ask Again")
      .setStyle(ButtonStyle.Secondary),
  );
  return row;
}
