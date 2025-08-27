import express, { Request, Response } from 'express';
import cors from 'cors'

const app = express();
const port = 3000

app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
    res.send("Welcome to your AWS learnings")
})

app.listen(port, () => {
    console.log(`Listening on Port http:localhost:${port}`)
})