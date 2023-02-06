import { eventModule, EventType } from "@sern/handler";
import {
  EmbedBuilder,
  GuildBasedChannel,
  GuildMember,
  TextBasedChannel,
} from "discord.js";
import serverSchema from "../schemas/serverSchema";
import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
import textTrainer from "../utility/other/openAI/personalityDesc.json";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

dotenv.config();

export default eventModule({
  type: EventType.Discord,
  plugins: [],
  name: "guildMemberAdd", //name of event.
  async execute(member: GuildMember) {
    const serverResult = await serverSchema.findOne({ _id: member.guild.id });
    if (!serverResult || !serverResult.welcomeChannel) return;

    //gathering information
    const welcomeChannel = member.guild.channels.cache.find(
      (c) => c.id === serverResult.welcomeChannel
    )!;
    const AIPersonality = serverResult.welcomeAIPersonality;

    let personalityPrompt;

    switch (AIPersonality) {
      case "maria":
        personalityPrompt = textTrainer.maria["text-trainer"];
        break;
      case "marv":
        personalityPrompt = textTrainer.marv["text-trainer"];
        break;
      default:
        "trevor";
        personalityPrompt = textTrainer.trevor["text-trainer"];
        break;
    }

    //making request to open AI API
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt:
        personalityPrompt +
        `Please write a welcome message for this new user called <@${member.user.id}>. They have joined a new discord server and the server is called ${member.guild.name}.:`,
      temperature: 1,
      max_tokens: 100,
    });

    //Turning the text into a embed
    const answer = response.data.choices[0].text!;

    //creating embed
    const embed = new EmbedBuilder()
      .setAuthor({ name: `Welcome ${member.user.username}` })
      .setDescription(answer)
      .setColor("#2f3136");

    //sending embed
    try{
    (welcomeChannel as TextBasedChannel).send({ embeds: [embed] });
    } catch {
        console.log('couldn\'t send welcome to channel.')
        await serverSchema.findOneAndUpdate(
            {
                _id: member.guild.id
            },
            {
                welcomeChannel: null
            },
            {
                upsert: true
            }
        )
    }
  },
});
