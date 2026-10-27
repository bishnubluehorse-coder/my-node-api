const express = require('express');
const cors = require('cors');
const path = require('node:path');

const userRoutes = require('./routes/userRoutes');

const app = express();

app.use(cors());

app.use(express.json());
app.use(
    '/uploads',
    express.static(path.join(process.cwd(), 'uploads'))
);

app.use('/api', userRoutes);

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    const statusCode = error.code === 'LIMIT_FILE_SIZE'
        ? 413
        : Number.isInteger(error.statusCode)
            ? error.statusCode
            : 500;
    res.status(statusCode).json({
        code: statusCode,
        message: statusCode >= 500 ? 'Internal server error' : error.message,
    });
});

module.exports = app;