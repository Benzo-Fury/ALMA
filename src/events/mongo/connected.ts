import { EventType, eventModule } from "@sern/handler";

export default eventModule({
  type: EventType.External,
  emitter: "mongoose",
  name: "connected",
  execute() {
    console.log('Mongo > Connected')
  },
});