import { dirname, importx } from '@discordx/importer';
import { YTDLPlayerPlugin } from '@discordx/plugin-ytdl-player';
import { createClient } from '@supabase/supabase-js';
import { ActivityType, Interaction, Message } from 'discord.js';
import { IntentsBitField } from 'discord.js';
import { Client, MetadataStorage } from 'discordx';
import { config } from 'dotenv';
import { Database } from 'schema.js';
import Log from './decorators/Log.js';
import chalk from 'chalk';
import boxen from 'boxen';

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

const ytdlPlayerPlugin = new YTDLPlayerPlugin({
  metadata: MetadataStorage.instance,
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
  plugins: [ytdlPlayerPlugin],
  silent: false, // Debug logs are disabled in silent mode
  guards: [Log], // Default guard on each command
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

