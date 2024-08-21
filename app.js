const express = require('express');
const setupSecurity = require('./config/security');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
setupSecurity(app);

app.use(express.json());

// Rota dosyalarını dahil edin
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const profileRoutes = require('./routes/profiles');
const accountRoutes = require('./routes/accounts');
const transactionRoutes = require('./routes/transactions');
const expenseRoutes = require('./routes/expenses');
const incomeRoutes = require('./routes/incomes');
const debtRoutes = require('./routes/debts');
const noteRoutes = require('./routes/notes');
const reportRoutes = require('./routes/reports');
const accountTypeRoutes = require('./routes/accountTypes');
const currencyRoutes = require('./routes/currency');
const categoryRoutes = require('./routes/categories');
const subaccountRoutes = require('./routes/subaccounts');

app.use('/api/auth', authRoutes); // Rota: /api/auth
app.use('/api/users', userRoutes); // Rota: /api/users
app.use('/api/profiles', profileRoutes); // Rota: /api/profiles
app.use('/api/accounts', accountRoutes); // Rota: /api/accounts
app.use('/api/transactions', transactionRoutes); // Rota: /api/transactions
app.use('/api/expenses', expenseRoutes); // Rota: /api/expenses
app.use('/api/incomes', incomeRoutes); // Rota: /api/incomes
app.use('/api/debts', debtRoutes); // Rota: /api/debts
app.use('/api/notes', noteRoutes); // Rota: /api/notes
app.use('/api/reports', reportRoutes); // Rota: /api/reports
app.use('/api/accountTypes', accountTypeRoutes); // Rota: /api/accountTypes
app.use('/api/currency', currencyRoutes); // Rota: /api/currency
app.use('/api/categories', categoryRoutes); // Rota: /api/categories
app.use('/api/subaccounts', subaccountRoutes); // Rota: /api/subaccounts

// Hata işleme middleware'i
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
