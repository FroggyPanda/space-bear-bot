import fs from 'fs';
import chalk from 'chalk';

type LogLevel = 'INFO' | 'WARN' | 'ERROR';

export function log(logLevel: LogLevel, message: string): void {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] [${logLevel}] ${message}\n`;

  if (logLevel == 'INFO') {
    console.log(chalk.blueBright(message));
  } else if (logLevel == 'WARN') {
    console.log(chalk.yellow(message));
  } else if (logLevel == 'ERROR') {
    console.log(chalk.red(message));
  }

  fs.appendFileSync('logs.log', logEntry);
}
