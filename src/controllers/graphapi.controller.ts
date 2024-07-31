import axios from "axios";
import express from "express";
import { CommonService } from "./../services/common.service";

export class GraphApiController{


    constructor(private common: CommonService){}

    async onWebhookPostMessageRecieved(request: express.Request, response: express.Response){

        var replyMessage = '';
        this.common.logger.debug("Incoming webhook message:", JSON.stringify(request.body, null, 2));
        
        const recievedMessageObj = request.body.entry?.[0]?.changes[0]?.value?.messages?.[0];        
        if (recievedMessageObj?.type === "text") {

            const businessNumber = request.body.entry?.[0].changes?.[0].value?.metadata?.phone_number_id;
            replyMessage = await this.common.cmdSvc.processCommand(recievedMessageObj?.text?.body?.trim(), response);

            await this.sendReplyMessage(businessNumber, recievedMessageObj, replyMessage);
            await this.sendMarkAsRead(businessNumber, recievedMessageObj);
            
        }

        response.sendStatus(200);
    }

    async onWebhookGetMessageRecieved(request: express.Request, response: express.Response){
        this.verifyWebhook(request, response);
    }

    private verifyWebhook(request: express.Request, response: express.Response){
        const mode = request.query["hub.mode"];
        const token = request.query["hub.verify_token"];
        const challenge = request.query["hub.challenge"];
      
        // check the mode and token sent are correct
        if (mode === "subscribe" && token === this.common.chipherSvc.AESdecrypt(this.common.property.application.graphApi.verifyToken)) {
          // respond with 200 OK and challenge token from the request
          response.status(200).send(challenge);
          console.log("Webhook verified successfully!");
        } else {
          // respond with '403 Forbidden' if verify tokens do not match
          response.sendStatus(403);
        }
    }

    private async sendReplyMessage(businessNumber: string, recievedMessageObj: any, replyMessage: any){
        await axios({
            method: "POST",
            url: `https://graph.facebook.com/v20.0/${businessNumber}/messages`,
            headers: {
                Authorization: `Bearer ${this.common.property.application.graphApi.authToken}`,
            },
            data: {
                messaging_product: "whatsapp",
                to: recievedMessageObj.from,
                text: { body: `${replyMessage}` },
                context: {
                    message_id: recievedMessageObj.id, // shows the message as a reply to the original user message
                },
            },
        });
    }

    private async sendMarkAsRead(businessNumber: string, recievedMessageObj: any){
        await axios({
            method: "POST",
            url: `https://graph.facebook.com/v20.0/${businessNumber}/messages`,
            headers: {
                Authorization: `Bearer ${this.common.property.application.graphApi.authToken}`,
            },
            data: {
                messaging_product: "whatsapp",
                status: "read",
                message_id: recievedMessageObj.id,
            },
        });
    }

    sendMessage(){

    }
}