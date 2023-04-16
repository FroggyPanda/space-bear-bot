import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  InteractionResponse,
  Message,
  Role,
  TextChannel,
} from 'discord.js';
import { Discord, Slash, SlashGroup, SlashOption } from 'discordx';
import {
  RedEmbed,
  GreenEmbed,
  YellowEmbed,
  BlueEmbed,
} from '../components/embeds.js';
import { getServer, setServer, isMod, modLog } from '../lib/index.js';

@Discord()
@SlashGroup({ name: 'config', description: 'Config for the bot' })
@SlashGroup({
  name: 'level-message',
  description: 'Config for the level messages',
  root: 'config',
})
export class Config {
  @Slash({ name: 'mod-role', description: 'Set the moderation role' })
  @SlashGroup('config')
  async modRole(
    @SlashOption({
      name: 'role',
      description: 'Role Search',
      required: true,
      type: ApplicationCommandOptionType.Role,
    })
    role: Role,
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

    server.mod_id = role.id;

    setServer(interaction.guild.id, server);

    modLog(
      BlueEmbed(`<@${interaction.user.id}> set the moderation role to ${role}`),
      interaction,
      server
    );

    return interaction.editReply({
      embeds: [
        GreenEmbed(`Users with the ${role} now have moderator permissions`),
      ],
    });
  }

  @Slash({
    name: 'mod-logs',
    description: 'Logs channel for moderation commands',
  })
  @SlashGroup('config')
  async modLogs(
    @SlashOption({
      name: 'channel',
      description: 'Channel Search',
      required: true,
      type: ApplicationCommandOptionType.Channel,
    })
    channel: TextChannel,
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

    server.mod_log_channel = channel.id;

    setServer(interaction.guild.id, server);

    modLog(
      BlueEmbed(
        `${interaction.user} set the moderation logs channel to ${channel}`
      ),
      interaction,
      server
    );

    return interaction.editReply({
      embeds: [GreenEmbed(`Set the logs channel to ${channel}`)],
    });
  }

  @Slash({
    name: 'add-channel',
    description: 'Add a channel that members can level up in',
  })
  @SlashGroup('level-message', 'config')
  async levelMessageAddChannel(
    @SlashOption({
      name: 'channel',
      description: 'Channel Search',
      required: true,
      type: ApplicationCommandOptionType.Channel,
    })
    channel: TextChannel,
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

    if (server.level_message_channels.find((v) => v === channel.id))
      return interaction.editReply({
        embeds: [YellowEmbed('Channel is already added')],
      });

    server.level_message_channels.push(channel.id);

    setServer(interaction.guild.id, server);

    modLog(
      BlueEmbed(
        `${interaction.user} added ${channel} to the possible channels members can level up from`
      ),
      interaction,
      server
    );

    return interaction.editReply({
      embeds: [GreenEmbed(`Added ${channel} to the list`)],
    });
  }

  @Slash({
    name: 'remove-channel',
    description: 'Remove a channel that members can level up in',
  })
  @SlashGroup('level-message', 'config')
  async levelMessageRemoveChannel(
    @SlashOption({
      name: 'channel',
      description: 'Channel Search',
      required: true,
      type: ApplicationCommandOptionType.Channel,
    })
    channel: TextChannel,
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

    server.level_message_channels = server.level_message_channels.filter(
      (v) => v !== channel.id
    );

    setServer(interaction.guild.id, server);

    modLog(
      BlueEmbed(
        `${interaction.user} removed ${channel} to the possible channels members can level up from`
      ),
      interaction,
      server
    );

    return interaction.editReply({
      embeds: [GreenEmbed(`Removed ${channel.id} from the list`)],
    });
  }

  @Slash({
    name: 'list-channels',
    description: 'List out the channels a member can level up from',
  })
  @SlashGroup('level-message', 'config')
  async levelMessageListChannels(
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

    if (server.level_message_channels.length < 1)
      return interaction.editReply({
        embeds: [RedEmbed('There are no channels')],
      });

    const channels = server.level_message_channels
      .map((v) => `<#${v}>`)
      .join('\n');

    const embed = new EmbedBuilder()
      .setTitle('Channels:')
      .setDescription(channels);

    return interaction.editReply({
      embeds: [embed],
    });
  }

