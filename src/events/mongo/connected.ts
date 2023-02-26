import { EventType, eventModule, DefaultLogging } from "@sern/handler";

export default eventModule({
  type: EventType.External,
  emitter: "mongoose",
  name: "connected",
  execute() {
    
  },
});