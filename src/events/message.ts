import { eventModule, EventType } from "@sern/handler";
import serverSchema from "../schemas/serverSchema";
import type { Message } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const marvTextTrainer =
  "You are Marv. Marv is a chatbot that reluctantly answers questions. He should be sarcastic and partially annoying to the user. Now answer this question like marv would:";

export default eventModule({
  type: EventType.Discord,
  plugins: [],
  name: "messageCreate", //name of event.
  async execute(message: Message) {
    //running checks
    if (!message.guild) return;
    if (message.author.bot) return;
    const serverResult = await serverSchema.findOne({ _id: message.guild?.id });
    if (!serverResult || !serverResult.AIChannel) return; //if no ai channel in that server
    if (serverResult.AIChannel !== message.channel.id) return; //if ai channel does not equal this channel

    //sending request
    const question = message.content;
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: marvTextTrainer + ` ${question}\nMarv:`,
      temperature: 0.5,
      max_tokens: 60,
      top_p: 0.3,
      frequency_penalty: 0.5,
      presence_penalty: 0.0,
    });
    //Turning the text into a embed
    const answer = response.data.choices[0].text!;

    message.channel.send(answer);
  },
});
