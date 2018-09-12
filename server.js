const express = require('express');
const bodyParser = require('body-parser');
const math = require('mathjs');

const port = process.env.PORT || 5000;

const app = express();
app.use(bodyParser.json());

app.post('/api/calculate', (req, res) => {
    const formula = req.body.formula;
    const result = math.eval(formula);
    const view = math.format(result, { precision: 14 });
    res.send({ result: view });
});

app.listen(port, () => console.log(`Listening on port ${port}`));