  @Slash({
    name: 'set-channel',
    description: 'Set the channel the level up messages will be sent',
  })
  @SlashGroup('level-message', 'config')
  async levelMessageSetChannel(
    @SlashOption({
      name: 'channel',
      description: 'Channel search',
      required: true,
      type: ApplicationCommandOptionType.Channel,
    })
    channel: TextChannel,
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

    server.level_message_channel = channel.id;

    setServer(interaction.guild.id, server);

    modLog(
      BlueEmbed(
        `${interaction.user} set the level message log channel to ${channel}`
      ),
      interaction,
      server
    );

    return interaction.editReply({
      embeds: [GreenEmbed(`Set level messages to go to <\#${channel.id}>`)],
    });
  }

  @Slash({
    name: 'add-role',
    description: 'Add a role reward for the selected level',
  })
  @SlashGroup('level-message', 'config')
  async levelMessageAddRole(
    @SlashOption({
      name: 'role',
      description: 'Role Search',
      required: true,
      type: ApplicationCommandOptionType.Role,
    })
    role: Role,
    @SlashOption({
      name: 'level',
      description: 'Level you want the role to be gained on',
      required: true,
      type: ApplicationCommandOptionType.Number,
    })
    level: number,
    interaction: ChatInputCommandInteraction
  ): Promise<InteractionResponse<boolean>> {
    if (!interaction.guild)
      return interaction.reply({
        embeds: [RedEmbed('You cannot use this command in non-servers')],
        ephemeral: true,
      });

    const server = await getServer(interaction.guild.id);

    if (!(await isMod(interaction, server)))
      return interaction.reply({
        embeds: [RedEmbed('You are not a mod.')],
        ephemeral: true,
      });

    if (server.level_ranks.find((v) => v.role_id === role.id)) {
      return interaction.reply({
        embeds: [YellowEmbed('Role is already added')],
        ephemeral: true,
      });
    }
    server.level_ranks.push({ role_id: role.id, level: level });

    setServer(interaction.guild.id, server);

    modLog(
      BlueEmbed(
        `${interaction.user} set ${role} to be gained at level \`${level}\``
      ),
      interaction,
      server
    );

    return interaction.reply({
      embeds: [GreenEmbed(`Set ${role} to be gained at level \`${level}\``)],
      ephemeral: true,
    });
  }

  @Slash({
    name: 'remove-role',
    description: 'Remove a role reward for the selected level',
  })
  @SlashGroup('level-message', 'config')
  async levelMessageRemoveRole(
    @SlashOption({
      name: 'role',
      description: 'Role Search',
      required: true,
      type: ApplicationCommandOptionType.Role,
    })
    role: Role,
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

    const old = server.level_ranks;
    server.level_ranks = server.level_ranks.filter(
      (v) => v.role_id !== role.id
    );

    if (JSON.stringify(old) === JSON.stringify(server.level_ranks))
      return interaction.editReply({
        embeds: [YellowEmbed('Role not found in list')],
      });

    setServer(interaction.guild.id, server);

    modLog(
      BlueEmbed(
        `${interaction.user} removed ${role} to be gained as a message level reward`
      ),
      interaction,
      server
    );

    return interaction.editReply({
      embeds: [GreenEmbed(`Removed ${role} from the list of roles to gain`)],
    });
  }

  @Slash({
    name: 'list-roles',
    description: 'List the roles for each level',
  })
  @SlashGroup('level-message', 'config')
  async levelMessageListRoles(
    interaction: ChatInputCommandInteraction
  ): Promise<Message<boolean>> {
    await interaction.deferReply({ ephemeral: true });

    if (!interaction.guild)
      return interaction.editReply({
        embeds: [RedEmbed('You cannot use this command in non-servers')],
      });

    const server = await getServer(interaction.guild.id);

    if (!isMod(interaction, server))
      return interaction.editReply({
        embeds: [RedEmbed('You are not a mod.')],
      });

    if (server.level_ranks.length < 1)
      return interaction.editReply({
        embeds: [RedEmbed('There are no roles')],
      });

    const ranks = server.level_ranks
      .map((v) => `<@&${v.role_id}> at level ${v.level}`)
      .join('\n');

    const embed = new EmbedBuilder().setTitle('Ranks:').setDescription(ranks);

    return interaction.editReply({ embeds: [embed] });
  }
}
