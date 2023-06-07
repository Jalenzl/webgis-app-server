import bodyParser from 'body-parser';
import express from 'express';
import { NextFunction, Request, Response } from 'express';

// 自定义模块
import { systemConfig } from './config';

const app = express();

// 处理 post 请求的请求体，限制大小最多为 20 兆
app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
app.use(bodyParser.json({ limit: '20mb' }));

// error handler
app.use(function(err: Error, req: Request, res: Response, next: NextFunction) {
    return res.sendStatus(500);
});

app.listen(systemConfig.port, function() {
    console.log(`the server is start at port ${systemConfig.port}`);
});

export default app;