const dotenv = require('dotenv');
const { Client } = require('@notionhq/client');
const { search } = require('@notionhq/client/build/src/api-endpoints');

dotenv.config({path: "src/.env"});

const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

const mapNotionElement = (element) => {
    return {
        Name: element.properties.Name.title[0].plain_text,
        Type: element.properties.Type.select.name,
        Tags: element.properties.Tags.multi_select != null ? element.properties.Tags.multi_select.map((tags) => (tags.name)) : [],
        Area: element.properties.Area.select != null ? element.properties.Area.select.name : "" ,
        CreatedTime: element.properties["Created time"].created_time,
        Date: element.properties.Date.date != null ?{
            start: element.properties.Date.date.start,
            end: element.properties.Date.date.end
        }: null,
        Status: element.properties.Status.status.name,
        Link: element.properties.Link != null ? element.properties.Link.url : "",
        LastEditedTime: element.properties["Last edited time"].last_edited_time,
        ProjectCode: element.properties["Project code"].number
    }
};

const mapNotionResult = (arrayResult) => {
    let array = [];
    arrayResult.forEach((element) => {
        try{
            const dtoElement = mapNotionElement(element);
            array.push(dtoElement)
        }catch(error){

        }
    })
    return array;
};


class NotionDB{

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

    async createCurso(title, url){
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
                    "Link": {
                        "url": url
                    },
                    "Type": {
                        "select": {
                          "name": "Curso"
                        }
                    },
                    "Area": {
                        "select": {
                          "name": "Estudos"
                        }
                    },
                    "Status": {
                        "status": {
                          "name": 'Esperando'
                        }
                    }

                },
                "children": [
                    {
                        "object": "block",
                        "bookmark": {
                            "url": url
                        }
                    }
                ]
            });
            return mapNotionElement(response)
        } catch (error) {

            return null
        }
    }

    async createConteudo(title, url){
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
                    "Link": {
                        "url": url
                    },
                    "Type": {
                        "select": {
                          "name": "Conteúdo"
                        }
                    },
                    "Area": {
                        "select": {
                          "name": "Estudos"
                        }
                    },
                    "Status": {
                        "status": {
                          "name": 'Finalizado'
                        }
                    }

                },
                "children": [
                    {
                        "object": "block",
                        "bookmark": {
                            "url": url
                        }
                    }
                ]
            });

            return mapNotionElement(response)
        } catch (error) {
            return null
        }
    }

    async byStatus(type, status){
        try {
            const response = await notion.databases.query({
                database_id: databaseId,
                "filter": {
                    "and":[
                        {
                            "property": "Type",
                            "select": {
                                "equals": type
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
                "sorts":  [
                    {
                        "property": "Created time",
                        "direction": "descending"
                    }
                ],

                "page_size": 5

            });
            return mapNotionResult(response.results);
        } catch (error){

        }
    }

    async searchConteudo(search){
        try {
            const response = await notion.databases.query({
                database_id: databaseId,
                "filter": {
                    "and":[
                        {
                            "property": "Type",
                            "select": {
                                "equals": "Conteúdo"
                            }
                        },
                        {
                           "or": [
                            {
                                "property": "Name",
                                "title":{
                                    "contains": search
                                }
                            },
                            {
                                "property": "Tags",
                                "multi_select":{
                                    "contains": search
                                }
                            }

                           ]
                        }
                   ]
                },
                "sorts":  [
                    {
                        "property": "Created time",
                        "direction": "descending"
                    }
                ],

                "page_size": 8

            });
            const result = mapNotionResult(response.results)

            return result;
        } catch (error){
           

        }
    }

}
module.exports = new NotionDB();