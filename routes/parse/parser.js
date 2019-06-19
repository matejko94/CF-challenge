const puppeteer = require('puppeteer');


class Parse {

    constructor() {
        this.url = "https://www.cnet.com/"

    }
    /**
     * Extract all articles from first page
     * */
    extractTopArticles(page) {
        return new Promise(async (resolve, reject) => {
            try {


                await page.goto(this.url);

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
                return resolve(urls);
            } catch (e) {
                return reject(e);
            }
        })
    }

    /**
     * Extract content from specific article.
     * */
    async extractContentFromArticle(page, params) {
        try {

            await page.goto(params.url);

            let urls = await page.evaluate(() => {
                let author = document.querySelector('a.author');
                let a = author.getElementsByTagName('span')[0].innerHTML
                console.log(a)
                let formattedDate = document.querySelector('span.formattedDate').innerHTML;
                console.log(formattedDate)
                let type = document.querySelector('a.bc-2').innerHTML;

                return {author: a, type: type, date: formattedDate}
            })
            return Object.assign({}, params, urls);
        } catch (e) {
            console.log(e)
            return null;

        }

    }


    /**
     * Handle parsing and put in the proper format
     */
    async parseWebPage(callback) {
        var l = []
        const browser = await puppeteer.launch({devtools: true});
        const page = await browser.newPage();

        var t = this;
        t.extractTopArticles(page).then(async function (results) {
                //console.log(results);
                for (var i = 0; i < 5; i++) { //TODO should be changed and chacked
                    console.log(results[i])
                    let data = await t.extractContentFromArticle(page, results[i])
                    l.push(data)
                }
                browser.close()

                callback(l, null);

            },
            function (error) {
                console.log(error)
                callback(null, error);
            })

    }


}

exports.Parse = Parse