const express = require('express');
const cors = require('cors');
const sequelize = require('./config/db');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/tasks', taskRoutes);

sequelize.authenticate()
  .then(() => console.log('✅ DB connected!'))
  .catch(err => console.error('❌ DB connection failed:', err));

sequelize.sync()
  .then(() => {
    app.listen(3001, () => {
      console.log('Server running on http://localhost:3001');
    });
  })
  .catch(err => console.error('Error syncing DB:', err));
