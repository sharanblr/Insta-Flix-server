import { Schema } from 'mongoose';

export const movieModel = mongoose =>
  mongoose.model('movies', {
    name: String,
    runtime: Number,
    description: String,
    genre: Array,
    language: String,
    certificate: String,
    director: Array,
    cast: Array,
  });

export const theatreModel = mongoose =>
  mongoose.model('movie-theatres', {
    name: String,
    latitude: Number,
    longitude: Number,
  });

export const screenModel = mongoose =>
  mongoose.model('screens', {
    screenNumber: Number,
    theatreID: Schema.Types.ObjectId,
    timeOfMovieStart: Array,
    movieID: Schema.Types.ObjectId,
  });
