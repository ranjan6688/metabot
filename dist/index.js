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
function sendMessage(to, msg) {
    return new Promise((err, res) => {
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
    var data = {};
    try {
        data = { Request: req.body, Response: res };
    }
    catch (ex) {
        data = ex;
    }
    res.status(200).send(JSON.stringify(data));
});
app.post('/webhook', async (req, res) => {
    var data = {};
    try {
        data = { Request: req.body, Response: res };
    }
    catch (ex) {
        data = ex;
    }
    res.status(200).send(JSON.stringify(data));
});
app.listen(port, () => {
    return console.log(`Server is listening on ${port}`);
});
// module.exports = app;
//# sourceMappingURL=index.js.map