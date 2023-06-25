import { GreenEmbed, RedEmbed, BlueEmbed } from '../components/embeds.js';
import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  GuildMember,
  Message,
} from 'discord.js';
import { Discord, Slash, SlashOption } from 'discordx';

import { getGuild, userRoles, isMod, modLog } from '../lib/index.js';

@Discord()
export class Mute {
  @Slash({
    name: 'mute',
    description: 'Mute the specified user. Default is 28 Days',
  })
  async mute(
    @SlashOption({
      name: 'user',
      description: 'User Search',
      required: true,
      type: ApplicationCommandOptionType.User,
    })
    user: GuildMember,
    @SlashOption({
      name: 'reason',
      description: 'Reason for mute',
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    reason: string,
    @SlashOption({
      name: 'duration',
      description:
        'How long you want to mute the user for. Ex: 5s, 5m, 5hr, 5d, 5w. Max is 28 Days',
      required: false,
      type: ApplicationCommandOptionType.String,
    })
    duration: string,
    interaction: ChatInputCommandInteraction
  ): Promise<Message<boolean>> {
    await interaction.deferReply({ ephemeral: true });

    if (!interaction.guild)
      return interaction.editReply({
        embeds: [RedEmbed('You cannot use this command in non-servers')],
      });

    const guild = await getGuild(interaction.guild.id);

    if (!(await isMod(interaction, guild)))
      return interaction.editReply({
        embeds: [RedEmbed('You are not a mod.')],
      });

    if (
      user.permissions.has('Administrator') ||
      user.permissions.has('ModerateMembers') ||
      user.permissions.has('Administrator') ||
      user.permissions.has('MuteMembers')
    )
      return interaction.editReply({
        embeds: [RedEmbed('That user is a mod/admin.')],
      });

    const member = interaction.guild.members.cache.get(user.id);

    if (!member)
      return interaction.editReply({
        embeds: [RedEmbed('An error has occured')],
      });

    if (duration === undefined) {
      member.timeout(2.419e9);

      modLog(
        BlueEmbed(
          `${interaction.user} muted ${user} for 28d\nReason: ${reason}`
        ),
        interaction,
        guild
      );

      interaction.client.users.send(user.id, {
        embeds: [
          RedEmbed(
            `You have been muted in ${interaction.guild.name} for ${duration}\nReason: ${reason}`
          ),
        ],
      });

      return interaction.editReply({
        embeds: [
          GreenEmbed(
            `**${user.user.username}#${user.user.discriminator} was muted for 28 days**`
          ),
        ],
      });
    }

    const parts = duration.match(/(\d+|\D+)/g);

    if (!parts)
      return interaction.editReply({
        embeds: [RedEmbed('An error has occurred')],
      });

    if (Number.isNaN(parseInt(parts[0])))
      return interaction.editReply({
        embeds: [RedEmbed('An error has occurred')],
      });

    if (
      parts[1] !== 's' &&
      parts[1] !== 'm' &&
      parts[1] !== 'hr' &&
      parts[1] !== 'd' &&
      parts[1] !== 'w'
    )
      return interaction.editReply({
        embeds: [
          RedEmbed(
            'Could not determine time. Make sure your duration follows this format:\n1s\n1m\n1hr\n1d\n1w'
          ),
        ],
      });

    let multi = 2.419e9;

    if (parts[1] === 's') {
      multi = 1000;
    } else if (parts[1] === 'm') {
      multi = 60000;
    } else if (parts[1] === 'hr') {
      multi = 3.6e6;
    } else if (parts[1] === 'd') {
      multi = 8.64e7;
    } else if (parts[1] === 'w') {
      multi = 6.048e8;
    }

    member.timeout(parseInt(parts[0]) * multi);

    modLog(
      BlueEmbed(
        `${interaction.user} muted ${user} for ${duration}\nReason: ${reason}`
      ),
      interaction,
      guild
    );

    interaction.client.users.send(user.id, {
      embeds: [
        RedEmbed(
          `You have been muted in ${interaction.guild.name} for ${duration}\nReason: ${reason}`
        ),
      ],
    });

    return interaction.editReply({
      embeds: [
        GreenEmbed(
          `***${user.user.username}#${user.user.discriminator} was muted.***`
        ),
      ],
    });
  }

  @Slash({
    name: 'unmute',
    description: 'Unmute the specified user',
  })
  async unmute(
    @SlashOption({
      name: 'user',
      description: 'User Search',
      required: true,
      type: ApplicationCommandOptionType.User,
    })
    user: GuildMember,
    @SlashOption({
      name: 'reason',
      description: 'Reason for unmute',
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    reason: string,
    interaction: ChatInputCommandInteraction
  ): Promise<Message<boolean>> {
    await interaction.deferReply({ ephemeral: true });

    if (!interaction.guild)
      return interaction.editReply({
        embeds: [RedEmbed('You cannot use this command in non-servers')],
      });

    const guild = await getGuild(interaction.guild.id);
    const usersRoles = await userRoles(interaction);

    if (!usersRoles)
      return interaction.editReply({
        embeds: [RedEmbed('An error has occurred')],
      });

    const isMod = usersRoles.find((v) => v === guild.mod_id);

    if (isMod === undefined)
      return interaction.editReply({
        embeds: [RedEmbed('You are not a mod.')],
      });

    const member = interaction.guild.members.cache.get(user.id);

    if (!member)
      return interaction.editReply({
        embeds: [RedEmbed('An error has occurred')],
      });

    member.timeout(null);

    modLog(
      BlueEmbed(`${interaction.user} unmuted ${user}\nReason: ${reason}`),
      interaction,
      guild
    );

    return interaction.editReply({
      embeds: [GreenEmbed(`<@${user.id}> was unmuted`)],
    });
  }
}
