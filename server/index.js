import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes/index';

const app = express();
const router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
routes(router);

app.get('/', (req, res) => res.send('Hello World!'));
app.use('/api/v1', router);

app.listen(3000);
