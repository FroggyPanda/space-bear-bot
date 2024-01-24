import {
  ApplicationCommandOptionType,
  type CategoryChannelResolvable,
  ChannelType,
  ChatInputCommandInteraction,
  EmbedBuilder,
  InteractionResponse,
  Message,
  Role,
  TextChannel,
  VoiceChannel,
} from 'discord.js';
import { Discord, Slash, SlashGroup, SlashOption } from 'discordx';
import {
  RedEmbed,
  GreenEmbed,
  YellowEmbed,
  BlueEmbed,
} from '../components/embeds.js';
import { getGuild, setGuild, isMod, modLog, log } from '../lib/index.js';

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

    log(
      'INFO',
      `Server ID ${interaction.guild.id}: User ID ${interaction.user.id} ran command ${interaction.commandName}`
    );

    const guild = await getGuild(interaction.guild.id);

    if (!(await isMod(interaction, guild)))
      return interaction.editReply({
        embeds: [RedEmbed('You are not a mod.')],
      });

    guild.mod_id = role.id;

    setGuild(interaction.guild.id, guild);

    modLog(
      BlueEmbed(`<@${interaction.user.id}> set the moderation role to ${role}`),
      interaction,
      guild
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

    log(
      'INFO',
      `Server ID ${interaction.guild.id}: User ID ${interaction.user.id} ran command ${interaction.commandName}`
    );

    const guild = await getGuild(interaction.guild.id);

    if (!(await isMod(interaction, guild)))
      return interaction.editReply({
        embeds: [RedEmbed('You are not a mod.')],
      });

    guild.mod_log_channel = channel.id;

    setGuild(interaction.guild.id, guild);

    modLog(
      BlueEmbed(
        `${interaction.user} set the moderation logs channel to ${channel}`
      ),
      interaction,
      guild
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

    log(
      'INFO',
      `Server ID ${interaction.guild.id}: User ID ${interaction.user.id} ran command ${interaction.commandName}`
    );

    const guild = await getGuild(interaction.guild.id);

    if (!(await isMod(interaction, guild)))
      return interaction.editReply({
        embeds: [RedEmbed('You are not a mod.')],
      });

    if (guild.level_message_channels.find((v) => v === channel.id))
      return interaction.editReply({
        embeds: [YellowEmbed('Channel is already added')],
      });

    guild.level_message_channels.push(channel.id);

    setGuild(interaction.guild.id, guild);

    modLog(
      BlueEmbed(
        `${interaction.user} added ${channel} to the possible channels members can level up from`
      ),
      interaction,
      guild
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

    log(
      'INFO',
      `Server ID ${interaction.guild.id}: User ID ${interaction.user.id} ran command ${interaction.commandName}`
    );

    const guild = await getGuild(interaction.guild.id);

    if (!(await isMod(interaction, guild)))
      return interaction.editReply({
        embeds: [RedEmbed('You are not a mod.')],
      });

    guild.level_message_channels = guild.level_message_channels.filter(
      (v) => v !== channel.id
    );

    setGuild(interaction.guild.id, guild);

    modLog(
      BlueEmbed(
        `${interaction.user} removed ${channel} to the possible channels members can level up from`
      ),
      interaction,
      guild
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

    const guild = await getGuild(interaction.guild.id);

    if (!(await isMod(interaction, guild)))
      return interaction.editReply({
        embeds: [RedEmbed('You are not a mod.')],
      });

    if (guild.level_message_channels.length < 1)
      return interaction.editReply({
        embeds: [RedEmbed('There are no channels')],
      });

    const channels = guild.level_message_channels
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

    log(
      'INFO',
      `Server ID ${interaction.guild.id}: User ID ${interaction.user.id} ran command ${interaction.commandName}`
    );

    const guild = await getGuild(interaction.guild.id);

    if (!(await isMod(interaction, guild)))
      return interaction.editReply({
        embeds: [RedEmbed('You are not a mod.')],
      });

    guild.level_message_channel = channel.id;

    setGuild(interaction.guild.id, guild);

    modLog(
      BlueEmbed(
        `${interaction.user} set the level message log channel to ${channel}`
      ),
      interaction,
      guild
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

    log(
      'INFO',
      `Server ID ${interaction.guild.id}: User ID ${interaction.user.id} ran command ${interaction.commandName}`
    );

    const guild = await getGuild(interaction.guild.id);

    if (!(await isMod(interaction, guild)))
      return interaction.reply({
        embeds: [RedEmbed('You are not a mod.')],
        ephemeral: true,
      });

    if (guild.level_ranks.find((v) => v.role_id === role.id)) {
      return interaction.reply({
        embeds: [YellowEmbed('Role is already added')],
        ephemeral: true,
      });
    }
    guild.level_ranks.push({ role_id: role.id, level: level });

    setGuild(interaction.guild.id, guild);

    modLog(
      BlueEmbed(
        `${interaction.user} set ${role} to be gained at level \`${level}\``
      ),
      interaction,
      guild
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

    log(
      'INFO',
      `Server ID ${interaction.guild.id}: User ID ${interaction.user.id} ran command ${interaction.commandName}`
    );

    const guild = await getGuild(interaction.guild.id);

    if (!(await isMod(interaction, guild)))
      return interaction.editReply({
        embeds: [RedEmbed('You are not a mod.')],
      });

    const old = guild.level_ranks;
    guild.level_ranks = guild.level_ranks.filter((v) => v.role_id !== role.id);

    if (JSON.stringify(old) === JSON.stringify(guild.level_ranks))
      return interaction.editReply({
        embeds: [YellowEmbed('Role not found in list')],
      });

    setGuild(interaction.guild.id, guild);

    modLog(
      BlueEmbed(
        `${interaction.user} removed ${role} to be gained as a message level reward`
      ),
      interaction,
      guild
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

    log(
      'INFO',
      `Server ID ${interaction.guild.id}: User ID ${interaction.user.id} ran command ${interaction.commandName}`
    );

    const guild = await getGuild(interaction.guild.id);

    if (!isMod(interaction, guild))
      return interaction.editReply({
        embeds: [RedEmbed('You are not a mod.')],
      });

    if (guild.level_ranks.length < 1)
      return interaction.editReply({
        embeds: [RedEmbed('There are no roles')],
      });

    const ranks = guild.level_ranks
      .map((v) => `<@&${v.role_id}> at level ${v.level}`)
      .join('\n');

    const embed = new EmbedBuilder().setTitle('Ranks:').setDescription(ranks);

    return interaction.editReply({ embeds: [embed] });
  }

  @Slash({
    name: 'temporary',
    description: 'Where do temporary voice channels get placed',
  })
  @SlashGroup('config')
  async temporary(
    @SlashOption({
      name: 'category',
      description:
        'ID of the category to place the channels (right click the channel and select copy id)',
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    categoryId: string,
    interaction: ChatInputCommandInteraction
  ) {
    await interaction.deferReply({ ephemeral: true });

    if (!interaction.guild)
      return interaction.editReply({
        embeds: [RedEmbed('You cannot use this command in non-servers')],
      });

    log(
      'INFO',
      `Server ID ${interaction.guild.id}: User ID ${interaction.user.id} ran command ${interaction.commandName}`
    );

    try {
      const channel = await interaction.guild.channels.create({
        name: 'temp',
        type: ChannelType.GuildVoice,
        parent: categoryId as CategoryChannelResolvable,
      });

      (channel as VoiceChannel).delete();

      const guild = await getGuild(interaction.guild.id);
      guild.temporary_channel_category = categoryId;

      const category = await interaction.guild.channels.fetch(categoryId);

      setGuild(interaction.guild.id, guild);
      modLog(
        BlueEmbed(
          `Temporary channel categories have been set to ${category?.name}`
        ),
        interaction,
        guild
      );

      return interaction.editReply({
        embeds: [GreenEmbed(`Temporary channel category set up`)],
      });
    } catch (error) {
      return interaction.editReply({
        embeds: [RedEmbed(`Invalid category ID`)],
      });
    }
  }
}
