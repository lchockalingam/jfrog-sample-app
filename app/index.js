const express = require('express');
const axios = require('axios');
const lodash = require('lodash');
const dayjs = require('dayjs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    version: require('./package.json').version,
  });
});

// Sample data endpoint using lodash
app.get('/api/data', (req, res) => {
  const items = [
    { id: 1, name: 'Widget A', category: 'tools', price: 9.99 },
    { id: 2, name: 'Widget B', category: 'tools', price: 14.99 },
    { id: 3, name: 'Gadget X', category: 'electronics', price: 49.99 },
    { id: 4, name: 'Gadget Y', category: 'electronics', price: 79.99 },
    { id: 5, name: 'Supply Z', category: 'supplies', price: 4.99 },
  ];

  const grouped = lodash.groupBy(items, 'category');
  const summary = lodash.mapValues(grouped, (group) => ({
    count: group.length,
    totalValue: lodash.sumBy(group, 'price').toFixed(2),
    items: group,
  }));

  res.json({ data: summary, generatedAt: dayjs().toISOString() });
});

// Echo endpoint
app.post('/api/echo', (req, res) => {
  res.json({ echo: req.body, receivedAt: dayjs().toISOString() });
});

app.listen(PORT, () => {
  console.log(`JFrog Sample App running on port ${PORT}`);
});

module.exports = app;
