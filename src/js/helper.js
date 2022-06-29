import { async } from 'regenerator-runtime';
import { TIMEOUT_SECONDS } from './config';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    const response = await Promise.race([fetch(url), timeout(TIMEOUT_SECONDS)]); // 10 is the
    const data = await response.json();

    if (!response.ok) throw new Error(response.status, 'something is wrong');
    return data;
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

    const response = await Promise.race([fetchPro, timeout(TIMEOUT_SECONDS)]); // 10 is the
    const data = await response.json();

    if (!response.ok) throw new Error(response.status, 'something is wrong');
    return data;
  } catch (err) {
    throw err;
  }
};
