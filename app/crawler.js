const schedule = require('node-schedule');
const moment = require('moment');
const axios = require('axios');

const db = require('./db');

/**
 * True: exibi erros e ações no console
 */
const debug = true;

const crawler = _ => {

    //Programa a função para rodar conforme a cron desejada
    //Explicação cron: https://crontab.guru/
    const job = schedule.scheduleJob('* * * * *', function () {

        //Busca todos os sites
        db.each('SELECT * FROM site ', (err, row) => {
            //Caso houver algum erro, aborta
            if (err)
                return;

            const now = moment();

            //Faz a requisição para o site
            axios.get(row.url).then((response) => {
                if (debug)
                    console.log(`GET ${row.url} - ${response.status}`);

                //Calcula quanto tempo a request levou
                const requestTime = moment().diff(now);

                //Salva a resposta
                db.run(`INSERT INTO historico_site (site_id, status, request_time) VALUES (${row.id}, '${response.status}', ${requestTime});`, function (err) {
                    if (err && debug)
                        console.log(err);
                });

            }).catch((err) => {
                if (debug) {
                    console.log(`GET ${row.url} - ERROR`);
                }

                //Calcula quanto tempo a request levou
                const requestTime = moment().diff(now);

                //Caso o site tenha respondido (diferente de 200)
                if (err.response) {
                    db.run(`INSERT INTO historico_site (site_id, status, request_time) VALUES (${row.id}, '${err.response.status}', ${requestTime});`, (err) => {
                        if (err && debug)
                            console.log(err);
                    });
                    return;
                }

                //Caso falhe a request
                db.run(`INSERT INTO historico_site (site_id, error_code, request_time) VALUES (${row.id}, '${err.code}', ${requestTime});`, (err) => {
                    if (err && debug)
                        console.log(err);
                });
            })
        });
    });

}

module.exports = crawler;