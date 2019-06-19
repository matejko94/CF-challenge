var express = require('express');
const puppeteer = require('puppeteer');


var router = express.Router();


async function extractArticle(page, params) {
    url = params.url
    //return new Promise(async (resolve, reject) => {
    try {

        await page.goto(url);

        let urls = await page.evaluate(() => {
            let author = document.querySelector('a.author');
            let formattedDate = document.querySelector('span.formattedDate').innerHTML;
            let type = document.querySelector('a.bc-2').innerHTML;
            author.getElementsByTagName('span')[0].innerHTML
            // params['author] = author.getElementsByTagName('span')[0].innerHTML
            return {author: author.getElementsByTagName('span')[0].innerHTML, type: type, date: formattedDate}
        })
        return Object.assign({}, params, urls);
        //return {params: params, urls: urls}
    } catch (e) {
        console.log(e)
        return null;
        //return reject(e);
    }
    //})
}


function run(page) {
    return new Promise(async (resolve, reject) => {
        try {

            var url = "https://www.cnet.com/"


            await page.goto(url);

            page.on('console', consoleObj => console.log(consoleObj));
            let urls = await page.evaluate(() => {
                let results = [];
                let items = document.querySelectorAll('div.col-5');
                items.forEach((item) => {
                    var img;
                    if (item.getElementsByTagName('img').length != 0) {
                        img = item.getElementsByTagName('img')[0].getAttribute('src')
                    }

                    results.push({
                        header: item.getElementsByTagName('a')[0].text,
                        url: item.getElementsByTagName('a')[0].href,
                        short_summary: item.getElementsByTagName('a')[1].text,
                        img: img
                    });

                });

                return results;
            })
            // browser.close();
            return resolve(urls);
        } catch (e) {
            return reject(e);
        }
    })
}


/* GET users listing. */
router.get('/',async function (req, res, next) {

    l = []

    const browser = await puppeteer.launch({devtools: true});
    const page = await browser.newPage();
    run(page).then(async function (results) {
            //console.log(results);

            for (i = 0; i < 5; i++) { //TODO should be changed and chacked
                //console.log(results[i])

                let data = await extractArticle(page, results[i])
                //  console.log(data)
                l.push(data)
            }

            browser.close()
            res.send(l);
            return l


        },
        function (error) {
            er = error;
            res.error(error)
        })


});

module.exports = router;