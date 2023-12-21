const express = require('express');
const tf = require('@tensorflow/tfjs-node');
const os = require('os');
const path = require('path');
require('dotenv').config();

const app = express(); // create a new Express app instance

const port = parseInt(process.env.PORT);

const loadModel = async () => {
    console.log('Loading the model...');
    const model = await tf.loadLayersModel('file://' + path.join(__dirname, 'model/model.json'));
    console.log('Model loaded successfully');
    return model;
  };
  
  let model;

loadModel().then((m) => (model = m));

function predictProfit(investment, duration) {
  const inputTensor = tf.tensor2d([[investment, duration]]);
  const result = model.predict(inputTensor);
  const predictedProfit = result.dataSync()[0];

  return predictedProfit;
}

// middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/predict-profit', (req, res) => {
    const investment = parseFloat(req.body.investment);
    const duration = parseFloat(req.body.duration);
    console.log(investment,duration)

  if (typeof investment !== 'number' || typeof duration !== 'number') {
    return res.status(400).json({ error: 'Investment and duration must be numbers.' });
  }
  if (investment < 0 || duration < 0) {
    return res.status(400).json({ error: 'Investment and duration must be non-negative.' });
  }
  const predictedProfit = predictProfit(investment, duration);
  res.json({ predictedProfit });
  console.log(predictedProfit);
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});