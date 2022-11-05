const express = require('express');
const scrapeRoute = require('./public/routes/scrape')
const cors = require('cors')

const app = express();


app.use(express.json());
app.use(cors())

app.use('/scrape', scrapeRoute);

app.listen(5000, () => console.log('Server run at 5000'))