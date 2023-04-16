import { Message, TextChannel } from 'discord.js';
import type { ArgsOf } from 'discordx';
import { Discord, On } from 'discordx';
import { Member } from '../schema.js';
import { getMember, getServer, setMember } from '../lib/cacheHelpers.js';

const setXpAndLevel = (member: Member) => {
  let xp = member.xp + Math.floor(Math.random() * 6) + 15;
  let level = member.level;
  let up = false;

  if (5 * (level ^ 2) + 50 * level + 100 - xp <= 0) {
    up = true;
    level++;
    xp = 0;
  }

  return { xp, level, up };
};

const Level = async (message: Message): Promise<void> => {
  if (!message.guild) return;
  if (message.author.bot) return;

  const messageCreatedTimestamp = message.createdTimestamp;

  const memberData = await getMember(message.guild.id, message.author.id);
  if (!memberData) return;
  if (
    messageCreatedTimestamp <=
    memberData.last_message_timestamp + 2 * 60 * 1000
  ) {
    memberData.message++;
    setMember(message.guild.id, message.author.id, memberData);
    return;
  }

  const server = await getServer(message.guild.id);

  if (!server) return;

  if (!server.level_message_channels.find((v) => v === message.channel.id))
    return;

  const XLU = setXpAndLevel(memberData);

  memberData.xp = XLU.xp;
  memberData.level = XLU.level;
  memberData.last_message_timestamp = messageCreatedTimestamp;
  memberData.message++;

  if (XLU.up && server.level_message_channel) {
    const channel = await message.client.channels.fetch(
      server.level_message_channel
    );
    if (channel) {
      (channel as TextChannel).send(
        `Someones chatty! <@${message.author.id}> is now level ${memberData.level}`
      );

      if (message.member) {
        const role = server.level_ranks.find(
          (v) => v.level === memberData.level
        );

        if (role) {
          message.member.roles.add(role.role_id);
        }
      }
    }
  }

  setMember(message.guild.id, message.author.id, memberData);
};

@Discord()
export class Example {
  @On({ event: 'messageCreate' })
  messageCreate([message]: ArgsOf<'messageCreate'>): void {
    if (!message.author.bot) Level(message);
  }
}
