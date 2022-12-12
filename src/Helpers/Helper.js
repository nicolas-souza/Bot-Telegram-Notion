
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
        if (action.startsWith('/task')){
            let data;
            let status;
            status = action.replace("/task ", "");
            if(optStatus.includes(status)){
                data = await NotionDB.TasksByStatus({status: status})
                return data;
            } else {
                return null;
            }
        }
        if(action.startsWith('/curso')){

        }
        return null;
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
}
module.exports = new Helper();