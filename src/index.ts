import express, { Request, Response } from 'express';
import env from 'dotenv';
import request from "request";

env.config();

const app = express()
const port = process.env.PORT || 8080

function sendMessage(to: string, msg: string){

    return new Promise((err:any, res: any) => {
        let options = {
            url: process.env.META_URL,
            method: `POST`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.META_ACCESS_TOKEN}`
            },
            body: JSON.stringify({
                "messaging_product": "whatsapp",
                "to": `${to}`,
                "type": "template",
                "template": {
                    "name": "askbot",
                    "language": {
                        "code": "en"
                    },
                   "components": [
                     {
                       "type": "body",
                       "parameters": [
                           {
                               "type": "text",
                               "text": `${msg}`
                           }
                       ]
                     }
                   ]
                }
              })
        };
        
        request(options, (error: any, response: any, body: any) => {        
            if (error) {
                return err(error);
            }
        
            if (response) {
                return res(response);
            }
        });

    });
}

app.get('/', (req: Request, res: Response) => {
    return res.status(200).send("Welcome to METABOT");
});

app.get('/sendmsg', (req: Request, res: Response) => {
    var recepient: any = req?.query?.to;
    var message: any = req?.query?.msg;

    if(!recepient)
        return res.status(500).send(`Recepient not provided!`);

    if(!message)
        return res.status(500).send(`Message not provided!`);

    sendMessage(recepient, message).then(response => res.status(200).send(response)).catch(error => res.status(500).send(error));
});

app.get('/incoming', (req: Request, res: Response) => {

    // var data = {};
    // try{
    //     data = {Request: req.body, Response: res};
    // }catch(ex){
    //     data = ex;
    // }
    res.status(200).send(`Webhook[GET] hits`);
});

app.post('/incoming', async (req: Request, res: Response) => {

    // var data = {};
    // try{
    //     data = {Request: req.body, Response: res};
    // }catch(ex){
    //     data = ex;
    // }
    // res.status(200).send(JSON.stringify(data));
    res.status(200).send(`Webhook[POST] hits`);
});

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`)
})

// module.exports = app;