var express = require('express')
  , http    = require('http')
  , path    = require('path')
  , app     = express()
  , server  = http.createServer(app);

var fr = require('./filereader.js');

(function(){

	var httpPort = 12333;

	exports.set = function set(key,value) {

		switch(key)
		{
			case 'httpPort':
				httpPort = value;
				break;

			// case 'connectionString' :
			// 	connectionString = value;
			// 	break;

			// case 'ipConfig':
			// 	ipConfig = value;
			// 	break;

		}

		return this;

	}

	exports.start = function start() {

		console.log('Loading configs!');
		app.configure(function(){
			app.set('port', process.env.PORT || httpPort );
			app.set('views', __dirname + '/views');
			app.set('view engine', 'jade');
			app.locals.basedir = __dirname + '/views';
			app.use(express.logger('dev'));
			app.use(express.urlencoded())
			app.use(express.json())
			app.use(express.methodOverride());
			app.use(express.cookieParser('the most secret phrase'));
			app.use(express.session({secret:'fudge monkeys'}));
			app.use(app.routes);
			app.use(express.static(path.join(__dirname, 'public')));
		});

		console.log('Loading Dev Error Logger');

		app.configure('development', function(){
			app.use(express.errorHandler());
		});

		console.log('Loading routes...');
		//login
		
		app.all('*', function(req, res){

			fr.readFile(function(data){
				fr.transformData(data, function(dayArray){
					res.render('results', {"dayArray" : dayArray});
				});
			});
		});
	

		server.listen(httpPort);
		
		console.log('Ready to Go!');
	}

})();