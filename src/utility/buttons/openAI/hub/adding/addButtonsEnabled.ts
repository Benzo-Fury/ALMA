import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export function addButtonsEnabled() {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder() //START
      .setCustomId("start")
      .setLabel("Start")
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder() //STOP
      .setCustomId("stop")
      .setLabel("Stop")
      .setStyle(ButtonStyle.Danger),
    new ButtonBuilder() // AI PERSONALITY
      .setCustomId("personality")
      .setLabel("Personality")
      .setStyle(ButtonStyle.Primary),
  );
  return row;
}
