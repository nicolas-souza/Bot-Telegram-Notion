
const NotionDB = require('../Notion/NotionDB');

const dictAction = {
    "/task": "Task",
    "/curso": "Curso",
    "/projeto": "Projeto",
    "/area": "Area"
};

const optStatus = ['Esperando', 'Caminhando', 'Esperando Aprovação', 'Revisão', 'Aprovado', 'Finalizado', 'Arquivo'];

const optArea = ['Radix', 'Estudos', 'Pessoal', 'Faculdade'];

class Helper {
    async selectAction(action) {
        try {

            const array = action.split(" ");
            const type = dictAction[array[0]];
            const status = array[1];
            const data = await NotionDB.ByStatus(type, status)
            return data;

        } catch(error){

            return null;

        }
    }

    async formatData(data, action){
        let mensagem = "";
        let status;
        if(action.startsWith("/task")){
            status = action.replace("/task ", "");
            mensagem = `
        <b><i>Tasks com status: "${status}</i></b>"
        `;
            data.forEach(element => {
                mensagem += `
Titulo: ${element.Name}
Area: ${element.Area}
---------------------------------------
`
            });
        }

        if(action.startsWith("/curso")){
            status = action.replace("/curso ", "");
            mensagem = `
        <b><i>Curso com status: "${status}</i></b>"
        `;
            data.forEach(element => {
                mensagem += `
Titulo: ${element.Name}
Tags: ${element.Tags}
Link: ${element.Link}
---------------------------------------
`
            });
        }

        return mensagem;
    }

   async addTask(name){

    let mensagem = "";

    const arrayMsg = name.split(" ");

    const area = optArea.includes(arrayMsg[0]) ? arrayMsg[0] : "Pessoal"

    const title = name.replace(area + " ", "");

    const opt = {
        area,
        title,
    }

    try {
        const data = await NotionDB.createTask(opt);

        mensagem = `
            <b><i>Tasks recém adicionada: </i></b>
            `;

            mensagem += `
    Titulo: ${data.Name}
    Area: ${data.Area}
    Status: ${data.Status}
    ---------------------------------------
    `
    } catch (error) {

    }

    return mensagem;
   }

   async addCurso(expression){

    let mensagem = '';
    const arrayMsg = expression.split(" ");

    const url = arrayMsg.pop();
    const title = expression.replace(url, "");
    try{
        const data = await NotionDB.createCurso(title, url);
        mensagem = `
        <b><i>Curso recém adicionado: </i></b>
        `;

        mensagem += `
Titulo: ${data.Name}
Area: ${data.Area}
Link: ${data.Link}
---------------------------------------
`

    }catch(error){

    }
    return mensagem;
   }
}
module.exports = new Helper();