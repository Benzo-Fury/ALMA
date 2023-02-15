import { eventModule, EventType } from "@sern/handler";
import serverSchema from "../schemas/serverSchema.js";
import type { Message } from "discord.js";
import dotenv from "dotenv";
import { createRequire } from "module";
import { ChatGPTAPI } from "chatgpt";

const fakeRequire = createRequire(import.meta.url);
const textTrainers = fakeRequire(
  "../utility/other/openAI//personalityDesc.json"
);
//add memory

dotenv.config();

const api = new ChatGPTAPI({
  apiKey: `${process.env.OPENAI_API_KEY}`,
});

export default eventModule({
  type: EventType.Discord,
  plugins: [],
  name: "messageCreate", //name of event.
  async execute(message: Message) {
    //running checks
    if (
      !message.guild ||
      message.author.bot ||
      message.content.endsWith("--ignore")
    )
      return;

    const serverResult = await serverSchema.findOne({ _id: message.guild?.id });
    if (
      !serverResult ||
      !serverResult.AIChannel ||
      serverResult.AIChannel !== message.channel.id
    )
      return;

    const question = message.content;
    let prompt;

    //detecting the personality and assigning it
    switch (serverResult.AIPersonality) {
      case "maria":
        prompt = textTrainers.maria["text-trainer"] + ` ${question}\nMaria:`;
        break;
      case "trevor":
        prompt = textTrainers.trevor["text-trainer"] + `${question}\nTrevor:`;
        break;
      default:
        "marv";
        prompt = textTrainers.marv["text-trainer"] + `${question}\nMarv:`;
        break;
    }

    //sending request
    const response = await api.sendMessage(prompt, {
      timeoutMs: 5 * 60 * 1000,
    });
    const answer = response.text;

    //sending embed
    message.channel.send(answer);
  },
});
