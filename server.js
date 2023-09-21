require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const auth = require('./auth');
const things = require('./apps/catalog/routes/things');
const lending = require('./apps/librarian');

app.use(bodyParser.json());

app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, supabase-access-token, supabase-refresh-token");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
    res.header("Access-Control-Allow-Credentials", "true");
    res.header("Access-Control-Allow-Private-Network", "true");
    next();
});

app.get('/', (_, res) => {
    res.send('You have reached the Things API');
});
app.use('/things', things);
app.use('/lending', lending);
app.use('/auth', auth);

const PORT = process.env.PORT || 8088;
app.listen(PORT, () => {
    console.log(`PVD Things API listening on PORT ${PORT}...`);
});