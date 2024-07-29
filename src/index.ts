import express, { Request, Response } from 'express';
import env from 'dotenv';
import request from "request";
import stringify = require("json-stringify-safe");

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

app.get('/webhook', (req: Request, res: Response) => {
    
    let mode = req.query["hub.mode"];
    let challange = req.query["hub.challenge"];
    let token = req.query["hub.verify_token"];

    console.log(mode, challange, token);

    if (mode && token) {

        if (mode === "subscribe" && token === process.env.META_VERIFY_TOKEN) {
            console.log('success');
            return res.status(200).send(challange);
        } else {
            console.log('failed');
            return res.status(403);
        }

    }

    // return res.status(200).send(`This is a recvmsg`);
});

app.post('/webhook', (req: Request, res: Response) => {
    let body_param=req.body;

    console.log(JSON.stringify(body_param,null,2));

    if(body_param.object){
        console.log("inside body param");
        if(body_param.entry && 
            body_param.entry[0].changes && 
            body_param.entry[0].changes[0].value.messages && 
            body_param.entry[0].changes[0].value.messages[0]  
            ){
               let phon_no_id=body_param.entry[0].changes[0].value.metadata.phone_number_id;
               let from = body_param.entry[0].changes[0].value.messages[0].from; 
               let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

               console.log("phone number "+phon_no_id);
               console.log("from "+from);
               console.log("boady param "+msg_body);

               sendMessage(phon_no_id, msg_body).then(response => res.status(200).send(response)).catch(error => res.status(500).send(error));

            }else{
                res.sendStatus(404);
            }

    }
});

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`)
})

// module.exports = app;