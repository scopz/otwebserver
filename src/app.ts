import express from "express";
import { NextFunction, Request, Response } from "express";

import HttpClientError from './model/error'

import createError from 'http-errors';
import path from 'path';
import cookieParser from 'cookie-parser';
import lessMiddleware from 'less-middleware';
import logger from 'morgan';
import session from 'express-session';
import sessionFileStore from 'session-file-store';
import { sessionCookieName } from "./consts";

// routers
import { router as indexRouter } from './routes/index';
import { router as userRouter } from './routes/users';
import { router as loginRouter } from './routes/log';
import { router as registerRouter } from './routes/register';
import { router as manageRouter } from './routes/manage';

const FileStore = sessionFileStore(session);
export const app = express();
const rootDir = path.join(__dirname, '..')

// view engine setup
app.set('views', path.join(rootDir, 'private/views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(lessMiddleware(path.join(rootDir, 'private'), {
  dest: path.join(rootDir, 'public')
}));
app.use(express.static(path.join(rootDir, 'public')));

// session config
app.use(session({
  store: new FileStore({
    path: path.join(__dirname, 'sessions'),
    ttl: 604800 // 1 week
  }),
  name: sessionCookieName,
  genid: require('uuid').v4,
  cookie: {
    maxAge: 604800000 // 1 week
  },
  secret: 'tibia:ndria',
  resave: true,
  saveUninitialized: false,
  unset: 'destroy'
}));

app.use('/',         indexRouter);
app.use('/',         loginRouter);
app.use('/manage',   manageRouter);
app.use('/register', registerRouter);
app.use('/users',    userRouter);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status((err instanceof HttpClientError? err.status : 500) ?? 500);
  res.render('error');
});
