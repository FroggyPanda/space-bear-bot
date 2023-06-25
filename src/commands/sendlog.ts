import { ChatInputCommandInteraction, InteractionResponse } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { log } from '../lib/index.js';

@Discord()
export class DoSomething {
  @Slash({
    name: 'send-logs',
    description: 'send the logs file',
  })
  doSomething(
    interaction: ChatInputCommandInteraction
  ): Promise<InteractionResponse<boolean>> {
    if (interaction.user.id !== '188851079050428427') {
      interaction.reply({
        content: 'Sorry but you are not allowed to use this command.',
        ephemeral: true,
      });
    }

    if (interaction.guild) {
      log(
        'INFO',
        `Server ID ${interaction.guild.id}: User ID ${interaction.user.id} ran command ${interaction.commandName}`
      );
    } else {
      log(
        'INFO',
        `User ID ${interaction.user.id} ran command ${interaction.commandName}`
      );
    }

    return interaction.reply({
      ephemeral: true,
      files: ['./logs.log'],
    });
  }
}
