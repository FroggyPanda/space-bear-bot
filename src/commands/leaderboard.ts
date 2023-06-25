import { RedEmbed } from '../components/embeds.js';
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChatInputCommandInteraction,
  InteractionResponse,
  MessageActionRowComponentBuilder,
} from 'discord.js';
import { Discord, Slash } from 'discordx';
import { log } from '../lib/index.js';

@Discord()
export class Pat {
  @Slash({ name: 'leaderboard', description: "Get the server's leaderboard" })
  async send(
    interaction: ChatInputCommandInteraction
  ): Promise<InteractionResponse<boolean>> {
    if (!interaction.guild)
      return interaction.reply({
        embeds: [RedEmbed('You cannot use this command in non-servers')],
        ephemeral: true,
      });

    log(
      'INFO',
      `Server ID ${interaction.guild.id}: User ID ${interaction.user.id} ran command ${interaction.commandName}`
    );

    const row =
      new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
        new ButtonBuilder()
          .setLabel(`${interaction.guild.name}'s Leaderboard`)
          .setStyle(ButtonStyle.Link)
          .setURL(
            `https://space-bear.vercel.app/leaderboard/${interaction.guild.id}`
          )
      );

    return interaction.reply({
      content: 'Here you go!',
      components: [row],
      ephemeral: true,
    });
  }
}
