import { ChatInputCommandInteraction, InteractionResponse } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { log } from '../lib/index.js';

@Discord()
export class DoSomething {
  @Slash({
    name: 'do-something',
    description: 'B.O.B. Do Something!',
  })
  doSomething(
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
      content: 'https://www.youtube.com/watch?v=hs-VeJkCRmc',
      ephemeral: true,
    });
  }
}
