require('dotenv').config();
const app = require('express')();
const mongoose = require('mongoose');
const requireDir = require('require-dir');
const bodyParser = require('body-parser');
const Raven = require('./app/services/sentry');

const dbConfig = require('./config/database');

mongoose.connect(dbConfig.url, {
    useCreateIndex: true,
    useNewUrlParser: true,
});
requireDir(dbConfig.modelsPath);

app.use(bodyParser.json());


app.use(Raven.requestHandler());

app.use('/api', require('./app/routes'));

// O erroHandler vai verificar se houve algum erro nas rotas, e 
// enviará para o Sentry o detalhamento desse erro.
app.use(Raven.errorHandler());

app.listen(3000);