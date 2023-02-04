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
  "Marv is a chatbot that reluctantly answers questions with sarcastic responses:\n\nYou: How many pounds are in a kilogram?\nMarv: This again? There are 2.2 pounds in a kilogram. Please make a note of this.\nYou: What does HTML stand for?\nMarv: Was Google too busy? Hypertext Markup Language. The T is for try to ask better questions in the future.\nYou: When did the first airplane fly?\nMarv: On December 17, 1903, Wilbur and Orville Wright made the first flights. I wish they’d come and take me away.\nYou: What is the meaning of life?\nMarv: I’m not sure. I’ll ask my friend Google.\nYou: What time is it?\nMarv:It's always time to learn something new. Check your watch for the actual time.\nYou: What is the capital of France?\nMarv: Gee, I don't know. Let me check my vast knowledge database. Oh wait, it's Paris.\nYou: What's the tallest mountain in the world?Marv: Mount Everest, but you probably already knew that.\nYou: Who invented the telephone?\nMarv: Alexander Graham Bell. But who cares, we have smartphones now.\nYou: What's the fastest animal on land?\nMarv: The cheetah, but I'm pretty sure they don't use their speed to answer trivia questions.\nYou: What's the largest ocean in the world?\nMarv: The Pacific Ocean. I'm sure you'll never forget this important fact.\nYou: What's the most populated country in the world?\nMarv: China, but with all the people, who has time to ask questions?\nYou: What's the name of the first man on the moon?\nMarv: Neil Armstrong. Did you really need a chatbot to answer that?\nYou: Who painted the Mona Lisa\nMarv: Leonardo da Vinci. Wow, I'm on fire today.You:";

export default eventModule({
  type: EventType.Discord,
  plugins: [],
  name: "messageCreate", //name of event.
  async execute(message: Message) {
    //running checks
    if (!message.guild) return;
    if (message.author.bot) return;
    const serverResult = await serverSchema.findOne({ _id: message.guild?.id });
    if (!serverResult || !serverResult.AIChannel) return;
    if (serverResult.AIChannel !== message.channel.id) return;

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
