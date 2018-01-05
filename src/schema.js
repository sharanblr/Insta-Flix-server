import { makeExecutableSchema } from 'graphql-tools';
import resolvers from './resolvers';
const typeDefs = `
type Movie {
  name : String,
  certificate : String,
  imageSource : String,
  description : String,
  director : [String],
  cast : [String],
  runtime : Int
}

type Show {
  screenNumber : Int,
  movieStartTime : Int,
  movie : Movie,
}

type Theatre {
  name : String,
  latitude : Float,
  longitude : Float,
  shows : [Show]
}

type Query {
  getTheatres(languages : [String], startTime: Int) : [Theatre]
}
`;

export default makeExecutableSchema({ typeDefs, resolvers });
