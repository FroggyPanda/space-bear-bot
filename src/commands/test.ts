import { ChatInputCommandInteraction } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { GreenEmbed } from '../components/embeds.js';

@Discord()
export class Test {
  @Slash({ name: 'test', description: 'test' })
  async send(interaction: ChatInputCommandInteraction) {
    // interaction.deferReply({ ephemeral: true });

    // await new Promise((r) => setTimeout(r, 4000));

    return interaction.reply({
      // embeds: [GreenEmbed('Hello')],
      content: 'https://imgur.com/a/i3SstxD',
      ephemeral: true,
    });
  }
}
