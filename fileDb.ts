import { promises as fs } from 'fs';

import { messagesDir } from './constants';
import { Message, MessageBody } from './types';

const fileDb = {
  async init() {
    try {
      const stat = await fs.stat(messagesDir);

      if (!stat.isDirectory()) {
        await fs.rm(messagesDir);
        await fs.mkdir(messagesDir);
      }
    } catch {
      await fs.mkdir(messagesDir);
    }
  },
  async readLastMessages(count?: number) {
    if (count !== undefined && !Number.isInteger(count)) {
      throw new Error('Invalid argument. Count must be integer.');
    }

    if (count !== undefined && count <= 0) {
      throw new Error('Invalid argument. Count must be positive.');
    }

    const messages: Message[] = [];
    const files = await fs.readdir(messagesDir);

    return await Promise.all(
      files
        .filter((file) => !Number.isNaN(Date.parse(file)))
        .slice(count === undefined ? undefined : -count)
        .map((datetime) => new Date(datetime))
        .map((datetime) => this.readMessage(datetime))
    );
  },
  async readMessage(datetime: Date) {
    const datetimeISO = datetime.toISOString();

    const content = await fs.readFile(`${messagesDir}/${datetimeISO}`);

    const body: MessageBody = JSON.parse(content.toString());

    return { ...body, datetime: datetimeISO };
  },
  async writeMessage(message: Message) {
    const { datetime, ...body } = message;

    const datetimeISO = datetime.toISOString();

    return await fs.writeFile(
      `${messagesDir}/${datetimeISO}`,
      JSON.stringify(body)
    );
  },
};

export default fileDb;
