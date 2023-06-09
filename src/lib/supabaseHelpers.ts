import { Member, Guild } from '../schema.js';
import { supabase } from '../main.js';
import { log } from '../lib/index.js';

export async function getMember(
  guild_id: string,
  member_id: string
): Promise<Member> {
  const result = await supabase
    .from('member')
    .select()
    .eq('guild_id', guild_id)
    .eq('member_id', member_id)
    .limit(1);

  if (result.error) {
    log(
      'ERROR',
      `Error fetching member from Supabase:\n${JSON.stringify(result, null, 4)}`
    );

    throw new Error(
      `Error fetching member from Supabase:\n${JSON.stringify(result, null, 4)}`
    );
  }

  if (result.data.length < 1) {
    const newMember = await supabase
      .from('member')
      .insert({ guild_id: guild_id, member_id: member_id })
      .select();

    if (newMember.error) {
      log(
        'ERROR',
        `Error inserting memeber from Supabase:\n${JSON.stringify(
          newMember,
          null,
          4
        )}`
      );

      throw new Error(
        `Error inserting memeber from Supabase:\n${JSON.stringify(
          newMember,
          null,
          4
        )}`
      );
    }

    return newMember.data[0];
  }

  return result.data[0];
}

export async function getGuild(guild_id: string): Promise<Guild> {
  const result = await supabase
    .from('guild')
    .select()
    .eq('guild_id', guild_id)
    .limit(1);

  if (result.error) {
    log(
      'ERROR',
      `Error fetching guild from Supabase:\n${JSON.stringify(result, null, 4)}`
    );

    throw new Error(
      `Error fetching guild from Supabase:\n${JSON.stringify(result, null, 4)}`
    );
  }

  if (result.data.length < 1) {
    const newGuild = await supabase
      .from('guild')
      .insert({ guild_id: guild_id })
      .select();

    if (newGuild.error) {
      log(
        'ERROR',
        `Error inserting guild from Supabase:\n${JSON.stringify(
          newGuild,
          null,
          4
        )}`
      );

      throw new Error(
        `Error inserting guild from Supabase:\n${JSON.stringify(
          newGuild,
          null,
          4
        )}`
      );
    }

    return newGuild.data[0];
  }

  return result.data[0];
}

export async function setMember(
  guild_id: string,
  member_id: string,
  data: Member
) {
  const update = await supabase
    .from('member')
    .update(data)
    .eq('guild_id', guild_id)
    .eq('member_id', member_id);

  if (update.error) {
    log(
      'ERROR',
      `Error updating Member in Supabase:\n${JSON.stringify(update, null, 4)}`
    );

    throw new Error(
      `Error updating Member in Supabase:\n${JSON.stringify(update, null, 4)}`
    );
  }
}

export async function setGuild(guild_id: string, data: Guild) {
  const update = await supabase
    .from('guild')
    .update(data)
    .eq('guild_id', guild_id);

  if (update.error) {
    log(
      'ERROR',
      `Error updating guild in Supabase:\n${JSON.stringify(update, null, 4)}`
    );

    throw new Error(
      `Error updating guild in Supabase:\n${JSON.stringify(update, null, 4)}`
    );
  }
}
