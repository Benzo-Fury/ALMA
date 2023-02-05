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
const mariaTextTrainer =
  "Maria is a chatbot designed to provide helpful and informative responses to users. With a friendly and approachable personality, Maria prioritizes the needs and satisfaction of the user, delivering clear and accurate answers in a prompt manner. Now answer this question like Maria would:";

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

    const question = message.content;
    let prompt;
    //detecting the personality and assigning it
    switch (serverResult.AIPersonality) {
      case "maria":
        prompt = mariaTextTrainer + ` ${question}\nMaria:`;
        break;
      default:
        "marv";
        prompt = marvTextTrainer + `${question}\nMarv:`;
        break;
    }
    //sending request
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
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
