import { Movies, Theatres, Screens } from './index';

const roundUpDigits = n => {
  if (parseInt(n / 10) === 0) {
    return `0${n}`;
  } else return n;
};
let movies = null,
  screens = null;
export default {
  Query: {
    getTheatres: async (root, args) => {
      movies = null;
      screens = null;
      if (args.languages && args.languages.length > 0 && args.startTime) {
        const m = args.startTime % 100;
        const h = args.startTime / 100;
        let time = new Date();
        let time2 = new Date();
        time.setHours(time.getHours() + h);
        time.setMinutes(time.getMinutes() + m);
        movies = await Movies.find({ language: { $in: args.languages } });
        let timeH = null,
          timeM = null,
          time2H = null,
          time2M = null;
        time2H = time2.getHours();
        time2M = roundUpDigits(time2.getMinutes());
        timeH = time.getHours();
        timeM = roundUpDigits(time.getMinutes());
        screens = await Screens.aggregate([
          {
            $match: {
              movieID: { $in: movies.map(i => i._id) },
            },
          },
          {
            $project: {
              timeOfMovieStart: {
                $filter: {
                  input: '$timeOfMovieStart',
                  as: 'time',
                  cond: {
                    $and: [
                      {
                        $gt: ['$$time', parseInt(`${time2H}${time2M}`)],
                      },
                      {
                        $lte: ['$$time', parseInt(`${timeH}${timeM}`)],
                      },
                    ],
                  },
                },
              },
              screenNumber: 1,
              movieID: 1,
              theatreID: 1,
            },
          },
        ]);
      } else if (args.languages && args.languages.length > 0) {
        movies = await Movies.find({ language: { $in: args.languages } });
        screens = await Screens.find({
          movieID: { $in: movies.map(i => i._id) },
        });
      } else if (args.startTime) {
        const m = args.startTime % 100;
        const h = args.startTime / 100;
        let time = new Date();
        let time2 = new Date();
        time.setHours(time.getHours() + h);
        time.setMinutes(time.getMinutes() + m);
        let timeH = null,
          timeM = null,
          time2H = null,
          time2M = null;
        time2H = time2.getHours();
        time2M = roundUpDigits(time2.getMinutes());
        timeH = time.getHours();
        timeM = roundUpDigits(time.getMinutes());
        movies = await Movies.find({});
        screens = await Screens.aggregate([
          {
            $match: {
              movieID: { $in: movies.map(i => i._id) },
            },
          },
          {
            $project: {
              timeOfMovieStart: {
                $filter: {
                  input: '$timeOfMovieStart',
                  as: 'time',
                  cond: {
                    $and: [
                      {
                        $gt: ['$$time', parseInt(`${time2H}${time2M}`)],
                      },
                      {
                        $lte: ['$$time', parseInt(`${timeH}${timeM}`)],
                      },
                    ],
                  },
                },
              },
              screenNumber: 1,
              movieID: 1,
              theatreID: 1,
            },
          },
        ]);
      } else {
        console.log('else');
        movies = await Movies.find({});
        screens = await Screens.find({
          movieID: { $in: movies.map(i => i._id) },
        });
      }
      console.log('screens', screens);
      const theatres = await Theatres.find({
        _id: {
          $in: screens.map(i => {
            if (i.timeOfMovieStart.length > 0) return i.theatreID;
            else return null;
          }),
        },
      });

      const modifiedTheatres = theatres.map(theatre => {
        const tempScreens = screens.filter(
          screen => screen.theatreID.toString() === theatre._id.toString()
        );
        const modifiedScreens = [];
        tempScreens.map(screen => {
          screen.timeOfMovieStart.map(time => {
            modifiedScreens.push({
              screenNumber: screen.screenNumber,
              theatreID: screen.theatreID,
              movieID: screen.movieID,
              movieStartTime: time,
            });
          });
        });
        const shows = modifiedScreens.map(screen => {
          return {
            screenNumber: screen.screenNumber,
            movieID: screen.movieID,
            movieStartTime: screen.movieStartTime,
          };
        });
        return Object.assign({}, theatre.toJSON(), { shows });
      });
      console.log(modifiedTheatres);
      return modifiedTheatres;
    },
  },
  Show: {
    movie: async show => {
      const movie = movies.find(movie => {
        return movie._id.toString() === show.movieID.toString();
      });
      return movie;
    },
  },
};
