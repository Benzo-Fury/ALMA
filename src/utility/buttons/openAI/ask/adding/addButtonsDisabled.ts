import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export function addButtonsDisabled() {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder() //STOP
      .setCustomId("aa")
      .setLabel("🔁 Ask Again")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(true)
  );
  return row;
}