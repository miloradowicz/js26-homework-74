import express from 'express';

import fileDb from '../fileDb';
import { MessageBody } from '../types';

const router = express.Router();

router.get('/', async (req, res) => {
  const messages = await fileDb.readLastMessages(5);
  res.send(messages);
});

router.post('/', async (req, res) => {
  const datetime = new Date();
  const message = { ...(req.body as MessageBody), datetime };
  await fileDb.writeMessage(message);

  res.send({ ...message, datetime: datetime.toISOString() });
});

export default router;
