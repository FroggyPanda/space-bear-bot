import { ChatInputCommandInteraction } from 'discord.js';
import { Discord, Slash } from 'discordx';
import { log } from '../lib/index.js';

@Discord()
export class DoSomething {
  @Slash({
    name: 'test',
    description: 'test',
  })
  doSomething(interaction: ChatInputCommandInteraction) {
    log('ERROR', 'bobert');
    throw new Error('bobert');
  }
}
