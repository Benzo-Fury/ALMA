import { DefaultLogging, eventModule, EventType } from "@sern/handler";
import dotenv from "dotenv";

dotenv.config();

export default eventModule({
  type: EventType.Sern,
  plugins: [],
  name: "error",
  execute(err) {
    console.log(err)
  },
});
