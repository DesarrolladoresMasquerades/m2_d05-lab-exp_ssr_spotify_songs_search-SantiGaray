require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');

const app = express();

// app.use(express.json());
// app.use(express.urlencoded());

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });

// Retrieve an access token
spotifyApi
  .clientCredentialsGrant()
  .then(data => spotifyApi.setAccessToken(data.body['access_token']))
  .catch(error => console.log('Something went wrong when retrieving an access token', error));  

// Our routes go here:

app.get("/",(req, res)=> res.render("home") )

app.get("/artist-search",(req, res)=> {

spotifyApi

  .searchArtists(req.query.searchString)
  .then(data => {
    //console.log('The received data from the API: ', data.body.artists.items[0]);    
    
    res.render("artist-search-results", {artist: data.body.artists.items}  )

    //console.log(data.body.artists.items[0].images[0])
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
})


app.get('/albums/:id', (req, res) => {
	const id = req.params.id;
    
    spotifyApi
    .getArtistAlbums(id)
    .then((data) => {
        console.log('la datita',data)
            res.render('albums', {albums: data.body.items} );
            console.log('albums',data.body.items[1])
    })
    .catch((err) => console.log(err));

});


app.get('/tracks/:idTrack', (req, res) => {
	const idTrack = req.params.idTrack;
    
    spotifyApi
    .getAlbumTracks(idTrack)
    .then((data) => {
        console.log('tracks data' ,data)
            res.render('tracks', {tracks: data.body.items} );

            console.log('tracks', tracks)
    })
    .catch((err) => console.log(err));

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));
