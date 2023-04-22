import { Member, Server } from 'schema';

export function assertMember(value: unknown): asserts value is Member {
  if (
    !(
      typeof value === 'object' &&
      value !== null &&
      'id' in value &&
      typeof value.id === 'number' &&
      'last_message_timestamp' in value &&
      typeof value.last_message_timestamp === 'number' &&
      'last_pat_timestamp' in value &&
      typeof value.last_pat_timestamp === 'number' &&
      'level' in value &&
      typeof value.level === 'number' &&
      'member_id' in value &&
      typeof value.member_id === 'string' &&
      'message' in value &&
      typeof value.message === 'number' &&
      'pat' in value &&
      typeof value.pat === 'number' &&
      'server_id' in value &&
      typeof value.server_id === 'string' &&
      'xp' in value &&
      typeof value.xp === 'number'
    )
  )
    throw new Error(`value is not a member: ${value}`);
}

export function assertServer(value: unknown): asserts value is Server {
  if (
    !(
      typeof value === 'object' &&
      value !== null &&
      'id' in value &&
      typeof value.id === 'number' &&
      'level_message_channel' in value &&
      (value.level_message_channel === null ||
        typeof value.level_message_channel === 'string') &&
      'level_message_channels' in value &&
      Array.isArray(value.level_message_channels) &&
      'id' in value &&
      value.level_message_channels.every(
        (channel) => typeof channel === 'string'
      ) &&
      'level_ranks' in value &&
      Array.isArray(value.level_ranks) &&
      value.level_ranks.every(
        (rank) =>
          typeof rank.level === 'number' && typeof rank.role_id === 'string'
      ) &&
      'mod_id' in value &&
      (value.mod_id === null || typeof value.mod_id === 'string') &&
      'mod_log_channel' in value &&
      (value.mod_log_channel === null ||
        typeof value.mod_log_channel === 'string') &&
      'pat' in value &&
      typeof value.pat === 'number' &&
      'server_id' in value &&
      typeof value.server_id === 'string'
    )
  )
    throw new Error(`Value is not a server: ${value}`);
}
