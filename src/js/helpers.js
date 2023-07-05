import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config';
import * as model from './model.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long. Timeout after ${s} seconds`));
    }, s * 1000);
  });
};

export async function AJAX(url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
}

// Old GetJSON and SendJSON begore we combine them into AJAX
/*
export const getJSON = async function (url) {
  try {
    const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    console.log(data);
  } catch (err) {
    throw err;
  }
};

export const sendJSON = async function (url, uploadData) {
  try {
    const fetchPro = fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });

    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (err) {
    throw err;
  }
};
 */

// ----------------------- TAVARES HELPERS ------------------------ //
// -------------------------- FUNCTIONS --------------------------- //

export function toFraction(num) {
  // Fractions Reference Obj
  if (num % 1 === 0) return num;

  const myFractions = [
    { decimal: 0.01, fraction: '1/20' },
    { decimal: 0.1, fraction: '1/10' },
    { decimal: 0.2, fraction: '1/5' },
    { decimal: 0.25, fraction: '1/4' },
    { decimal: 0.3, fraction: '3/10' },
    { decimal: 0.4, fraction: '2/5' },
    { decimal: 0.5, fraction: '1/2' },
    { decimal: 0.6, fraction: '6/10' },
    { decimal: 0.7, fraction: '7/10' },
    { decimal: 0.75, fraction: '3/4' },
    { decimal: 0.8, fraction: '4/5' },
    { decimal: 0.9, fraction: '9/10' },
  ];

  // Setting integer and decimal
  const dec = num < 1 ? num : num % 1;
  const int = num < 1 ? ' ' : Math.trunc(num);

  // Getting fraction
  // console.log('dec : ', dec);
  // console.log('int : ', int);

  const fraction = myFractions
    .filter(fr => {
      // console.log('fraction decimal', fr.decimal);
      // console.log('recipe decimal', dec);
      return fr.decimal <= dec;
    })
    .slice(-1)[0].fraction;
  // const fraction = myFractions
  //   .filter(fr => fr.decimal <= dec)
  //   .slice(-1)[0].fraction;

  return `${int} ${fraction}`;
}
