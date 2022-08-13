# Server

## Server Configuration 
### Node Modules
- [x] Express
- [x] jsonwebtoken
- [x] bcrypt
- [x] bcryptjs
- [x] dotenv
- [x] moment
- [x] mongoose
- [x] nodemon

### Database
- [x] MongoDB

## Server Structure
- [x] Node Server


## Deployment & Testing
- [x] Testing
- [x] Deployment in Heroku
    - [x] [Heroku](https://doctor-call-healthy.herokuapp.com/)
    - [x] [Git](https://github.com/mrmezan06/doctor-appointment)
    - [x] MongoDB - Google Link With mrmezan0@gmail.com

## Heroku Configuration
- [x] `Server.js`
`    - [x] Below is the configuration for Heroku After Your Route`
<pre>
if(process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    } );
}

const port = process.env.PORT || 5000;

app.get('/', (req, res) => res.send('Hello World!'));
</pre>
- [x] `package.json`
- [x] Below is the configuration for Heroku After ` "main": "index.js",`
<pre>
"engines": {
    "node": "17.8.0",
    "npm": "8.13.2"
  },
  "scripts": {
    "client-install": "npm install --prefix clinet",
    "server": "nodemon server.js",
    "client": "npm start --prefix clinet",
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "start": "node server.js",
    "heroku-postbuild": "NPM_CONFIG_PRODUCTION=false npm install --prefix client && npm run build --prefix client"
  },
  </pre>
- [x] gitignore
    - [x] `node_modules`
    - [x] If in gitignore .env is also is listed then remove from it otherwise MONGO_URL can't be found



## Run The Server In Your Local Machine
- [x] Clone the repository
    - [x] [Git](https://github.com/mrmezan06/doctor-appointment)
- [x] Install the dependencies
    - [x] npm install
- [x] Set up .env
    - [x] MONGO_URI=`YOUR_MONGO_URL\DATABASE_NAME`
    - [x] JWT_SECRET=`YOUR_JWT_SECRET`
    - [x] If Local MONGO_URI=`mongodb://127.0.0.1:27017/doctor-appointment`
- [x] Run the server
    - [x] nodemon server
- [x] Run the tests
- [x] Deploy the server

## Media Devices Query

<pre>
/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {...}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {...}

/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {...}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {...}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {...}
</pre>


## Start Node server
- [x] `nodemon server`

## Start React App

- [x] `cd client`
- [x] `npm start`