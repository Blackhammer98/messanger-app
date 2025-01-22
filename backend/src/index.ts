import express, { Request, Response, NextFunction } from 'express';
import expressWs from 'express-ws';

// Extend the Express request type
interface CustomRequest extends Request {
  testing?: string;
}

const app = express() as unknown as expressWs.Application;

expressWs(app);

app.use((req: CustomRequest, res: Response, next: NextFunction) => {
  console.log('middleware');
  req.testing = 'testing';
  next();
});

app.get('/', (req: CustomRequest, res: Response) => {
  console.log('get route', req.testing);
  res.end();
});

app.ws('/', (ws, req: CustomRequest) => {
  ws.on('message', (msg) => {
    console.log(msg);
  });
  console.log('socket', req.testing);
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
