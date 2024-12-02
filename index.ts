import express from 'express';
import messagesRouter from './routers/messages';
import fileDb from './fileDb';

const app = express();
const port = 8000;

app.use(express.json());
app.use('/messages', messagesRouter);

(async () => {
  await fileDb.init();

  app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
  });
})().catch(console.error);
