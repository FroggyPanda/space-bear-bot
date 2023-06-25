import { ChatInputCommandInteraction, InteractionResponse } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { log } from '../lib/index.js';

@Discord()
export class DoAFlip {
  @Slash({
    name: 'do-a-flip',
    description: 'Ask Space Bear to do a flip',
  })
  DoAFlip(
    interaction: ChatInputCommandInteraction
  ): Promise<InteractionResponse<boolean>> {
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
      content: 'https://imgur.com/a/i3SstxD',
      ephemeral: true,
    });
  }
}
