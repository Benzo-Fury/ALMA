// @ts-nocheck
/**
 * This is perm check, it allows users to parse the permission you want and let the plugin do the rest. (check user for that perm).
 *
 * @author @Benzo-Fury [<@762918086349029386>]
 * @version 1.0.1
 * @example
 * ```ts
 * import { permCheck } from "../plugins/permCheck";
 * import { commandModule } from "@sern/handler";
 * export default commandModule({
 *  plugins: [ permCheck('permission', 'No permission response') ],
 *  execute: (ctx) => {
 * 		//your code here
 *  }
 * })
 * ```
 */

import { CommandControlPlugin, CommandType, controller } from "@sern/handler";
export function guildOnly() {
	return CommandControlPlugin<CommandType.Both>(async (ctx, args) => {
		if(!ctx.guild) {
            await ctx.reply('This command must be used inside a guild.')
            return controller.stop()
        }
		return controller.next();
	});
}
