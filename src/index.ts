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

app.get('/pushmsg', (req: Request, res: Response) => {
    
    let mode = req.query["hub.mode"];
    let challange = req.query["hub.challenge"];
    let token = req.query["hub.verify_token"];


    if (mode && token) {

        if (mode === "subscribe" && token === process.env.META_VERIFY_TOKEN) {
            return res.status(200).send(challange);
        } else {
            return res.status(403);
        }

    }

    // return res.status(200).send(`This is a recvmsg`);
});

app.post('/pushmsg', (req: Request, res: Response) => {
    console.log(req);
    return res.status(200).send(req);
});

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`)
})

// module.exports = app;