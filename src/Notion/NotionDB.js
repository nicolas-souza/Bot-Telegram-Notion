const dotenv = require('dotenv');
const { Client } = require('@notionhq/client');

dotenv.config({path: "src/.env"});

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

const mapNotionElement = (element) => {
    return {
        Name: element.properties.Name.title[0].plain_text,
         Type: element.properties.Type.select.name,
         Tags: element.properties.Tags.multi_select.map((tags) => (tags.name)),
         Area: element.properties.Area.select.name,
         CreatedTime: element.properties["Created time"].created_time,
         Date: element.properties.Date.date != null ?{
             start: element.properties.Date.date.start,
             end: element.properties.Date.date.end
         }: null,
         Status: element.properties.Status.status.name,
         Link: element.properties.Link.url,
         LastEditedTime: element.properties["Last edited time"].last_edited_time,
         ProjectCode: element.properties["Project code"].number
    }
};

const mapNotionResult = (arrayResult) => {

    const obj =  arrayResult.map((element) => (mapNotionElement(element)))

    return obj;

}

class NotionDB{
    async queryDatabase() {
        try {
            const response = await notion.databases.query({
                database_id: databaseId,

            });
            return mapNotionResult(response.results);
        } catch (error){
            console.log(error.body);
        }
    }

    async createTask({area = "Pessoal", title = "", status = "Esperando"}){
        try {
            const response = await notion.pages.create({
                parent: {
                    database_id: databaseId,
                },
                properties: {
                    "Name": {
                        "title": [
                          {
                            "type": "text",
                            "text": {
                              "content": title
                            }
                          }
                        ]
                    },
                    "Type": {
                        "select": {
                          "name": "Task"
                        }
                    },
                    "Area": {
                        "select": {
                          "name": area
                        }
                    },
                    "Status": {
                        "status": {
                          "name": status
                        }
                    }

                }
            });

            return mapNotionElement(response)
        } catch (error) {
            return null
        }
    }

    async TasksByStatus({status = "Esperando"}) {
        try {
            const response = await notion.databases.query({
                database_id: databaseId,
                "filter": {
                    "and":[
                        {
                            "property": "Type",
                            "select": {
                                "equals": "Task"
                            }
                        },
                        {
                            "property": "Status",
                            "status": {
                                "equals": status
                            }
                        }
                   ]
                },
                "sorts": [
                    {
                        "property": "Created time",
                        "direction": "ascending" // older
                    }
                ]

            });
            return mapNotionResult(response.results);
        } catch (error){
            console.log(error.body);
        }
    }

    async TasksByAreaAndStatus({area = "Estudos", status="Caminhando"}) {
        try {
            const response = await notion.databases.query({
                database_id: databaseId,
                "filter": {
                    "and":[
                        {
                            "property": "Type",
                            "select": {
                                "equals": "Task"
                            }
                        },
                        {
                            "property": "Area",
                            "select": {
                                "equals": area
                            }
                        },
                        {
                            "property": "Status",
                            "status": {
                                "equals": status
                            }
                        }
                   ]
                }

            });
            return mapNotionResult(response.results);
        } catch (error){
            console.log(error.body);
        }
    }

    async CursoByStatus({status = "Esperando"}) {
        try {
            const response = await notion.databases.query({
                database_id: databaseId,
                "filter": {
                    "and":[
                        {
                            "property": "Type",
                            "select": {
                                "equals": "Curso"
                            }
                        },
                        {
                            "property": "Status",
                            "status": {
                                "equals": status
                            }
                        }
                   ]
                }

            });
            return mapNotionResult(response.results);
        } catch (error){
            console.log(error.body);
        }
    }

}
module.exports = new NotionDB();