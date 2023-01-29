import { Request } from 'express';
import { Connection, createConnection, ResultSetHeader, RowDataPacket } from 'mysql2';
import { MYSQL_DB } from './consts';
import { IncomingMessage } from 'http';

function newConnection(): Connection {
  const connection = createConnection({
    host    : MYSQL_DB.HOST,
    port    : MYSQL_DB.PORT,
    user    : MYSQL_DB.USER,
    password: MYSQL_DB.PASSWORD,
    database: MYSQL_DB.DATABASE,
  });

  const originStack = new Error().stack;

  connection.on('error', (err: Error) => {
    console.error(new Date(), 'Connection error:');
    console.error(err);
    console.error(originStack);
  });

  return connection;
}

export function connect(req: Request | undefined): Connection{
  let connection;
  if (req == undefined){
    connection = newConnection();
    connection.connect();
    
  } else if (req.mysqlConn == undefined){
    connection = newConnection();
    connection.connect();
    req.mysqlConn = connection;

  } else {
    connection = req.mysqlConn;
  }
  return connection;
}

export function close(closeable: Request | Connection) {
  if (!closeable) throw new Error('Close must receive a connection or request');

  if (closeable instanceof IncomingMessage) {
    closeable.mysqlConn?.end()
    closeable.mysqlConn = undefined;

  } else {
    closeable.end();
  }
}

export function query<T extends RowDataPacket>(connectionOrRequest: Request | Connection, sql: string, params?: any[]): Promise<T[]> {
  return new Promise((resolve, reject) => {

    const con: Connection = connectionOrRequest instanceof IncomingMessage
      ? connect(connectionOrRequest)
      : connectionOrRequest;

    con.query(sql, params, (err: Error | null, rows: T[]) => {
      if (err) reject(err);
      else     resolve(rows);
    });
  });
}

export function perform(connectionOrRequest: Request | Connection, sql: string, params?: any[]): Promise<ResultSetHeader> {
  return new Promise((resolve, reject) => {

    const con: Connection = connectionOrRequest instanceof IncomingMessage
      ? connect(connectionOrRequest)
      : connectionOrRequest;

    con.query(sql, params, (err: Error | null, rows: ResultSetHeader) => {
      if (err) reject(err);
      else     resolve(rows);
    });
  });
}

export function beginTransaction(connection: Connection): Promise<void> {
  return new Promise((resolve, reject)=>{
    connection.beginTransaction(err=>{
      if (err) reject(err);
      else resolve();
    });
  });
}
