'use strict';

angular.module('converse.konnichiwa', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/', {
    templateUrl: 'konnichiwa/konnichiwa.html',
    controller: 'KonnichiwaController'
  });
}])
.directive('respond', function () {
  return function (scope, element, attrs) {
    element.bind("keydown keypress", function (event) {
      if(event.which === 13) {
        scope.$apply(function (){
          scope.$eval(attrs.respond);
        });

        event.preventDefault();
      }
    });
  };
})

.controller('KonnichiwaController', function($scope) {
  var controller = this;
  controller.response = "";
  controller.suggestions = [];
  controller.phrase_index = {};
  controller.segue_list = [];
  controller.show_translations = true;
  controller.show_suggestions = true;
  controller.chat_transcript = [];

  controller.createPhraseIndex = function(){
    controller.phrase_index = [];
    _.forOwn(controller.phrases, function(phrases, key){
      // loop through all the phrase sections
      _.each(phrases, function(phrase, index){
        // create an index for each individual phrase
        controller.phrase_index[phrase.text] = (key + "-"+ index);
        // create an index for alternative text as well (kanji or hiragana)
        _.each(phrase.alternative_text, function(alternative_text){
          controller.phrase_index[alternative_text] = (key + "-"+ index);
        });
      });
    });
  };

  controller.createSegueList = function(){
    controller.segue_list = [];
    _.forOwn(controller.phrases, function(phrases, key){
      // loop through all the phrase sections
      _.each(phrases, function(phrase, index){
        if(phrase.type == 'prompt' && phrase.text != '' && phrase.usage < phrase.max_usage ){
          controller.segue_list.push(phrase);
        }
      });
    });
  };

  controller.phrases = {
    passive: [
      {
        // silence is golden
        type: "prompt",
        text:"",
        translation: "",
        alternative_text: [],
        acceptable_segues: [],
        acceptable_responses: [],
        max_usage: null,
        usage: 0
      }
    ],
    interruptions: [
      {
        type: "prompt",
        text:"あなたは",
        translation: "you?",
        alternative_text: [],
        acceptable_segues: [],
        acceptable_responses: ["greetings-1","greetings-2"],
        max_usage: null,
        usage: 0
      }
    ],
    greetings: [
      {
        id: "greetings-0",
        type: "prompt",
        text:"元気ですか",
        translation: "how are you?",
        alternative_text: ["げんきですか"],
        acceptable_segues: [],
        acceptable_responses: ["greetings-1","greetings-2"],
        max_usage: 1,
        usage: 0
      },
      {
        id: "greetings-1",
        type: "response",
        text:"元気です",
        translation: "I'm well.",
        alternative_text: ["元気", "げんき", "げんきです"],
        acceptable_segues: ["interruptions-0"],
        acceptable_responses: [],
        max_usage: 1,
        usage: 0
      },
      {
        id: "greetings-2",
        type: "response",
        text:"いいです",
        translation: "I'm good.",
        alternative_text: [],
        acceptable_segues: [],
        acceptable_responses: [],
        max_usage: null,
        usage: 0
      },
      {
        id: "greetings-3",
        type: "prompt",
        text:"こんにちは",
        translation: "hello",
        alternative_text: [],
        acceptable_segues: [],
        acceptable_responses: ["greetings-3"],
        max_usage: 1,
        usage: 0
      }
    ],
    pleasantries: [
      {
        id: "pleasantries-0",
        type: "response",
        text:"そうです",
        translation: "so it is.",
        alternative_text: [],
        acceptable_segues: [],
        acceptable_responses: [],
        max_usage: null,
        usage: 0
      },
      {
        id: "pleasantries-1",
        type: "response",
        text:"ありがとう",
        translation: "Thank you.",
        alternative_text: [],
        acceptable_segues: [],
        acceptable_responses: [],
        max_usage: null,
        usage: 0
      },
      {
        id: "pleasantries-2",
        type: "response",
        text:"わかりません",
        translation: "I don't understand.",
        alternative_text: [],
        acceptable_segues: ["passive-0"],
        acceptable_responses: [],
        max_usage: null,
        usage: 0
      },
      {
        id: "pleasantries-3",
        type: "response",
        text:"そうですか",
        translation: "I see! Is that so?",
        alternative_text: [],
        acceptable_segues: [],
        acceptable_responses: [],
        max_usage: null,
        usage: 0
      }
    ],
    small_talk: [
      {
        id: "small_talk-0",
        type: "prompt",
        text:"お天気ですか",
        translation: "How is the weather?",
        alternative_text: ["おてんきですか"],
        acceptable_segues: [],
        acceptable_responses: ["small_talk-1","small_talk-2"],
        max_usage: 1,
        usage: 0
      },
      {
        id: "small_talk-1",
        type: "response",
        text:"暑いです",
        translation: "It's hot.",
        alternative_text: ["あついです"],
        acceptable_segues: [],
        acceptable_responses: ["pleasantries-3"],
        max_usage: null,
        usage: 0
      },
      {
        id: "small_talk-2",
        type: "response",
        text:"暖かいです",
        translation: "It's warm.",
        alternative_text: ["あたたかいです"],
        acceptable_segues: [],
        acceptable_responses: ["pleasantries-3"],
        max_usage: null,
        usage: 0
      }
    ],
    home_life: [
      {
        id: "home_life-0",
        type: "prompt",
        text:"いっらしゃい",
        translation: "Welcome (..to my home)",
        alternative_text: [],
        acceptable_segues: [],
        acceptable_responses: ["greetings-3"],
        max_usage: 1,
        usage: 0
      },
      {
        id: "home_life-1",
        type: "prompt",
        text:"いってきます",
        translation: "I'm leaving (and will return).",
        alternative_text: ["行ってきます"],
        acceptable_segues: [],
        acceptable_responses: ["home_life-2"],
        max_usage: 0,
        usage: 0
      },
      {
        id: "home_life-2",
        type: "response",
        text:"いってらっしゃい",
        translation: "See you later (go and come back).",
        alternative_text: ["行ってらっしゃい"],
        acceptable_segues: [],
        acceptable_responses: ["home_life-1"],
        max_usage: 1,
        usage: 0
      },
      {
        id: "home_life-3",
        type: "prompt",
        text:"ただいま",
        translation: "I'm back!",
        alternative_text: [],
        acceptable_segues: [],
        acceptable_responses: ["home_life-4"],
        max_usage: 1,
        usage: 0
      },
      {
        id: "home_life-4",
        type: "response",
        text:"おかえり",
        translation: "Welcome back.",
        alternative_text: [],
        acceptable_segues: ["greetings-0"],
        acceptable_responses: [],
        max_usage: 1,
        usage: 0
      }
    ]
  };

  controller.suggestionClicked = function(index, phrase){
     if (phrase.usage + 1 == phrase.max_usage){
       controller.segue_list.splice(index, 1);
     }
  };

  controller.selectGreeting = function(){
    _.each(controller.phrases.home_life, function(greeting){
      if ( greeting.type == "prompt" ){
        controller.respondWith(greeting);
        return false;
      }
    })
  };

  controller.showAvailableSegues = function(response){
    controller.suggestions = [];
    _.each(response.acceptable_segues, function(segue){
      var phrase_path = segue.split("-");
      var phrase = controller.phrases[phrase_path[0]][phrase_path[1]];
      if ( phrase.max_usage == null || phrase.usage < phrase.max_usage ){
        controller.suggestions.push(phrase);
      }
    })
  };

  controller.showAvailableResponses = function(){
    controller.suggestions = [];
    _.each(controller.prompt.acceptable_responses, function(segue){
      var phrase_path = segue.split("-");
      var phrase = controller.phrases[phrase_path[0]][phrase_path[1]];
      if ( phrase.max_usage == null || phrase.usage < phrase.max_usage ){
        controller.suggestions.push(phrase);
      }
    })
  };

  controller.identifyUserResponse = function(){
    var response = null;
    _.each(controller.prompt.acceptable_responses, function(acceptable_response){
      var phrase_path = acceptable_response.split("-");
      var phrase = controller.phrases[phrase_path[0]][phrase_path[1]];
      if ( controller.response == phrase.text ) {
        response = phrase;
      }
    });
    if ( response === null ){
      _.each(controller.suggestions, function(suggestion){
        if ( controller.response == suggestion.text ) {
          response = suggestion;
        }
      })
    }

    return response;
  };

  controller.respondWith = function(phrase){
    if ( phrase === null || phrase == "" ){
      controller.prompt = "";
    }else{
      phrase.usage += 1;
      controller.prompt = phrase;
      controller.chat_transcript.unshift({ actor: 'computer', phrase: phrase });
    }
  };

  controller.clearUserResponse = function(){
    controller.response = "";
  };

  controller.chooseAcceptableComputerResponse = function(user_message){
    // TODO: get random response

    console.log("Response: "+JSON.stringify(user_message.acceptable_responses[0]));
    var phrase_path = user_message.acceptable_responses[0].split("-");
    var phrase = controller.phrases[phrase_path[0]][phrase_path[1]];
    if ( phrase.max_usage === null || phrase.usage < phrase.max_usage ){
      controller.respondWith(phrase);
      controller.showAvailableResponses(user_message);
    }else{
      console.log( "overuse 1" );
    }
  };

  controller.determineAcceptableUserSegue = function(user_message){
    console.log("Segue available");
    controller.respondWith(null);
    controller.showAvailableSegues(user_message);
  };

  controller.computerDoesNotUnderstand = function(){
    controller.prompt = controller.phrases.pleasantries[2];
    controller.prompt.usage += 1;
    controller.showAvailableSegues(controller.prompt);
  };

  controller.findPhraseByKey = function(key){
    var phrase_path = key.split("-");
    return controller.phrases[phrase_path[0]][phrase_path[1]];
  };

  controller.respond = function() {
    var user_response = controller.identifyUserResponse();

    //console.log("Response: "+JSON.stringify(user_response));
    // if response is not NULL then we matched a proper response
    if ( user_response ) {
      controller.chat_transcript.unshift({ actor: 'user', phrase: user_response });

      if( user_response.acceptable_responses.length > 0 ){
        // if user's response has possible computer responses
        controller.chooseAcceptableComputerResponse(user_response);
      }else{
        // if a user's response has no possible computer responses, is there a segue?
        controller.determineAcceptableUserSegue(user_response);
      }
    }else{
      // This was not an expected response

      if ( controller.phrase_index[controller.response] ) {

        // This phrase exists in the system

        var user_segue_key = controller.phrase_index[controller.response];
        var user_phrase = controller.findPhraseByKey(user_segue_key);
        controller.chat_transcript.unshift({ actor: 'user', phrase: user_phrase });

        // TODO: make this random
        var computer_response = user_phrase.acceptable_responses[0];
        if( computer_response ){
          var phrase = controller.findPhraseByKey(computer_response);
          if ( phrase.max_usage === null || phrase.usage < phrase.max_usage ){
            controller.respondWith(phrase);
            controller.showAvailableResponses(phrase);

          }else{
            controller.respondWith(null);
            console.log( "overuse 2" );
          }
        }else{
          console.log( "Nothing to say.." );
          controller.respondWith(null);
        }

      }else{
        // Otherwise "we don't understand"
        console.log("No response");
        controller.computerDoesNotUnderstand();
      }
    }
    controller.clearUserResponse();
  };

  controller.reset = function() {
    controller.chat_transcript = [];
    controller.createPhraseIndex();
    controller.selectGreeting();
    controller.createSegueList();
    controller.showAvailableResponses(controller.prompt);
    controller.clearUserResponse();
  };


  controller.reset();

});
