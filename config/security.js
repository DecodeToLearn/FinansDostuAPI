const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

module.exports = (app) => {
  // CORS ayarları
  app.use(cors());

  // HTTP başlıkları güvenliği
  app.use(helmet());

  // Rate limiting (istek sınırlama)
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 dakika
    max: 100 // Her 15 dakikada 100 istek
  });

  app.use(limiter);
};
