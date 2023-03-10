var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const {connectDatabase} = require('./db');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const {initialize} = require('express-openapi');
const swaggerUi = require('swagger-ui-express');
const prometheusBundle = require("express-prom-bundle");

var app = express();

connectDatabase();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



const metricsMiddleware = prometheusBundle({
    includeMethod: true,
    includePath: true,
    includeStatusCode: true,
    includeUp: true,
    customLabels: {
        project_name: "journalapi",
        project_type: "api_service",
        promClient:{
            collectDefaultMetrics: {}
        }
    }
});

app.use(metricsMiddleware);

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.listen(5050);

initialize({
    app,
    apiDoc: require('./api/api-doc'),
    paths: path.resolve("./api/paths"),
})

var docsURL = "http://" + process.env.HOST + ":" + process.env.PORT + "/api-docs";

app.use ( "/api-documentation",
    swaggerUi.serve,
    swaggerUi.setup ( null, {
        swaggerOptions: {
            url: docsURL
            }
            })
        );

module.exports = app;
