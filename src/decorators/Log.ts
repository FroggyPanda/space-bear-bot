import {
  ChatInputCommandInteraction,
  ButtonInteraction,
  SelectMenuInteraction,
} from 'discord.js';
import { GuardFunction } from 'discordx';
import chalk from 'chalk';

const Log: GuardFunction<
  ChatInputCommandInteraction | ButtonInteraction
> = async (args, client, next) => {
  if (args instanceof ChatInputCommandInteraction && args.user) {
    console.log(
      chalk.yellow(
        `${args.user.username} (${args.user.id}): ${args.commandName}`
      )
    );
  } else if (args instanceof ButtonInteraction && args.user) {
    console.log(
      chalk.cyan(`${args.user.username} (${args.user.id}): ${args.customId}`)
    );
  }
  // else if (args instanceof SelectMenuInteraction && args.user) {
  //   console.log(
  //     chalk.green(`${args.user.username} (${args.user.id}): ${args.customId}`)
  //   );
  // }
  await next();
};

export default Log;
