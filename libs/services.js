/**
 * Created by bhanuka on 9/22/16.
 */

var request = require('request');

request.debug = true;

var EntityLinking = function(){

    var apiKey =  '32aedaafec144d49b791910d13963a6e';

    var Url = 'https://api.projectoxford.ai/entitylinking/v1.0/link'

    EntityLinking.prototype.find = function(text, callback){

        request(
            {
            url: Url,
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
                'Ocp-Apim-Subscription-Key': apiKey
            },
                body: text,
                callback: test,
            },
            function(error, response, body) {
                if (error) {
                    callback(error);

                } else {
                    callback(JSON.parse(body));
                }
            });
    }
}


var NewsSearch = function(){

    var apiKey = 'fee561f616bf409cb7c39bedf29426ab';

    var Url = 'https://api.cognitive.microsoft.com/bing/v5.0/news/?q=';

    NewsSearch.prototype.search = function(text, callback){
        request(
            {
                url: Url+ text,
                method: 'GET',
                headers: {
                    'Ocp-Apim-Subscription-Key': apiKey
                }
            },
            function(error, response, body) {
                if (error) {
                    callback(error);

                } else {
                    callback(JSON.parse(body));
                }
            });

    }

}

exports.WebSearch = function(text, callback){

    var apiKey = 'fee561f616bf409cb7c39bedf29426ab';

    var Url = 'https://api.cognitive.microsoft.com/bing/v5.0/search?q=';

    var search = function(text, callback){
        request(
            {
                url: Url+ text,
                method: 'GET',
                headers: {
                    'Ocp-Apim-Subscription-Key': apiKey
                }
            },
            function(error, response, body) {
                if (error) {
                    callback(error);

                } else {
                    callback(JSON.parse(body));
                }
            });
    }

    search(text, callback);

}

exports.EntityLinking = EntityLinking;
exports.NewsSearch = NewsSearch;

function test(data){
    console.log(data);
}


// var testing = new EntityLinking();
// var bla = testing.find('Prime Minister Ranil Wickremesinghe on Monday said that Sri Lanka has failed to reap the maximum benefits from the economic concept introduced by late President J.R.Jayewardene.He said that the present government will strive towards bringing these benefits to the country.' +
//     'The Prime Minister added that President Jayewardene wanted to keep socialism till the open economy was fully introduced to the country.' +
//     'Until then, he said that he would introduce Free Trade Zones. Six electorates in the Gampaha district were set apart for such economic zones,”the Prime Minister said.' +
//     'Prime Minister Wickremesinghe said that the former President brought foreign investment to the country and introduced an open economic policy.' +
//     'Prime Minister Wickremesinghe was speaking at the 110th birth anniversary commemoration of former President J. R.Jayewardene held at the J.R.Jayewardene Centre on Monday evening', test);



var testing = new NewsSearch();
testing.search('bill', test);


//var testing = new WebSearch();
//testing.search('bill', test);

//var testing = new NewsSearch();
//testing.search('bill');

