const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const mongodb = require('./db/connect');
const motoBikesRoutes = require('./routes/motoBikes');
const carsRoutes = require('./routes/cars');
const Routes = require('./routes/index');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger.json'); 
const session = require('express-session');
const cors = require('cors');
    
const port = 3000

// Required for secure cookies on Render
app.set('trust proxy', 1);

app
  .use(bodyParser.json())
  .use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // true in production
    httpOnly: true,
    sameSite: 'none'
  }
  }))
  
  .use(cors({
  origin: 'http://127.0.0.1:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
  }))
  .use(express.static(path.join(__dirname, 'public')))
  .use('/motoBikes', motoBikesRoutes)
  .use('/cars', carsRoutes)
  .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile, {
    swaggerOptions: {
      withCredentials: true, // critical to include session cookie
      requestInterceptor: (req) => {
        req.credentials = 'include';
        return req;
    }
  }
}))

  .use('/', Routes)

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



app.get('/check-login', (req, res) => {
  res.json({
    isAuthenticated: !!req.session.user,
    user: req.session.user || null
  });
});


process.on('uncaughtException', (err, origin) => {
  console.log(process.stderr.fd, `Caught exception: ${err}\n` + `Exception origin: ${origin}`);
});

mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});


