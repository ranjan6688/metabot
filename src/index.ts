import express, { Request, Response } from 'express';

const app = express()
const port = process.env.PORT || 8080

app.get('/', (request: Request, response: Response) => {
    return response.status(200).send("Welcome to METABOT");
});

app.get('/webhook', (request: Request, response: Response) => {
    response.status(200).send({Request: request, Response: response});
});

app.post('/webhook', async (request: Request, response: Response) => {
    response.status(200).send({Request: request, Response: response});  
});

app.listen(port, () => {
  return console.log(`Server is listening on ${port}`)
})

// module.exports = app;