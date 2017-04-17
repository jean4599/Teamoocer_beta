var express = require('express');

const app = express();

//app.use('*', express.static('public'));
//app.use(express.static(__dirname +'/public'));

app.set('appPath', 'public');
app.use(express.static(__dirname +'/public'));
app.use('/public',express.static(__dirname +'/public'));

app.route('/*')
  .get(function(req, res) {
    res.sendfile(app.get('appPath') + '/index.html');
  });

app.listen(process.env.PORT || 3000);
