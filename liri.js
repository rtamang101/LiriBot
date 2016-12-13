//dependencies
var Twitter = require('twitter');
var Spotify = require('spotify');
var inquirer = require('inquirer');
var keys = require('./keys.js');
var request = require('request');
var fs = require('fs');

inquirer.prompt([
	{
		name: "choices",
		message: "Welcome, I'm LiRiBoT! Please choose an action!",
		choices: ['my-tweets', 'spotify-this-song', 'movie-this', 'do-what-it-says'],
		type: "list"
	}
]).then(function(command){
	if(command.choices == "my-tweets"){
		twitter();
	}else if(command.choices == "spotify-this-song"){
		spotify();
	}else if(command.choices == "movie-this"){
		movie();
	}else if(command.choices == "do-what-it-says"){
		doWhat();
	}else{
		console.log(err);
	}
	

});

function twitter(){

	var client = new Twitter({
		  consumer_key: keys.twitterKeys.consumer_key,
		  consumer_secret: keys.twitterKeys.consumer_secret,
		  access_token_key: keys.twitterKeys.access_token_key,
		  access_token_secret: keys.twitterKeys.access_token_secret
	});
	var params = {screen_name: 'PerfctStranger'};
	client.get("statuses/user_timeline", params, function(error, tweets, response){
		if(!error){
			var allTweets = 20;
			console.log("**********************************");
			for(i=0; i<allTweets; i++){
				console.log("====== Tweet #"+ (i+1)+"======");
				console.log('Tweet: '+ tweets[i].text);
				console.log('Created on: '+tweets[i].created_at);
			}
			console.log("**********************************");
		}else{
			console.log(error);
		}
		
	});
}

var song;


function spotify(){
	inquirer.prompt([
		{
			name: 'songName',
			message: 'Enter a song Name',
			type: 'input'
		}

		]).then(function(track){
			if(track.songName == ''){
				song = 'The Sign';
				spotifySongFunction(song);
					
			}else{
				song = track.songName;
				spotifySongFunction(song);
			}

		});

}

function movie(){

	inquirer.prompt([
		{
			name: 'movieName',
			message: 'Enter a movie Name',
			type: 'input'
		}

		]).then(function(film){
			var movieQuery = film.movieName;
			
			if (movieQuery == ""){
				movieQuery = "Mr. Nobody";

				request('http://www.omdbapi.com/?t=' + movieQuery + '&tomatoes=true&r=json', function (error, response, body) {
				if (!error && response.statusCode == 200) {
					var info = JSON.parse(body);
					console.log('Title: ' + info.Title);
					console.log('Year: ' + info.Year);
					console.log('IMDB Rating: ' + info.imdbRating);
					console.log('Country: ' + info.Country);
					console.log('Plot: ' + info.Plot);
					console.log('Actors: ' + info.Actors);
					console.log('Rotten Tomatoes Rating: ' + info.tomatoRating);
					console.log('Rotten Tomatoes URL: ' + info.tomatoURL);
				}else{
					console.log(error);
				}
			});	

			}else{
				request('http://www.omdbapi.com/?t=' + movieQuery + '&tomatoes=true&r=json', function (error, response, body) {
				if (!error && response.statusCode == 200) {
					var info = JSON.parse(body);
					console.log('Title: ' + info.Title);
					console.log('Year: ' + info.Year);
					console.log('IMDB Rating: ' + info.imdbRating);
					console.log('Country: ' + info.Country);
					console.log('Plot: ' + info.Plot);
					console.log('Actors: ' + info.Actors);
					console.log('Rotten Tomatoes Rating: ' + info.tomatoRating);
					console.log('Rotten Tomatoes URL: ' + info.tomatoURL);
				}else{
					console.log(error);
				}
			});	
			}
			

		});

}

function doWhat(){
	fs.readFile("random.txt", "utf8", function(err, res){
		var command = res.split(',');
		if(command[0]=='my-tweets'){
			twitter();
		}else if(command[0]=='spotify-this-song'){
			song = command[1];
			spotifySongFunction(song);
		}else if(command[0]=='movie-this'){
			movie = command[1];
			movie();
		}


	});
}

function spotifySongFunction(song){
	Spotify.search({type:'track', query: song }, function(err, data){
					if(!err){
						console.log("Artist name: "+data.tracks.items[0].artists[0].name);
						console.log("Song Name: "+data.tracks.items[0].name);
						console.log("Album Name: "+data.tracks.items[0].album.name);
						console.log("Preview URL: "+data.tracks.items[0].preview_url)
					}else{
						console.log(err);
					}
	});
}