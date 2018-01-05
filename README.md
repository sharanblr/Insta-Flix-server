# GraphQL Server for InstaFlix

This is a straightforward boilerplate for building REST APIs with ES6 and
Express.

* ES6 support via [babel](https://babeljs.io)
* CORS support via [cors](https://github.com/troygoode/node-cors)
* Body Parsing via [body-parser](https://github.com/expressjs/body-parser)

## Getting Started

```sh
clone the repo

cd server

# Install dependencies
npm install

# Start development live-reload server
npm run dev

# Start production server:
npm start

Go to localhost:3000/graphiql to access the graphql playground

The only query working now is getRating. To try it out, copy paste this :-

{
  getRating{
    id
    provider
    score
  }
}
```
