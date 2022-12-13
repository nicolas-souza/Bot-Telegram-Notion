
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
    bot.sendMessage(opts.chat_id, "Qual status das tasks gostaria de verificar?", {
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

const sendMenuCurso = (opts) => {
    bot.sendMessage(opts.chat_id, "Qual status para a lista de cursos?", {
        "reply_markup": {
            "inline_keyboard": [
                [
                    { text: '👀 Esperando', callback_data: '/curso Esperando' },
                    { text: '👣 Caminhando', callback_data: '/curso Caminhando' },
                    { text: '🤓 Aprovado', callback_data: '/curso Aprovado' },
                ]
            ]
        }
    });
}

bot.onText(/\/addtask (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const expression = match[1];

    try{
        Helper.addTask(expression).then((response) => {
            bot.sendMessage(chatId, response, {parse_mode: "HTML"});
            sendMenu(chatId);
        })
    } catch {
        bot.sendMessage(chatId, "Algo estranho aconteceu, confira as informações e tente novamente 😊");
    }
});

bot.onText(/\/addcurso (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const expression = match[1];

    try{
        Helper.addCurso(expression).then((response) => {
            bot.sendMessage(chatId, response, {parse_mode: "HTML"});
            sendMenu(chatId);
        })
    } catch {
        bot.sendMessage(chatId, "Algo estranho aconteceu, confira as informações e tente novamente 😊");
    }

});

bot.onText(/\/addConteudo (.+)/, (msg, match) => {
    const chatId = msg.chat.id;
    const resp = match[1];

    //bot.sendMessage(chatId, "Qual status gostaria de verificar?");

});

// bot.onText(/\/task/, (msg, match) => {
//   const chatId = msg.chat.id;
//   //const resp = match[1]; // the captured "whatever"

//   bot.sendMessage(chatId, "Qual status gostaria de verificar?", {
//     "reply_markup": {
//         "remove_keyboard":true,
//         "inline_keyboard": [
//             [
//                 { text: 'Esperando', callback_data: '/task Esperando' }
//             ],
//             [
//                 { text: 'Caminhando', callback_data: '/task Caminhando' },
//                 { text: 'Esperando Aprovação', callback_data: '/task Esperando Aprovação' },
//                 { text: 'Revisão', callback_data: '/task Revisão'}
//             ],
//             [
//                 { text: 'Aprovado', callback_data: '/task Aprovado' },
//                 { text: 'Finalizado', callback_data: '/task Finalizado' },

//             ],
//             [
//                 { text: 'Arquivo', callback_data: '/task Arquivo' }
//             ]
//         ]
//     }
//   });

// });

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
            sendMenuCurso(opts);
        break;
        case('/projeto'):
            console.log("projeto")
        break;
        case('/task'):
            sendMenuTask(opts);
        break;

        default:
            let data = await Helper.selectAction(action);
            let mensagem = "🤓";

            if(data != null){
                mensagem = await Helper.formatData(data, action);
                await bot.sendMessage(opts.chat_id, mensagem, {parse_mode: "HTML"});
            }

            sendMenu(opts.chat_id);
        break;
    }
  });

bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  sendMenu(chatId);
});

