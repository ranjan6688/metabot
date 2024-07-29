"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const request_1 = __importDefault(require("request"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
const { META_URL, META_ACCESS_TOKEN, META_VERIFY_TOKEN } = process.env;
function sendMessage(to, msg) {
    return new Promise((err, res) => {
        let options = {
            url: META_URL,
            method: `POST`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${META_ACCESS_TOKEN}`
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
        (0, request_1.default)(options, (error, response, body) => {
            if (error) {
                return err(error);
            }
            if (response) {
                return res(response);
            }
        });
    });
}
function sendReplyMessage(from, msg) {
    return new Promise((err, res) => {
        let options = {
            url: `https://graph.facebook.com/v18.0/${from}/messages`,
            method: `POST`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${META_ACCESS_TOKEN}`
            },
            body: JSON.stringify({
                "messaging_product": "whatsapp",
                "to": `${msg.from}`,
                text: { body: "Echo: " + msg.text.body },
                context: {
                    message_id: msg.id, // shows the message as a reply to the original user message
                }
            })
        };
        (0, request_1.default)(options, (error, response, body) => {
            if (error) {
                return err(error);
            }
            if (response) {
                return res(response);
            }
        });
    });
}
function sendMarkAsRead(from, msg) {
    return new Promise((err, res) => {
        let options = {
            url: `https://graph.facebook.com/v18.0/${from}/messages`,
            method: `POST`,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${META_ACCESS_TOKEN}`
            },
            body: JSON.stringify({
                "messaging_product": "whatsapp",
                status: "read",
                message_id: msg.id,
            })
        };
        (0, request_1.default)(options, (error, response, body) => {
            if (error) {
                return err(error);
            }
            if (response) {
                return res(response);
            }
        });
    });
}
app.post("/webhook", async (req, res) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    // log incoming messages
    console.log("Incoming webhook message:", JSON.stringify(req.body, null, 2));
    // check if the webhook request contains a message
    // details on WhatsApp text message payload: https://developers.facebook.com/docs/whatsapp/cloud-api/webhooks/payload-examples#text-messages
    const message = (_e = (_d = (_c = (_b = (_a = req.body.entry) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.changes[0]) === null || _c === void 0 ? void 0 : _c.value) === null || _d === void 0 ? void 0 : _d.messages) === null || _e === void 0 ? void 0 : _e[0];
    // check if the incoming message contains text
    if ((message === null || message === void 0 ? void 0 : message.type) === "text") {
        // extract the business number to send the reply from it
        const business_phone_number_id = (_j = (_h = (_g = (_f = req.body.entry) === null || _f === void 0 ? void 0 : _f[0].changes) === null || _g === void 0 ? void 0 : _g[0].value) === null || _h === void 0 ? void 0 : _h.metadata) === null || _j === void 0 ? void 0 : _j.phone_number_id;
        // send a reply message as per the docs here https://developers.facebook.com/docs/whatsapp/cloud-api/reference/messages
        // await axios({
        //   method: "POST",
        //   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
        //   headers: {
        //     Authorization: `Bearer ${GRAPH_API_TOKEN}`,
        //   },
        //   data: {
        //     messaging_product: "whatsapp",
        //     to: message.from,
        //     text: { body: "Echo: " + message.text.body },
        //     context: {
        //       message_id: message.id, // shows the message as a reply to the original user message
        //     },
        //   },
        // });
        sendReplyMessage(business_phone_number_id, message).then(response => res.status(200).send(response)).catch(error => res.status(500).send(error));
        // mark incoming message as read
        // await axios({
        //   method: "POST",
        //   url: `https://graph.facebook.com/v18.0/${business_phone_number_id}/messages`,
        //   headers: {
        //     Authorization: `Bearer ${GRAPH_API_TOKEN}`,
        //   },
        //   data: {
        //     messaging_product: "whatsapp",
        //     status: "read",
        //     message_id: message.id,
        //   },
        // });
        sendMarkAsRead(business_phone_number_id, message).then(response => res.status(200).send(response)).catch(error => res.status(500).send(error));
    }
    //   res.sendStatus(200);
});
// accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
app.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
    // check the mode and token sent are correct
    if (mode === "subscribe" && token === META_VERIFY_TOKEN) {
        // respond with 200 OK and challenge token from the request
        res.status(200).send(challenge);
        console.log("Webhook verified successfully!");
    }
    else {
        // respond with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
    }
});
app.get('/', (req, res) => {
    return res.status(200).send("Welcome to METABOT");
});
app.get('/sendmsg', (req, res) => {
    var _a, _b;
    var recepient = (_a = req === null || req === void 0 ? void 0 : req.query) === null || _a === void 0 ? void 0 : _a.to;
    var message = (_b = req === null || req === void 0 ? void 0 : req.query) === null || _b === void 0 ? void 0 : _b.msg;
    if (!recepient)
        return res.status(500).send(`Recepient not provided!`);
    if (!message)
        return res.status(500).send(`Message not provided!`);
    sendMessage(recepient, message).then(response => res.status(200).send(response)).catch(error => res.status(500).send(error));
});
app.get('/webhook', (req, res) => {
    let mode = req.query["hub.mode"];
    let challange = req.query["hub.challenge"];
    let token = req.query["hub.verify_token"];
    console.log(mode, challange, token);
    if (mode && token) {
        if (mode === "subscribe" && token === META_VERIFY_TOKEN) {
            console.log('success');
            return res.status(200).send(challange);
        }
        else {
            console.log('failed');
            return res.status(403);
        }
    }
    // return res.status(200).send(`This is a recvmsg`);
});
app.post('/webhook', (req, res) => {
    let body_param = req.body;
    console.log(JSON.stringify(body_param, null, 2));
    if (body_param.object) {
        console.log("inside body param");
        if (body_param.entry &&
            body_param.entry[0].changes &&
            body_param.entry[0].changes[0].value.messages &&
            body_param.entry[0].changes[0].value.messages[0]) {
            let phon_no_id = body_param.entry[0].changes[0].value.metadata.phone_number_id;
            let from = body_param.entry[0].changes[0].value.messages[0].from;
            let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;
            console.log("phone number " + phon_no_id);
            console.log("from " + from);
            console.log("boady param " + msg_body);
            sendMessage(phon_no_id, msg_body).then(response => res.status(200).send(response)).catch(error => res.status(500).send(error));
        }
        else {
            res.sendStatus(404);
        }
    }
});
app.listen(port, () => {
    return console.log(`Server is listening on ${port}`);
});
// module.exports = app;
//# sourceMappingURL=index.js.map