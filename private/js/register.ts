import { getElementById } from './_dom/dom-utils';

const message = getElementById<HTMLParagraphElement>('message')!;

function setMessage(msg: string) {
  message.innerHTML = msg;
  message.style.display = '';
}

if (!message.innerHTML) {
  message.style.display ='none';
}

// ~~~~~###############~~~~~
// ~~~~~ REGISTER FORM ~~~~~
// ~~~~~###############~~~~~

const form = getElementById<HTMLFormElement>('form');
if (form) {
  form.onsubmit = ev => {
    if (!getElementById<HTMLInputElement>('user')?.value) {
      setMessage('User account must not be empty');

    } else if (!getElementById<HTMLInputElement>('email')?.value) {
      setMessage('Email field must not be empty');

    } else {
      const pass = getElementById<HTMLInputElement>('pass');

      if (!pass?.value) {
        setMessage('Password field must not be empty');

      } else if (pass.value === getElementById<HTMLInputElement>('pass2')?.value) {
        return true;

      } else {
        setMessage('Passwords doesn\'t match');
      }
    }
    return false;
  }
  getElementById('user')?.focus();
}


// ~~~~~############~~~~~
// ~~~~~ LOGIN FORM ~~~~~
// ~~~~~############~~~~~

const forml = getElementById<HTMLFormElement>('forml');
if (forml) {
  forml.onsubmit = ev => {
    if (!getElementById<HTMLInputElement>('user')?.value) {
      setMessage('User account must not be empty');

    } else if (!getElementById<HTMLInputElement>('pass')?.value) {
      setMessage('Password field must not be empty');

    } else {
      return true;
    }
    return false;
  }
  getElementById('user')?.focus();
}


// ~~~~~#######################~~~~~
// ~~~~~ CREATE CHARACTER FORM ~~~~~
// ~~~~~#######################~~~~~

const formc = getElementById<HTMLFormElement>('formc');
if (formc){
  formc.onsubmit = ev => {
    const name = getElementById<HTMLInputElement>('name')?.value;
    if (!name || !name.match(/^[A-Z][a-z]+( [A-Z][a-z]+)?$/) || name.length > 20){
      setMessage('Name must start with capital letters, have less than 20 characters and no more than 2 words');

    } else {
      const sex = getElementById<HTMLInputElement>('sex')?.value;
      if (sex !== '0' && sex !== '1') {
        setMessage('Sex value is invalid');
      } else {
        return true;
      }
    }
    return false;
  }
  getElementById('name')?.focus();
}