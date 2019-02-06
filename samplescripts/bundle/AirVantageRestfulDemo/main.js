/**
 * http://usejsdoc.org/
 */

//var inputval = {};

var accessTokenData = {
		AccessTokenURL : "",
		Username : "",
		Password : "",
		ClientID : "",
		ClientSecret : ""
};


getInputEvent(function( data ) {
	logger.norm('Response: ' + querystring.stringify(data));

	if(data.valid) {
		switch(data.input) {
		case 'AccessTokenURL':
			accessTokenData.AccessTokenURL = data.value;
			break;
		case 'Username':
			accessTokenData.Username = data.value;
			break;
		case 'Password':
			accessTokenData.Password = data.value;
			break;
		case 'ClientID':
			accessTokenData.ClientID = data.value;
			break;
		case 'ClientSecret':
			accessTokenData.ClientSecret = data.value;
			break;
		}
		updateTextIO("TokenURL", accessTokenData.AccessTokenURL + '?grant_type=password&username=' + accessTokenData.Username + '&password=' + accessTokenData.Password + '&client_id=' + accessTokenData.ClientID + '&client_secret=' + accessTokenData.ClientSecret); 
	}
});






var post_data = querystring.stringify({ test: "sometest" });

// An object of options to indicate where to post to
var post_options = {
		host: 'postman-echo.com',
		port: '443',
		path: '/post',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'Content-Length': Buffer.byteLength(post_data)
		}
};




getButtonEvent(function( data ) {
	switch(data.input) {
	case 'btnGetToken':
		/*				// Set up the request
					  var post_req = https.request(post_options, function(res) {
					      res.setEncoding('utf8');
					      res.on('data', function (chunk) {
					          logger.norm('Response: ' + chunk);
					      });
					  });

					  // post the data

					  post_req.write(post_data);
					  post_req.end(); */
		break;
	}

});

getInputVal('AccessTokenURL');
getInputVal('Username');
getInputVal('Password');
getInputVal('ClientID');
getInputVal('ClientSecret');
