import mysql from 'mysql2';

type UserData = {
  id: number,
  email: string,
  premend: Date
};

declare global {
  var development: boolean;

  namespace Express {
    export interface Request {
      mysqlConn?: mysql.Connection;
      success?: boolean;
      message?: string;
    }
  }
}


declare module 'express-session' {
  export interface SessionData {
    user?: UserData;
  }
}
