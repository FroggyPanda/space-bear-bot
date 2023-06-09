import { dirname, importx } from '@discordx/importer';
import { createClient } from '@supabase/supabase-js';
import { ActivityType, Interaction, Message } from 'discord.js';
import { IntentsBitField } from 'discord.js';
import { Client, MetadataStorage } from 'discordx';
import { config } from 'dotenv';
import { Database } from 'schema.js';
import chalk from 'chalk';
import boxen from 'boxen';
import NodeCache from 'node-cache';
import { log } from './lib/index.js';

export type CacheMember = {
  id: number;
  message: number;
  xp: number;
  level: number;
  last_message_timestamp: number;
};

function sendToSupabase() {
  cache.keys().forEach(async (key: string) => {
    const value = cache.get<CacheMember>(key);
    const tableName = key.split(':')[0];

    if (tableName === 'member') {
      if (value) {
        const result = await supabase
          .from('member')
          .update({
            message: value.message,
            xp: value.xp,
            level: value.level,
            last_message_timestamp: value.last_message_timestamp,
          })
          .eq('id', value.id);

        if (result.error) {
          log('ERROR', `Error updating Supabase from cache:\n${result}`);

          throw new Error(`Error updating Supabase from cache:\n${result}`);
        }
      }
    }
  });
}

process.on('SIGINT', () => {
  sendToSupabase();
});

process.on('uncaughtException', (error) => {
  console.error(error);

  bot.users.send(
    '188851079050428427',
    `${bot.user?.username} has experienced a bug\n \`\`\`${error}\`\`\``
  );

  sendToSupabase();
});

config();

if (!process.env.SUPABASE_URL) {
  throw Error('Could not find SUPABASE_URL in your environment');
}

if (!process.env.SUPABASE_SERVICE_ROLE) {
  throw Error('Could not find SUPABASE_SERVICE_ROLE in your environment');
}

export const supabase = createClient<Database>(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE
);

// All in seconds
export const cache = new NodeCache({ stdTTL: 30 * 60, checkperiod: 10 * 60 });

cache.on('del', async (key: string, value: CacheMember) => {
  const tableName = key.split(':')[0];

  if (tableName === 'member') {
    const result = await supabase
      .from('member')
      .update({
        message: value.message,
        xp: value.xp,
        level: value.level,
        last_message_timestamp: value.last_message_timestamp,
      })
      .eq('id', value.id);

    if (result.error) {
      log('ERROR', `Error updating Supabase from cache:\n${result}`);

      throw new Error(`Error updating Supabase from cache:\n${result}`);
    }
  }
});

export const bot = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildVoiceStates,
    IntentsBitField.Flags.MessageContent,
  ],
  silent: false, // Debug logs are disabled in silent mode
});

bot.once('ready', async () => {
  await bot.guilds.fetch(); // Make sure all guilds are cached
  await bot.initApplicationCommands(); // Synchronize applications commands with Discord
  bot.user?.setActivity('Space Invaders', { type: ActivityType.Playing });

  console.log(
    boxen(chalk.green('🤖 Bot Started'), {
      padding: 0.5,
      borderStyle: 'round',
      borderColor: 'green',
    })
  );
});

bot.on('interactionCreate', (interaction: Interaction) => {
  bot.executeInteraction(interaction);
});

bot.on('messageCreate', (message: Message) => {
  bot.executeCommand(message);
});

async function run() {
  await importx(`${dirname(import.meta.url)}/{events,commands}/**/*.{ts,js}`);

  if (!process.env.BOT_TOKEN) {
    throw Error('Could not find BOT_TOKEN in your environment');
  }

  await bot.login(process.env.BOT_TOKEN);
}

run();
