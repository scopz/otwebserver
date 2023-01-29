import { NextFunction, Request, Response, Router } from 'express';
import sha1 from 'sha1';
import * as dbc from '../dbconnection';
const ipUtils = require('ip2long');

export const router = Router();

router.get('/', (req, res) => {
  res.render('register', { ret: {} });
});

router.post('/', validate, createAccount, (req, res) => {
  dbc.close(req);
  if (!req.success) {
    res.render('register', {
      success:false,
      ret:req.body,
      message: req.message
    });

  } else {
    res.render('register', {
      success:true,
      ret:req.body
    });
  }
});

async function validate(req: Request, res: Response, next: NextFunction) {
  const user: string = req.body.user;
  const pass: string = req.body.pass;
  const email: string = req.body.email;

  if (!user || !user.match(/^\d{6,7}$/)){
    req.success = false;
    req.message = 'User field must be a numeric of 6 or 7 digits';

  } else if (!pass) {
    req.success = false;
    req.message = 'Password field must not be empty';

  } else if (!email) {
    req.success = false;
    req.message = 'Email field must not be empty';

  } else {
    try {
      const found = await dbc.query(req, 'SELECT * FROM `accounts` WHERE id=? OR email=?', [user, email]);

      if (found.length > 0) {
        req.success = false;
        req.message = 'This user or email already exists';
      } else {
        req.success = true;
      }
    } catch (e) {
      req.success = false;
      req.message = 'An error ocurred validating data';
      console.log(user, email, e, new Error());
    }
  }
  next();
};


async function createAccount(req: Request, res: Response, next: NextFunction) {
  if (req.success) {
    const user: string = req.body.user;
    const pass: string = sha1(req.body.pass);
    const email: string = req.body.email;

    const connection = dbc.connect(req);
    try {
      await dbc.beginTransaction(connection);

      let info = await dbc.perform(connection, 'INSERT INTO `accounts` (`id`, `password`, `email`, `premend`, `blocked`, `warnings`)'+
        ' VALUES (?,?,?,0,0,0)',[user, pass, email]);

      if (info.affectedRows == 1) {
        const ip = req.ip.startsWith('::ffff:')
          ? ipUtils.ip2long(req.ip.substring(7))
          : 0;

        info = await dbc.perform(connection, 'INSERT INTO `znote_accounts` (`account_id`, `ip`, `created`)'+
          ' VALUES (?,?,?)', [user, ip, new Date().getTime()/1000]);

        if (info.affectedRows != 1) {
          req.success = false;
          req.message = `An error ocurred creating user [0xf4c31f-${info.affectedRows}]`;
        }

      } else {
        req.success = false;
        req.message = `An error ocurred creating user [0x713b92-${info.affectedRows}]`;
      }

      if (req.success) {
        connection.commit(console.error);
      } else {
        connection.rollback(console.error);
      }

    } catch (e) {
      req.success = false;
      req.message = 'An error ocurred creating user [0x683f27]';
      console.log(user, email, e, new Error());
      connection.rollback(console.error);
    }
  }
  next();
};