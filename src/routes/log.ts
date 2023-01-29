import { query, close } from '../dbconnection';
import { NextFunction, Request, Response, Router } from 'express';
import sha1 from 'sha1';
import { sessionCookieName } from '../consts';

export const router = Router();

/* GET login page. */
router.get('/login', (req, res) => {
  res.render('login', {
    ret: {},
    r: req.query.r
  });
});

/* GET login page. */
router.post('/login', async (req, res) => {

  const user = req.body.user;
  const pass = sha1(req.body.pass);

  try {
    const found = await query(req, 'SELECT id, email, premend FROM `accounts` WHERE id=? AND password=?', [user, pass]);

    if (found.length == 1) {
      const { id, email, premend } = found[0];
      req.session.user = { id, email, premend };

      res.redirect(req.query.r? req.query.r as string : '/manage');

    } else {
      res.render('login', {
        ret: req.body,
        message: 'User or password incorrect',
        r: req.query.r
      });
    }
  } catch (e) {
    res.render('login', {
      ret: req.body,
      message: 'An error ocurred validating data',
      r: req.query.r
    });

    console.log(user, e, new Error());
  } finally {
    close(req);
  }
});


/* GET logout page. */
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) console.log(err);

    res.clearCookie(sessionCookieName);
    const referrer = req.get('referrer');

    res.redirect(referrer? referrer : '/');
  });
});


export function checkLogUser(req: Request, res: Response, next: NextFunction): boolean {
  if (!req.session.user) {
    res.redirect('/login?r=' + encodeURIComponent(req.baseUrl+req.url));
    return false;

  } else {
    next();
    return true;
  }
}
