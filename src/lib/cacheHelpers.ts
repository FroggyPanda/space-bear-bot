import { Member, Server } from '../schema.js';
import { cache, supabase } from '../main.js';

export async function getMember(
  guild_id: string,
  member_id: string
): Promise<Member> {
  const cacheResult = cache.get<Member>(`member:${guild_id}-${member_id}`);

  if (cacheResult) {
    console.log('📦🔽 Member');
    return cacheResult;
  }

  const result = await supabase
    .from('member')
    .select()
    .eq('server_id', guild_id)
    .eq('member_id', member_id)
    .limit(1);

  if (result.error)
    throw new Error(`Error fetching member from Supabase:\n ${result}`);

  if (result.data.length < 1) {
    const newMember = await supabase
      .from('member')
      .insert({ server_id: guild_id, member_id: member_id })
      .select();

    if (newMember.error)
      throw new Error(`Error inserting memeber from Supabase:\n ${newMember}`);

    console.log('⚡🔽 Making new Member');

    cache.set(`member:${guild_id}-${member_id}`, newMember.data[0]);
    return newMember.data[0];
  }

  console.log('⚡🔽 Member');

  cache.set(`member:${guild_id}-${member_id}`, result.data[0]);
  return result.data[0];
}

export async function getServer(guild_id: string): Promise<Server> {
  const cacheResult = cache.get<Server>(`server:${guild_id}`);

  if (cacheResult) {
    console.log('📦🔽 Server');
    return cacheResult;
  }

  const result = await supabase
    .from('server')
    .select()
    .eq('server_id', guild_id)
    .limit(1);

  if (result.error)
    throw new Error(`Error fetching server from Supabase:\n ${result}`);

  if (result.data.length < 1) {
    const newServer = await supabase
      .from('server')
      .insert({ server_id: guild_id })
      .select();

    if (newServer.error)
      throw new Error(`Error inserting server from Supabase:\n ${newServer}`);

    console.log('⚡🔽 Making new Server');

    cache.set(`server:${guild_id}`, newServer.data[0]);
    return newServer.data[0];
  }

  console.log('⚡🔽 Server');

  cache.set(`server:${guild_id}`, result.data[0]);
  return result.data[0];
}

export async function setMember(
  guild_id: string,
  member_id: string,
  data: Member
) {
  // const update = await supabase
  //   .from('member')
  //   .update(data)
  //   .eq('server_id', guild_id)
  //   .eq('member_id', member_id);

  // if (update.error)
  //   throw new Error(`Error updating Member in Supabase:\n ${update}`);

  console.log('📦🔼 Member');
  cache.set(`member:${guild_id}-${member_id}`, data);
}

export async function setServer(guild_id: string, data: Server) {
  // const update = await supabase
  //   .from('server')
  //   .update(data)
  //   .eq('server_id', guild_id);

  // if (update.error)
  //   throw new Error(`Error updating Server in Supabase:\n ${update}`);

  console.log('📦🔼 Server');
  cache.set(`server:${guild_id}`, data);
}
