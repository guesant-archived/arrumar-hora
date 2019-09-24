#! /usr/bin/env node
const dom = require('jsdom');
const axios = require('axios');
const execa = require('execa');

const { JSDOM } = dom;

axios
  .get('https://www.horariodebrasilia.org')
  .then(res => res.data)
  .then(horariodebrasilia => {
    const dom = new JSDOM(horariodebrasilia, { runScripts: 'dangerously' });

    const horaAtual = dom.window.document.querySelector('#relogio').innerHTML;
    const tempoAtual = horaAtual.split(':');

    try {
      const date = new Date();
      date.setHours(tempoAtual[0] - 1);
      date.setMinutes(tempoAtual[1]);
      date.setSeconds(tempoAtual[2]);

      const setTime = date.toTimeString().slice(0, 8);
      console.log(setTime);

      execa.sync('timedatectl', [`set-time`, setTime]);
    } catch (error) {
      console.error(error);
    }
  });
