"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = process.env.PORT || 8080;
app.get('/', (request, response) => {
    return response.status(200).send("Welcome to METABOT");
});
app.get('/webhook', (request, response) => {
    var data = {};
    try {
        data = { Request: request.body, Response: response };
    }
    catch (ex) {
        data = ex;
    }
    return response.status(200).send(JSON.stringify(data));
});
app.post('/webhook', async (request, response) => {
    var data = {};
    try {
        data = { Request: request.body, Response: response };
    }
    catch (ex) {
        data = ex;
    }
    response.status(200).send(JSON.stringify(data));
});
app.listen(port, () => {
    return console.log(`Server is listening on ${port}`);
});
// module.exports = app;
//# sourceMappingURL=index.js.map