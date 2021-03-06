'use strict';

// Weather Example
// See https://wit.ai/sungkim/weather/stories and https://wit.ai/docs/quickstart
const Wit = require('node-wit').Wit;
const FB = require('./facebook.js');
const Config = require('./const.js');

const firstEntityValue = (entities, entity) => {
  const val = entities && entities[entity] &&
    Array.isArray(entities[entity]) &&
    entities[entity].length > 0 &&
    entities[entity][0].value;
  if (!val) {
    return null;
  }
  return typeof val === 'object' ? val.value : val;
};

// Bot actions
const actions = {
  say(sessionId, context, message, cb) {
    console.log(message);

    // Bot testing mode, run cb() and return
    if (require.main === module) {
      cb();
      return;
    }

    // Our bot has something to say!
    // Let's retrieve the Facebook user whose session belongs to from context
    // TODO: need to get Facebook user name
    const recipientId = context._fbid_;
    if (recipientId) {
      // Yay, we found our recipient!
      // Let's forward our bot response to her.
      FB.fbMessage(recipientId, message, (err, data) => {
        if (err) {
          console.log(
            'Oops! An error occurred while forwarding the response to',
            recipientId,
            ':',
            err
          );
        }

        // Let's give the wheel back to our bot
        cb();
      });
    } else {
      console.log('Oops! Couldn\'t find user in context:', context);
      // Giving the wheel back to our bot
      cb();
    }
  },
  merge(sessionId, context, entities, message, cb) {
    // Retrieve the location entity and store it into a context field
    const age = firstEntityValue(entities, 'age_of_person');
    if (age) {
      context.age = age; // store it in context
    }

    cb(context);
  },

  error(sessionId, context, error) {
    console.log("hello");
    console.log(error.message);
  },

  // fetch-weather bot executes
  ['fetch-age'](sessionId, context, cb) {
    
    //aqui eu posso fazer alguma chamada de API();
    const newAge = context.age; 
    context.forecast = "Você ainda está na flor da idade hehe com " + newAge + "." ;
    cb(context);
  },
    ['fetch-weathers'](sessionId, context, cb) {
    // Here should go the api call, e.g.:
    // context.forecast = apiCall(context.loc)
    context.forecast = console.age;
    cb(context);
  },
};


const getWit = () => {
  return new Wit(Config.WIT_TOKEN, actions);
};

exports.getWit = getWit;

// bot testing mode
// http://stackoverflow.com/questions/6398196
if (require.main === module) {
  console.log("Bot testing mode.");
  const client = getWit();
  client.interactive();
}


//pageAccessToken
//EAACTrOexprUBAOlGZBi4Gte1tZA6qNWjZB3yYccMYsZCWF1ymF01krih0MZBjkmTtSZBFVlMxOZBmMiBUeiSc7jsvqmRxN8DPiTbpzJbuUgcOLXcHMK4fDpKW5Dl2Hy9voFnriZAeXLZB6DhZC1GS5QVuK9vgLqx9wZAlCTKBfQTASLAgZDZD
//EAACTrOexprUBAAxERJC3xFtUOkxWTkcMHPNWQTgLWQxM33OdhE3n6U7PGiejKIINI9o6Ps8JVYafdWS7KJ894VTngfj9iYZAde1QuZA3GStrASrHoGLAmDSwSSE3vNVrKXOqHDoZAAZBRz8tL9ffuYfZBZAzZAbgVQk6tvoSqASGgZDZD


//url -X POST "https://graph.facebook.com/v2.6/me/subscribed_apps?access_token=EAACTrOexprUBAAxERJC3xFtUOkxWTkcMHPNWQTgLWQxM33OdhE3n6U7PGiejKIINI9o6Ps8JVYafdWS7KJ894VTngfj9iYZAde1QuZA3GStrASrHoGLAmDSwSSE3vNVrKXOqHDoZAAZBRz8tL9ffuYfZBZAzZAbgVQk6tvoSqASGgZDZD"



//SHA256:Rzj5kwNZTIs2NKwEJavW7LHJIuF2QWDRuEAXZVO8aYE souza.ufrgs@gmail.com