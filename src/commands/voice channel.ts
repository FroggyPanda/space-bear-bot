import {
  ApplicationCommandOptionType,
  ChannelType,
  ChatInputCommandInteraction,
  Message,
  PermissionsBitField,
  type GuildMember,
  type VoiceChannel,
  GuildChannel,
} from 'discord.js';
import { Discord, Slash, SlashGroup, SlashOption } from 'discordx';
import { RedEmbed, GreenEmbed } from '../components/embeds.js';
import { getGuild, log } from '../lib/index.js';

@Discord()
@SlashGroup({
  name: 'voice-channel',
  description: 'Create and lock temporary voice channels',
})
export class VoiceChannels {
  @Slash({ name: 'create', description: 'Create a temporary voice channel' })
  @SlashGroup('voice-channel')
  async create(
    @SlashOption({
      name: 'channel-name',
      description: 'Name of channel',
      required: true,
      type: ApplicationCommandOptionType.String,
    })
    channelName: string,
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

    try {
      let channelCache = interaction.guild?.channels.cache;

      for (const [_, channel] of channelCache) {
        if (channel.name.includes(Number(interaction.user.id).toString(36))) {
          return interaction.editReply({
            embeds: [RedEmbed('You already have a temporary voice channel')],
          });
        }
      }

      await interaction.guild.channels.create({
        name: channelName + ' | ' + Number(interaction.user.id).toString(36),
        type: ChannelType.GuildVoice,
        permissionOverwrites: [
          {
            id: interaction.guild.roles.everyone,
            deny: [PermissionsBitField.Flags.ViewChannel],
          },
          {
            id: interaction.user.id,
            allow: [PermissionsBitField.Flags.ViewChannel],
          },
        ],
        parent: (
          await getGuild(interaction.guild.id)
        ).temporary_channel_category,
      });
    } catch (error) {
      log('ERROR', `Error making temporary channel: ${JSON.stringify(error)}`);
    }

    return interaction.editReply({
      embeds: [GreenEmbed(`Created`)],
    });
  }

  @Slash({ name: 'delete', description: 'Delete a temporary voice channel' })
  @SlashGroup('voice-channel')
  async delete(
    @SlashOption({
      name: 'channel',
      description: 'Channel to delete',
      required: true,
      type: ApplicationCommandOptionType.Channel,
    })
    channel: GuildChannel,
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

    try {
      if (channel.name.includes(Number(interaction.user.id).toString(36)))
        channel.delete();
      else
        return interaction.editReply({
          embeds: [
            RedEmbed(
              `This is not a channel you created.  Please select a channel you created`
            ),
          ],
        });
    } catch (error) {
      log(
        'ERROR',
        `Error deleting temporary channel: ${JSON.stringify(error)}`
      );
    }

    return interaction.editReply({
      embeds: [GreenEmbed(`Deleted`)],
    });
  }

  @Slash({ name: 'add', description: 'Add user to temporary voice channel' })
  @SlashGroup('voice-channel')
  async add(
    @SlashOption({
      name: 'channel',
      description: 'channel to edit',
      required: true,
      type: ApplicationCommandOptionType.Channel,
    })
    channel: VoiceChannel,
    @SlashOption({
      name: 'name',
      description: 'user to add to temporary voice channel',
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

    log(
      'INFO',
      `Server ID ${interaction.guild.id}: User ID ${interaction.user.id} ran command ${interaction.commandName}`
    );

    try {
      channel.permissionOverwrites.create(user, { ViewChannel: true });
    } catch (error) {
      log(
        'ERROR',
        `Error adding user to temporary channel: ${JSON.stringify(error)}`
      );
    }

    return interaction.editReply({
      embeds: [GreenEmbed(`Added User`)],
    });
  }

  @Slash({
    name: 'remove',
    description: 'Remove user to temporary voice channel',
  })
  @SlashGroup('voice-channel')
  async remove(
    @SlashOption({
      name: 'channel',
      description: 'channel to edit',
      required: true,
      type: ApplicationCommandOptionType.Channel,
    })
    channel: VoiceChannel,
    @SlashOption({
      name: 'name',
      description: 'user to remove from temporary voice channel',
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

    log(
      'INFO',
      `Server ID ${interaction.guild.id}: User ID ${interaction.user.id} ran command ${interaction.commandName}`
    );

    try {
      channel.permissionOverwrites.create(user, { ViewChannel: false });
    } catch (error) {
      log(
        'ERROR',
        `Error removing user from temporary channel: ${JSON.stringify(error)}`
      );
    }

    return interaction.editReply({
      embeds: [GreenEmbed(`Added User`)],
    });
  }
}
