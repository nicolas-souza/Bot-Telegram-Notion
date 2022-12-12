
const dotenv = require('dotenv');
    dotenv.config({path: "src/.env"});

const TelegramBot = require('node-telegram-bot-api');

const Helper = require('./Helpers/Helper')

const token = process.env.TELEGRAM_API_KEY;

const bot = new TelegramBot(token, {polling: true});


const sendMenu = (chatId) => {
    bot.sendMessage(chatId, "Em que posso ajudá-lo?!", {
        "reply_markup": {
            "inline_keyboard": [
                            [
                                { text: 'Áreas', callback_data: '/area'},
                                { text: 'Cursos', callback_data: '/curso'}
                            ],
                            [
                                { text: 'Tasks', callback_data: '/task'},
                                { text: 'Projetos', callback_data: '/projeto'}
                            ]
            ]
        }
    });
}

const sendMenuTask = (opts) => {
    bot.sendMessage(opts.chat_id, "Qual status gostaria de verificar?", {
        "reply_markup": {
            "inline_keyboard": [
                [
                    { text: 'Esperando', callback_data: '/task Esperando' }
                ],
                [
                    { text: 'Caminhando', callback_data: '/task Caminhando' },
                    { text: 'Esperando Aprovação', callback_data: '/task Esperando Aprovação' },
                    { text: 'Revisão', callback_data: '/task Revisão'}
                ],
                [
                    { text: 'Aprovado', callback_data: '/task Aprovado' },
                    { text: 'Finalizado', callback_data: '/task Finalizado' },

                ],
                [
                    { text: 'Arquivo', callback_data: '/task Arquivo' }
                ]
            ]
        }
    });
}

bot.onText(/\/addtask (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];

    try{
        Helper.addTask(resp).then((response) => {
            bot.sendMessage(chatId, response, {parse_mode: "HTML"});
            sendMenu(chatId);
        })
    } catch {
        bot.sendMessage(chatId, "Algo estranho aconteceu, confira as informações e tente novamente 😊");
    }
});

bot.onText(/\/addCurso (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];

    //bot.sendMessage(chatId, "Qual status gostaria de verificar?");

});

bot.onText(/\/addConteudo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];

    //bot.sendMessage(chatId, "Qual status gostaria de verificar?");

});

bot.onText(/\/task/, (msg, match) => {
  const chatId = msg.chat.id;
  //const resp = match[1]; // the captured "whatever"

  bot.sendMessage(chatId, "Qual status gostaria de verificar?", {
    "reply_markup": {
        "remove_keyboard":true,
        "inline_keyboard": [
            [
                { text: 'Esperando', callback_data: '/task Esperando' }
            ],
            [
                { text: 'Caminhando', callback_data: '/task Caminhando' },
                { text: 'Esperando Aprovação', callback_data: '/task Esperando Aprovação' },
                { text: 'Revisão', callback_data: '/task Revisão'}
            ],
            [
                { text: 'Aprovado', callback_data: '/task Aprovado' },
                { text: 'Finalizado', callback_data: '/task Finalizado' },

            ],
            [
                { text: 'Arquivo', callback_data: '/task Arquivo' }
            ]
        ]
    }
  });

});

bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    sendMenu(chatId);
});

bot.on('callback_query', async function onCallbackQuery(callbackQuery) {
    const action = callbackQuery.data;
    const msg = callbackQuery.message;
    const opts = {
      chat_id: msg.chat.id,
      message_id: msg.message_id,
    };

    switch(action){
        case('/area'):
            console.log("area")
        break;
        case('/curso'):
            console.log("curso")
        break;
        case('/projeto'):
            console.log("projeto")
        break;
        case('/task'):

            bot.editMessageReplyMarkup({
                "reply_markup": {
                    "remove_keyboard":false,
                }

            }, opts);

            sendMenuTask(opts);

        break;

        default:
            let data = await Helper.selectAction(action);
            let mensagem = "🤓";
            if(data != null){
                mensagem = await Helper.formatData(data, action);
                await bot.sendMessage(opts.chat_id, mensagem, {parse_mode: "HTML"});
                // bot.editMessageReplyMarkup({
                //     "reply_markup": {
                //         "remove_keyboard":false,
                //     }

                // }, opts);
            }
            sendMenu(opts.chat_id);
        break;
    }
  });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  //const text = selectAction(msg.text);
  //bot.sendMessage(chatId, text)

//   bot.sendMessage(chatId, "Olá, Nicolas!", {
//     "reply_markup": {
//         "inline_keyboard": [
//             [
//                 { text: '/Cursos', callback_data: '/cursos'},
//                 { text: '/Areas'}
//             ],
//             [
//                 { text: '/Tasks'},
//                 { text: '/Cursos'}
//             ]
//         ]
//     }
//   });
});

