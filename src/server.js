const express = require('express');
const app = express();
const ordersRoutes = require('./routes/orders');
const scheduleRoutes = require('./routes/schedule');

app.use(express.json());
app.use('/api', ordersRoutes);
app.use('/api', scheduleRoutes); 

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API сервер запущен на http://localhost:${PORT}`);
});
