var express = require('express'),
    app = express();

// app.get('/', function (req, res) {
// 	{ GOOGLE_API_KEY: process.env.GOOGLE_API_KEY }
// })

app.use(express.static('www'));

// CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});

// API Routes
// app.get('/blah', routeHandler);

app.set('port', process.env.PORT || 4000);

app.listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
