import { ChatInputCommandInteraction } from 'discord.js';
import { Server } from 'schema';
import { userRoles } from './userRoles.js';

export async function isMod(
  interaction: ChatInputCommandInteraction,
  server: Server
): Promise<boolean> {
  const userRole = await userRoles(interaction);

  if (!userRole) return false;

  if (
    interaction.memberPermissions?.has('Administrator') ||
    interaction.memberPermissions?.has('ModerateMembers') ||
    interaction.memberPermissions?.has('KickMembers') ||
    interaction.memberPermissions?.has('BanMembers') ||
    interaction.memberPermissions?.has('MentionEveryone') ||
    interaction.memberPermissions?.has('MuteMembers') ||
    interaction.memberPermissions?.has('DeafenMembers') ||
    interaction.memberPermissions?.has('MoveMembers') ||
    interaction.memberPermissions?.has('ManageNicknames') ||
    interaction.memberPermissions?.has('ManageChannels') ||
    interaction.memberPermissions?.has('ManageEmojisAndStickers') ||
    interaction.memberPermissions?.has('ManageEvents') ||
    interaction.memberPermissions?.has('ManageGuild') ||
    interaction.memberPermissions?.has('ManageMessages') ||
    interaction.memberPermissions?.has('ManageRoles') ||
    interaction.memberPermissions?.has('ManageThreads') ||
    interaction.memberPermissions?.has('ManageWebhooks') ||
    userRole.find((v) => v === server.mod_id)
  )
    return true;

  return false;
}
