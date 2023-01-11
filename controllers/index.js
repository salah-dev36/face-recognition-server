const { handleSignIn } = require("./sign-in");
const { handleSignUp } = require("./sign-up");
const { recognize } = require("./recognize");
const {handleClarifai} = require("./clarifai")

module.exports = { handleSignIn, handleSignUp, recognize, handleClarifai };
