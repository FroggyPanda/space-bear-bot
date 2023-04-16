import { EmbedBuilder, EmbedFooterOptions } from 'discord.js';

type EmbedOptions = {
  title?: string;
  description: string;
  footer?: EmbedFooterOptions;
};

export function RedEmbed(options: string): EmbedBuilder;
export function RedEmbed(options: EmbedOptions): EmbedBuilder;
export function RedEmbed(options: string | EmbedOptions): EmbedBuilder {
  if (typeof options === 'string')
    return new EmbedBuilder().setDescription(options).setColor('#ff6b6b');

  const embed = new EmbedBuilder()
    .setDescription(options.description)
    .setColor('#ff6b6b');

  if (options.title) embed.setTitle(options.title);
  if (options.footer) embed.setFooter(options.footer);

  return embed;
}

export function GreenEmbed(options: string): EmbedBuilder;
export function GreenEmbed(options: EmbedOptions): EmbedBuilder;
export function GreenEmbed(options: string | EmbedOptions): EmbedBuilder {
  if (typeof options === 'string')
    return new EmbedBuilder().setDescription(options).setColor('#1dd1a1');

  const embed = new EmbedBuilder()
    .setDescription(options.description)
    .setColor('#1dd1a1');

  if (options.title) embed.setTitle(options.title);
  if (options.footer) embed.setFooter(options.footer);

  return embed;
}

export function YellowEmbed(options: string): EmbedBuilder;
export function YellowEmbed(options: EmbedOptions): EmbedBuilder;
export function YellowEmbed(options: string | EmbedOptions): EmbedBuilder {
  if (typeof options === 'string')
    return new EmbedBuilder().setDescription(options).setColor('#feca57');

  const embed = new EmbedBuilder()
    .setDescription(options.description)
    .setColor('#feca57');

  if (options.title) embed.setTitle(options.title);
  if (options.footer) embed.setFooter(options.footer);

  return embed;
}

export function BlueEmbed(options: string): EmbedBuilder;
export function BlueEmbed(options: EmbedOptions): EmbedBuilder;
export function BlueEmbed(options: string | EmbedOptions): EmbedBuilder {
  if (typeof options === 'string')
    return new EmbedBuilder().setDescription(options).setColor('#54a0ff');

  const embed = new EmbedBuilder()
    .setDescription(options.description)
    .setColor('#54a0ff');

  if (options.title) embed.setTitle(options.title);
  if (options.footer) embed.setFooter(options.footer);

  return embed;
}
