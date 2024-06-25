const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const cors = require('cors');

// const token = '5336424335:AAGk0uyo0qqRCrKgvr2J7GrYKK1S0MF8878';

// 7336426424:AAG0aWjH5b1MROk5up7doNikBQHpYzXHL94
const token = '7336426424:AAG0aWjH5b1MROk5up7doNikBQHpYzXHL94';

// const webAppUrl = 'https://ornate-selkie-c27577.netlify.app';
// const webAppUrl = 'https://music.youtube.com/playlist?list=LM';

const webAppUrl = 'https://4-2-web-app-telegram-react.netlify.app';
// const webAppUrl = 'https://bondarenkoav240486.github.io/organizer2';

// https://www.youtube.com/watch?v=MzO-0IYkZMU&t=1471s&ab_channel=UlbiTV
// https://bondarenkoav240486.github.io/organizer2/
// const webAppUrl2 = 'https://www.youtube.com/watch?v=MzO-0IYkZMU&t=1471s&ab_channel=UlbiTV';

const bot = new TelegramBot(token, {polling: true});
const app = express();

app.use(express.json());
app.use(cors());

bot.on('message', async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text;

    if(text === '/start') {
        await bot.sendMessage(chatId, 'Ниже появится кнопка, заполни форму', {
            reply_markup: {
                keyboard: [
                    [{text: 'Заполнить форму', web_app: {url: webAppUrl + '/form'}}]
                    // [{text: 'Заполнить форму', web_app: {url: webAppUrl2}}]
                ]
            }
        })

        await bot.sendMessage(chatId, 'Заходи в наш интернет магазин по кнопке ниже', {
            reply_markup: {
                inline_keyboard: [
                    [{text: 'Сделать заказ', web_app: {url: webAppUrl}}]
                ]
            }
        })
    }

    if(msg?.web_app_data?.data) {
        try {
            const data = JSON.parse(msg?.web_app_data?.data)
            console.log(data)
            await bot.sendMessage(chatId, 'Спасибо за обратную связь!')
            await bot.sendMessage(chatId, 'Ваша страна: ' + data?.country);
            await bot.sendMessage(chatId, 'Ваша улица: ' + data?.street);

            setTimeout(async () => {
                await bot.sendMessage(chatId, 'Всю информацию вы получите в этом чате');
            }, 3000)
        } catch (e) {
            console.log(e);
        }
    }
});

app.post('/web-data', async (req, res) => {
    console.log(1111)
    const {queryId, products = [], totalPrice} = req.body;
    try {
        await bot.answerWebAppQuery(queryId, {
            type: 'article',
            id: queryId,
            title: 'Успешная покупка',
            input_message_content: {
                message_text: ` Поздравляю с покупкой, вы приобрели товар на сумму ${totalPrice}, ${products.map(item => item.title).join(', ')}`
            }
        })
        return res.status(200).json({});
    } catch (e) {
        return res.status(500).json({})
    }
})

const PORT = 8000;

app.listen(PORT, () => console.log('server started on PORT ' + PORT))
