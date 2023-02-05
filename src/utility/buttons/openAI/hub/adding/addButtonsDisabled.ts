import { ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";

export function addButtonsDisabled() {
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder() //START
      .setCustomId("start")
      .setLabel("Start")
      .setStyle(ButtonStyle.Success)
      .setDisabled(true),
    new ButtonBuilder() //STOP
      .setCustomId("stop")
      .setLabel("Stop")
      .setStyle(ButtonStyle.Danger)
      .setDisabled(true),
    new ButtonBuilder() // AI PERSONALITY
      .setCustomId("personality")
      .setLabel("Personality")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(true),
  );
  return row;
}
