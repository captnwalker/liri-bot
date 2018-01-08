require("dotenv").config();

//vars
var keys = require("./keys.js");
var fs = require("fs");
var request = require("request");
var Twitter = require("twitter");
var spotify = require("node-spotify-api");
//creates log.txt file
var filename = './log.txt';
//NPM module used to write output to console and log.txt simulatneously
var log = require('simple-node-logger').createSimpleFileLogger( filename );
log.setLevel('all');

//input template
console.log("Possible commands are: my-tweets , spotify-this-song , movie-this , do-what-it-says");

//argv[2] chooses users actions; argv[3] is input parameter, ie; movie title
var userCommand = process.argv[2];
var secondCommand = process.argv[3];

//concatenate multiple words in 2nd user argument
for (var i = 4; i < process.argv.length; i++) {
    secondCommand += '+' + process.argv[i];
}

//Switch command
function mySwitch(userCommand) {

    //choose which statement (userCommand) to switch to and execute
    switch (userCommand) {

        case "my-tweets":
            getTweets();
            break;

        case "spotify-this-song":
            getSpotify();
            break;

        case "movie-this":
            getMovie();
            break;

        case "do-what-it-says":
            doWhat();
            break;
    }

    //Twitter - command: my-tweets
    function getTweets() {
        //Fetch Twitter Keys
        var client = new Twitter(keys.twitter);
        //Set my account to pull Tweets from
        var screenName = { screen_name: 'captnwalker' };
        //GET tweets
        client.get('statuses/user_timeline', screenName, function (error, tweets, response) {
            //throw error
            if (error) throw error;

            //Loop and Log first 20 tweets
            for (var i = 0; i < tweets.length; i++) {
                var date = tweets[i].created_at;
                logOutput("@captnwalker: " + tweets[i].text + " Created At: " + date.substring(0, 19));
                //seperator
                logOutput("-----------------------");
            }
        });
    }

    //OMDB Movie - command: movie-this
    function getMovie() {
        // OMDB Movie - this MOVIE base code is from class files, I have modified for more data and assigned parse.body to a Var
        var movieName = secondCommand;
        // Then run a request to the OMDB API with the movie specified
        // var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes=true&apikey=trilogy";
        var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&tomatoes=true&apikey=trilogy";
        request(queryUrl, function (error, response, body) {

            // If the request is successful = 200
            if (!error && response.statusCode === 200) {
                var body = JSON.parse(body);
                
                //I added addtional fields below to log each data point
                // console.log('================ Movie Info ================');
                // console.log("Title: " + body.Title);
                // console.log("Release Year: " + body.Year);
                // console.log("IMdB Rating: " + body.imdbRating);
                // console.log("Country: " + body.Country);
                // console.log("Language: " + body.Language);
                // console.log("Plot: " + body.Plot);
                // console.log("Actors: " + body.Actors);
                // console.log("Rotten Tomatoes Rating: " + body.Ratings[2].Value);
                // console.log("Rotten Tomatoes URL: " + body.tomatoURL);             
                // console.log('==================THE END=================');
              
                //Simultaneously output to console and log.txt via NPM simple-node-logger
                logOutput('================ Movie Info ================');
                logOutput("Title: " + body.Title);
                logOutput("Release Year: " + body.Year);
                logOutput("IMdB Rating: " + body.imdbRating);
                logOutput("Country: " + body.Country);
                logOutput("Language: " + body.Language);
                logOutput("Plot: " + body.Plot);
                logOutput("Actors: " + body.Actors);
                logOutput("Rotten Tomatoes Rating: " + body.Ratings[2].Value);  
                logOutput("Rotten Tomatoes URL: " + body.tomatoURL);              
                logOutput('==================THE END=================');


            } else {
                //else - throw error
                console.log("Error occurred.")
            }
            //Response if user does not type in a movie title
            if (movieName === "Mr. Nobody") {
                console.log("-----------------------");
                console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
                console.log("It's on Netflix!");
            }
        });
    }

    //Function for command do-what-it-says; reads and splits random.txt file
    //command: do-what-it-says
    function doWhat() {
        //Read random.txt file
        fs.readFile("random.txt", "utf8", function (error, data) {
            if (!error);
            console.log(data.toString());
            //split text with comma delimiter
            var cmds = data.toString().split(',');
        });
    }
}

// Fetch Spotify Keys
var spotify = new spotify(keys.spotify);

//Spotify - command: spotify-this-song
function getSpotify(secondCommand) {

    //Search Spotify for song and track
    spotify.search({ type: 'track', query: secondCommand }, function (error, data) {
        //if error throw error
        if (!error) {
            for (var i = 0; i < data.tracks.items.length; i++) {
                //Set var to return song data
                var songInfo = data.tracks.items[i];
                //Return Artist
                console.log("Artist: " + songInfo.artists[0].name);
                //Return name of Song
                console.log("Song: " + songInfo.name);
                //Return preview link URL
                console.log("Preview URL: " + songInfo.preview_url);
                //Return name of Album
                console.log("Album: " + songInfo.album.name);
                //Seperator
                console.log("-----------------------");
            }
        }
    });
}

//Simulatenously logs output to the console and to a text file
function logOutput(logText) {
	log.info(logText);
	console.log(logText);
}

//Call mySwitch function
mySwitch(userCommand);
