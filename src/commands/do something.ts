import { ChatInputCommandInteraction, InteractionResponse } from 'discord.js';
import { Discord, Slash } from 'discordx';

@Discord()
export class DoSomething {
  @Slash({
    name: 'do-something',
    description: 'B.O.B. Do Something!',
  })
  doSomething(
    interaction: ChatInputCommandInteraction
  ): Promise<InteractionResponse<boolean>> {
    return interaction.reply({
      content: 'https://www.youtube.com/watch?v=hs-VeJkCRmc',
      ephemeral: true,
    });
  }
}
