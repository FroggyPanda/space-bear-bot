import { RedEmbed, GreenEmbed, BlueEmbed } from '../components/embeds.js';
import {
  APIEmbedField,
  ApplicationCommandOptionType,
  Client,
  ChatInputCommandInteraction,
  EmbedBuilder,
  GuildMember,
  Message,
} from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';
import { supabase } from '../main.js';
import { getServer, isMod, modLog } from '../lib/index.js';

@Discord()
export class Warn {
  @Slash({ name: 'warn', description: 'Warn a user' })
  async warn(
    @SlashOption({
      name: 'user',
      description: 'User Search',
      required: true,
      type: ApplicationCommandOptionType.User,
    })
    user: GuildMember,
    @SlashOption({
      name: 'reason',
      description: 'Reason for warn',
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    reason: string,
    interaction: ChatInputCommandInteraction,
    client: Client
  ): Promise<Message<boolean>> {
    await interaction.deferReply({ ephemeral: true });

    if (!interaction.guild)
      return interaction.editReply({
        embeds: [RedEmbed('You cannot use this command in non-servers')],
      });

    const server = await getServer(interaction.guild.id);

    if (!(await isMod(interaction, server)))
      return interaction.editReply({
        embeds: [RedEmbed('You are not a mod.')],
      });

    const thisWarn = await supabase
      .from('warning')
      .insert({
        member_id: user.user.id,
        server_id: interaction.guild.id,
        mod_id: interaction.user.id,
        timestamp: interaction.createdTimestamp,
        reason: reason,
      })
      .select();

    if (thisWarn.error) {
      console.error('thisWarn:\n', thisWarn.error);
      return interaction.editReply({
        embeds: [RedEmbed('A server error has occurred.')],
      });
    }

    const embed = new EmbedBuilder()
      .setColor('#ff6b6b')
      .setDescription(
        `You were warned in ${interaction.guild.name} for ${reason}`
      );

    client.users.send(user.user.id, { embeds: [embed] });

    modLog(
      BlueEmbed({
        description: `${interaction.user} warned ${user}\nReason: ${reason}`,
        footer: { text: `id: ${thisWarn.data[0].id}` },
      }),
      interaction,
      server
    );

    return interaction.editReply({
      embeds: [
        GreenEmbed(
          `**${user.user.username}#${user.user.discriminator} has been warned**`
        ),
      ],
    });
  }

  @Slash({ name: 'warnings', description: 'Get all warnings of a user' })
  async warnings(
    @SlashOption({
      name: 'user',
      description: 'User Search',
      required: true,
      type: ApplicationCommandOptionType.User,
    })
    user: GuildMember,
    interaction: ChatInputCommandInteraction
  ): Promise<Message<boolean>> {
    await interaction.deferReply({ ephemeral: true });

    if (!interaction.guild)
      return interaction.editReply({
        embeds: [RedEmbed('You cannot use this command in non-servers')],
      });

    const server = await getServer(interaction.guild.id);

    if (!(await isMod(interaction, server)))
      return interaction.editReply({
        embeds: [RedEmbed('You are not a mod.')],
      });

    const thisWarns = await supabase
      .from('warning')
      .select()
      .eq('member_id', user.user.id)
      .eq('server_id', interaction.guild.id);

    if (thisWarns.error) {
      console.error('warns.ts 87 thisWarns.error:\n', thisWarns.error);
      return interaction.editReply({
        embeds: [RedEmbed('An error has occurred')],
      });
    }

    if (thisWarns.data.length < 1)
      return interaction.editReply({
        embeds: [RedEmbed('There are no warnings')],
      });

    const fields: APIEmbedField[] = [];

    thisWarns.data.forEach(async (v) => {
      const mod = await interaction.client.users.fetch(v.mod_id);

      const date = new Date(v.timestamp);
      const day = date.getDate();
      const month = date.toLocaleString('default', { month: 'short' });
      const year = date.getFullYear();

      fields.push({
        name: `**ID: ${v.id} | Moderator: ${mod.username}#${mod.discriminator}**`,
        value: `${v.reason} - ${month} ${day} ${year}`,
      });
    });

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${thisWarns.data.length} ${
          thisWarns.data.length > 1 ? 'Warnings' : 'Warning'
        } for ${user.user.username}#${user.user.discriminator} (${
          user.user.id
        })`,
        iconURL: user.displayAvatarURL(),
      })
      .addFields(fields)
      .setColor('#ff6b6b');

    return interaction.editReply({ embeds: [embed] });
  }

  @Slash({
    name: 'warning-delete',
    description: 'Delete a warning from a user',
  })
  async delwarning(
    @SlashOption({
      name: 'warning-id',
      description: 'Warning ID from a user',
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    warningID: string,
    interaction: ChatInputCommandInteraction
  ): Promise<Message<boolean>> {
    await interaction.deferReply({ ephemeral: true });

    if (!interaction.guild)
      return interaction.editReply({
        embeds: [RedEmbed('You cannot use this command in non-servers')],
      });

    const server = await getServer(interaction.guild.id);

    if (!(await isMod(interaction, server)))
      return interaction.editReply({
        embeds: [RedEmbed('You are not a mod.')],
      });

    const del = await supabase
      .from('warning')
      .delete()
      .eq('id', warningID)
      .select();

    if (del.error) {
      console.error('warns.ts 153 del.error:\n', del.error);
      return interaction.editReply({
        embeds: [RedEmbed('An error has occurred')],
      });
    }

    if (del.data.length < 1)
      return interaction.editReply({
        embeds: [RedEmbed('Invalid warning ID')],
      });

    const user = await interaction.client.users.fetch(del.data[0].member_id);

    modLog(
      BlueEmbed({
        description: `${interaction.user} deleted a warn off of ${user}\nWarn Reason: ${del.data[0].reason}`,
        footer: { text: `id: ${del.data[0].id}` },
      }),
      interaction,
      server
    );

    return interaction.editReply({
      embeds: [
        GreenEmbed(
          `Deleted warning \`${warningID}\` for ${user.username}#${user.discriminator}`
        ),
      ],
    });
  }

  @Slash({
    name: 'warning-clear',
    description: 'Clear all warnings from a user',
  })
  async clearwarnings(
    @SlashOption({
      name: 'user',
      description: 'User Search',
      required: true,
      type: ApplicationCommandOptionType.User,
    })
    user: GuildMember,
    interaction: ChatInputCommandInteraction
  ): Promise<Message<boolean>> {
    await interaction.deferReply({ ephemeral: true });

    if (!interaction.guild)
      return interaction.editReply({
        embeds: [RedEmbed('You cannot use this command in non-servers')],
      });

    const server = await getServer(interaction.guild.id);

    if (!(await isMod(interaction, server)))
      return interaction.editReply({
        embeds: [RedEmbed('You are not a mod.')],
      });

    const thisWarns = await supabase
      .from('warning')
      .delete()
      .eq('member_id', user.user.id)
      .eq('server_id', interaction.guild.id)
      .select();

    if (thisWarns.error) {
      console.error('warns.ts 202 thisWarns:\n', thisWarns.error);
      return interaction.editReply({
        embeds: [RedEmbed('An error has occurred')],
      });
    }

    if (thisWarns.data.length < 1) {
      return interaction.editReply({
        embeds: [
          RedEmbed(
            `No warnings found for ${user.user.username}#${user.user.discriminator}`
          ),
        ],
      });
    }

    modLog(
      BlueEmbed(`${interaction.user} cleared all of ${user}s warnings`),
      interaction,
      server
    );

    return interaction.editReply({
      embeds: [
        GreenEmbed(
          `Cleared ${thisWarns.data.length} ${
            thisWarns.data.length > 1 ? 'warnings' : 'warning'
          } for ${user.user.username}#${user.user.discriminator}`
        ),
      ],
    });
  }
}
