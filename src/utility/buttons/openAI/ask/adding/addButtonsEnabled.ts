import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export function addButtonsEnabled() {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(    new ButtonBuilder() //STOP
      .setCustomId("aa")
      .setLabel("🔁 Ask Again")
      .setStyle(ButtonStyle.Secondary)
  );
  return row;
}