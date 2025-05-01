const express = require('express');
const app = express();
const ordersRoutes = require('./routes/orders');

app.use(express.json());
app.use('/api', ordersRoutes); // теперь доступно по /api/orders

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ API сервер запущен на http://localhost:${PORT}`);
});
