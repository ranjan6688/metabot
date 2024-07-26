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
    response.status(200).send({ Request: request, Response: response });
});
app.post('/webhook', async (request, response) => {
    response.status(200).send({ Request: request, Response: response });
});
app.listen(port, () => {
    return console.log(`Server is listening on ${port}`);
});
// module.exports = app;
//# sourceMappingURL=index.js.map