import { eventModule, EventType } from "@sern/handler";
import serverSchema from "../schemas/serverSchema.js";
import userSchema from "../schemas/userSchema.js";
import type { Message } from "discord.js";
import dotenv from "dotenv";
import { createRequire } from "module";

const fakeRequire = createRequire(import.meta.url)
const textTrainers = fakeRequire('../utility/other/openAI//personalityDesc.json')
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

    const userResult = await userSchema.findOne({
      _id: message.member?.user.id,
    });

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
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Previously asked questions and answers with you and this user: ${userResult?.userMemory.join()}. ${prompt}`,
      temperature: 0.5,
      max_tokens: 60,
      top_p: 0.3,
      frequency_penalty: 0.5,
      presence_penalty: 0.0,
    });
    const answer = response.data.choices[0].text!;

    //sending embed
    message.channel.send(answer);

    //creating new memory array
    let realUserResult;

    if (!userResult) {
      await userSchema.create({ _id: message.member?.user.id });
      realUserResult = await userSchema.findOne({
        _id: message.member?.user.id,
      });
    } else {
      realUserResult = userResult;
    }

    if (realUserResult?.userMemory[2]) {
      realUserResult.userMemory.pop();
    }

    realUserResult?.userMemory.unshift(
      `User asked:${question}. You (maria) responded:${answer}`
    );

    //updating memory
    await userSchema.findOneAndUpdate(
      { _id: message.member?.user.id },
      { userMemory: realUserResult?.userMemory },
      { upsert: true }
    );
  },
});
