"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
const port = process.env.PORT || 8080;
const { WEBHOOK_VERIFY_TOKEN, GRAPH_API_TOKEN, PORT } = process.env;
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
        await (0, axios_1.default)({
            method: "POST",
            url: `https://graph.facebook.com/v20.0/${business_phone_number_id}/messages`,
            headers: {
                Authorization: `Bearer ${GRAPH_API_TOKEN}`,
            },
            data: {
                messaging_product: "whatsapp",
                to: message.from,
                text: { body: "Echo: " + message.text.body },
                context: {
                    message_id: message.id, // shows the message as a reply to the original user message
                },
            },
        });
        // mark incoming message as read
        await (0, axios_1.default)({
            method: "POST",
            url: `https://graph.facebook.com/v20.0/${business_phone_number_id}/messages`,
            headers: {
                Authorization: `Bearer ${GRAPH_API_TOKEN}`,
            },
            data: {
                messaging_product: "whatsapp",
                status: "read",
                message_id: message.id,
            },
        });
    }
    res.sendStatus(200);
});
// accepts GET requests at the /webhook endpoint. You need this URL to setup webhook initially.
// info on verification request payload: https://developers.facebook.com/docs/graph-api/webhooks/getting-started#verification-requests
app.get("/webhook", (req, res) => {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];
    // check the mode and token sent are correct
    if (mode === "subscribe" && token === WEBHOOK_VERIFY_TOKEN) {
        // respond with 200 OK and challenge token from the request
        res.status(200).send(challenge);
        console.log("Webhook verified successfully!");
    }
    else {
        // respond with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
    }
});
app.get("/", (req, res) => {
    res.send(`<pre>Nothing to see here.
Checkout README.md to start.</pre>`);
});
app.listen(PORT, () => {
    console.log(`Server is listening on port: ${PORT}`);
});
// module.exports = app;
//# sourceMappingURL=index.js.map