import { eventModule, EventType } from "@sern/handler";
import serverSchema from "../schemas/serverSchema";
import type { Message } from "discord.js";
import dotenv from "dotenv";
import textTrainers from "../utility/other/openAI//personalityDesc.json";
//add memory

dotenv.config();

import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default eventModule({
  type: EventType.Discord,
  plugins: [],
  name: "messageCreate", //name of event.
  async execute(message: Message) {
    //running checks
    if (!message.guild) return;
    if (message.author.bot) return;
    if (message.content.endsWith("--ignore")) return;
    const serverResult = await serverSchema.findOne({ _id: message.guild?.id });
    if (!serverResult || !serverResult.AIChannel) return; //if no ai channel in that server
    if (serverResult.AIChannel !== message.channel.id) return; //if ai channel does not equal this channel

    const question = message.content;
    let prompt;
    //detecting the personality and assigning it
    switch (serverResult.AIPersonality) {
      case "maria":
        prompt = textTrainers.maria["text-trainer"] + ` ${question}\nMaria:`;
        break;
      case "trevor":
        prompt = textTrainers.trevor["text-trainer"] + `${question}\nTrevor:`
        break;
      default:
        "marv";
        prompt = textTrainers.marv["text-trainer"] + `${question}\nMarv:`;
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
