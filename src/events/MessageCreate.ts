import { Message, TextChannel } from 'discord.js';
import type { ArgsOf } from 'discordx';
import { Discord, On } from 'discordx';
import { getMember, getGuild } from '../lib/supabaseHelpers.js';
import { CacheMember, cache } from '../main.js';
import { log } from '../lib/index.js';

const setXpAndLevel = (member: CacheMember) => {
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

  log(
    'INFO',
    `Server ID ${message.guild.id}: User ID ${message.author.id} sent a message in a permited channel`
  );

  const messageCreatedTimestamp = message.createdTimestamp;

  let memberData = cache.get<CacheMember>(
    `member:${message.guild.id}/${message.author.id}`
  );

  if (!memberData) {
    const temp = await getMember(message.guild.id, message.author.id);
    memberData = {
      id: temp.id,
      message: temp.message,
      xp: temp.xp,
      level: temp.level,
      last_message_timestamp: temp.last_message_timestamp,
    };
  }

  if (!memberData) return;
  if (
    messageCreatedTimestamp <=
    memberData.last_message_timestamp + 2 * 60 * 1000
  ) {
    memberData.message++;
    cache.set(`member:${message.guild.id}/${message.author.id}`, memberData);
    return;
  }

  const guild = await getGuild(message.guild.id);

  if (!guild) return;

  if (!guild.level_message_channels.find((v) => v === message.channel.id))
    return;

  const XLU = setXpAndLevel(memberData);

  memberData.xp = XLU.xp;
  memberData.level = XLU.level;
  memberData.last_message_timestamp = messageCreatedTimestamp;
  memberData.message++;

  if (XLU.up && guild.level_message_channel) {
    const channel = await message.client.channels.fetch(
      guild.level_message_channel
    );
    if (channel) {
      const levelMessages = [
        'Congratulations',
        'Woohoo',
        'Awesome job',
        'Great work',
        'Keep it up',
        'Way to go',
        'Fantastic progress',
        'Incredible effort',
        'Amazing work',
        'Unbelievable progress',
      ];

      const levelMessage =
        levelMessages[Math.floor(Math.random() * levelMessages.length)];

      (channel as TextChannel).send(
        `${levelMessage}, <@${message.author.id}>! You've leveled up to level ${memberData.level}`
      );

      if (message.member) {
        const role = guild.level_ranks.find(
          (v) => v.level === memberData?.level
        );

        if (role) {
          message.member.roles.add(role.role_id);
        }
      }
    }
  }

  cache.set(`member:${message.guild.id}/${message.author.id}`, memberData);
};

@Discord()
export class Example {
  @On({ event: 'messageCreate' })
  messageCreate([message]: ArgsOf<'messageCreate'>): void {
    if (!message.author.bot) Level(message);
  }
}
