export interface Message {
  message: string;
  datetime: Date;
}

export type MessageBody = Omit<Message, 'datetime'>;
