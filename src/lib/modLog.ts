import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Guild } from 'schema';

export async function modLog(
  embed: EmbedBuilder,
  interaction: ChatInputCommandInteraction,
  guild: Guild
): Promise<void> {
  if (guild.mod_log_channel) {
    const channel = await interaction.client.channels.fetch(
      guild.mod_log_channel
    );

    if (channel) {
      if (channel.isTextBased()) {
        channel.send({
          embeds: [embed],
        });
      }
    }
  }
}
