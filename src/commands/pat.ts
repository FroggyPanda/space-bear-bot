import {
  Pagination,
  PaginationResolver,
  PaginationType,
  Resolver,
} from '@discordx/pagination';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { supabase } from '../main.js';
import {
  getMember,
  getGuild,
  setMember,
  setGuild,
} from '../lib/supabaseHelpers.js';
import { Discord, Slash } from 'discordx';
import { RedEmbed, YellowEmbed } from '../components/embeds.js';

@Discord()
export class Pat {
  async makePages(
    interaction: ChatInputCommandInteraction,
    embed: EmbedBuilder
  ): Promise<Pagination<PaginationResolver<Resolver>> | null> {
    if (!interaction.guild) return null;

    const users = await supabase
      .from('member')
      .select()
      .eq('guild_id', interaction.guild.id)
      .gte('pat', 1);

    if (users.error) {
      console.error('pat.ts 38 users.error:\n', users.error);
      return null;
    }

    const sorted = users.data.sort((a, b) => b.pat - a.pat);

    const pages: {
      embeds: EmbedBuilder[];
    }[] = [];

    const pageSize = 10;

    for (let i = 0; i < sorted.length; i += pageSize) {
      const pageUsers = sorted.slice(i, i + pageSize);

      const pageDescriptionArray = await Promise.all(
        pageUsers.map(async (v, j) => {
          const user = await interaction.client.users.fetch(v.member_id);

          return `${
            i + j + 1 === 1
              ? '🥇 '
              : i + j + 1 === 2
              ? '🥈 '
              : i + j + 1 === 3
              ? '🥉 '
              : `\`${i + j + 1}\`: `
          }${user} - ${v.pat}`;
        })
      );

      const pageDescription = pageDescriptionArray.join('\n');

      const page = new EmbedBuilder()
        .setTitle('Leaderboard')
        .setDescription(pageDescription);

      pages.push({ embeds: [page] });
    }

    pages.unshift({ embeds: [embed] });

    return new Pagination(interaction, pages, {
      type: PaginationType.Button,
      showStartEnd: false,
      ephemeral: true,
    });
  }

  @Slash({ name: 'pat', description: 'Pat Space Bear!' })
  async send(interaction: ChatInputCommandInteraction): Promise<unknown> {
    await interaction.deferReply({ ephemeral: true });

    if (!interaction.guild)
      return interaction.editReply({
        embeds: [RedEmbed('You cannot use this command in non-servers')],
      });

    const member = await getMember(interaction.guild.id, interaction.user.id);
    const guild = await getGuild(interaction.guild.id);

    if (
      interaction.createdTimestamp <
      member.last_pat_timestamp + 24 * 60 * 60 * 1000
    ) {
      const pagination = await this.makePages(
        interaction,
        YellowEmbed(
          `You've already pat Space Bear today. You can pat Space Bear again on <t:${Math.floor(
            (member.last_pat_timestamp + 24 * 60 * 60 * 1000) / 1000
          )}:F>`
        )
      );

      if (!pagination)
        return interaction.reply({
          embeds: [RedEmbed('An error has occurred')],
          ephemeral: true,
        });

      return await pagination.send();
    }

    member.pat++;
    guild.pat++;
    member.last_pat_timestamp = interaction.createdTimestamp;

    setMember(interaction.guild.id, interaction.user.id, member);
    setGuild(interaction.guild.id, guild);

    const embed = new EmbedBuilder()
      .setTitle('He is very happy')
      .setDescription(
        `You have pat Space Bear ${member.pat} ${
          member.pat > 1 ? 'times' : 'time'
        }
        \n${interaction.guild.name} has pat Space Bear ${guild.pat} ${
          guild.pat > 1 ? 'times' : 'time'
        }
        \nYou can pat Space Bear again on <t:${Math.floor(
          (interaction.createdTimestamp + 24 * 60 * 60 * 1000) / 1000
        )}:F>`
      )
      .setImage('https://media.tenor.com/KyGPQuYCdYkAAAAC/pat-garrys-mod.gif');

    const pagination = await this.makePages(interaction, embed);

    if (!pagination)
      return interaction.reply({
        embeds: [RedEmbed('An error has occurred')],
        ephemeral: true,
      });

    return await pagination.send();
  }
}
