//private plugin :)
import { CommandType, CommandControlPlugin, controller } from "@sern/handler";
import userSchema from "../schemas/userSchema";

export function newUser() {
  return CommandControlPlugin<CommandType.Slash>(async (ctx, args) => {
    const userResult = await userSchema.findOne({ _id: userSchema });

    if (!userResult) {
      await userSchema.create({
        _id: ctx.user.id,
      });
    }

    return controller.next();
  });
}
