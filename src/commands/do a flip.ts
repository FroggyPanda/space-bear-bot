import { ChatInputCommandInteraction, InteractionResponse } from 'discord.js';
import { Discord, Slash } from 'discordx';

@Discord()
export class DoAFlip {
  @Slash({
    name: 'do-a-flip',
    description: 'Ask Space Bear to do a flip',
  })
  DoAFlip(
    interaction: ChatInputCommandInteraction
  ): Promise<InteractionResponse<boolean>> {
    return interaction.reply({
      content: 'https://imgur.com/a/i3SstxD',
      ephemeral: true,
    });
  }
}
