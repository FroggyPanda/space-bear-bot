import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { Server } from 'schema';

export async function modLog(
  embed: EmbedBuilder,
  interaction: ChatInputCommandInteraction,
  server: Server
): Promise<void> {
  if (server.mod_log_channel) {
    const channel = await interaction.client.channels.fetch(
      server.mod_log_channel
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
