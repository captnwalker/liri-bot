require("dotenv").config();


//vars for keys given in instructions: spotify conflict between `require` and `keys` - have to comment out spotify'keys' to prevent error
//var spotify = new Spotify(keys.spotify);
// var client = new Twitter(keys.twitter);


//vars
var keys = require('./keys.js');
var fs = require('fs');
var request = require("request");
var twitter = require("twitter");
var spotify = require("node-spotify-api");



//input template
console.log("Type my-tweets , spotify-this-song , movie-this , or do-what-it-says to get started!");

//argv[2] chooses users actions; argv[3] is input parameter, ie; movie title
var userCommand = process.argv[2];
var secondCommand = process.argv[3];

//concatenate multiple words in 2nd user argument
for (var i = 4; i < process.argv.length; i++) {
    secondCommand += '+' + process.argv[i];
}

function mySwitch() {
    //choose witch statement (user command) to switch to and execute
    switch (userCommand) {

        case 'my-tweets':
            getTweets();
            break;

        case 'spotify-this-song':
            getSpotify();
            break;

        case 'movie-this':
            getMovie();
            break;

        case 'do-what-it-says':
            doWhat();
            break;
    }
};

//Twitter
function getTweets() {
    //function to display my last 20 Tweets
    //Vars
    var client = new Twitter(keys.twitter);
    var screenName = { screen_name: 'captnwalker' };
    //GET tweets
    client.get('statuses/user_timeline', screenName, function (error, tweets, response) {
        if (!error) {
            //Loop and Log first 20 tweets
            for (var i = 0; i < tweets.length; i++) {
                var date = tweets[i].created_at;
                console.log("@captnwalker: " + tweets[i].text + " Created At: " + date.substring(0, 19));
                console.log("-----------------------");
            }
        }
    });
}

function getMovie() {
// OMDB Movie - this MOVIE base code is from class files, I have modified for more data and assigned parse.body to a Var
var movieName = secondCommand;
// Then run a request to the OMDB API with the movie specified
var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&tomatoes&apikey=trilogy";

// This line is just to help us debug against the actual URL.
console.log(queryUrl);

request(queryUrl, function (error, response, body) {

    // If the request is successful
    if (!error && response.statusCode === 200) {
        var body = JSON.parse(body);
        // Parse the body of the site and recover just the imdbRating
        // (Note: The syntax below for parsing isn't obvious. Just spend a few moments dissecting it).
        //I added addtional fields below
        console.log("Title: " + body.Title);
        console.log("Release Year: " + body.Year);
        console.log("IMdB Rating: " + body.imdbRating);
        console.log("Country: " + body.Country);
        console.log("Language: " + body.Language);
        console.log("Plot: " + body.Plot);
        console.log("Actors: " + body.Actors);
        console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
        console.log("Rotten Tomatoes URL: " + body.tomatoURL);


    } else {
        console.log('Error occurred.')
    }
    if (movieName === "Mr. Nobody") {
        console.log("-----------------------");
        console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
        console.log("It's on Netflix!");
    }
});
}

//Function for command do-what-it-says; reads and splits random.txt file
function doWhat(){
    fs.readFile('random.txt', "utf8", function(error, data){
      var txt = data.split(',');
  
      spotifySong(txt[1]);
    });
  }