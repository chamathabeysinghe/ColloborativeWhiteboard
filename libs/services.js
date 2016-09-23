/**
 * Created by bhanuka on 9/22/16.
 */

var request = require('request');

request.debug = true;

var EntityLinking = function(){

    var apiKey =  '32aedaafec144d49b791910d13963a6e';

    var Url = 'https://api.projectoxford.ai/entitylinking/v1.0/link'

    EntityLinking.prototype.find = function(text){

        request(
            {
            url: Url,
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
                'Ocp-Apim-Subscription-Key': apiKey
            },
                body: text
            },
            function(error, response, body) {
                if (error) {

                    return error;

                } else {

                    return {
                        response: response,
                        body: body
                    }

                }
            });
    }
}


var NewsSearch = function(){

    var apiKey = 'fee561f616bf409cb7c39bedf29426ab';

    var Url = 'https://api.cognitive.microsoft.com/bing/v5.0/news/?q=';

    NewsSearch.prototype.search = function(text){
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
                    console.log(error);
                    return error;
                } else {
                    console.log(response.statusCode, body);
                    return {
                        response: response,
                        body: body
                    }
                }
            });

    }

}

var WebSearch = function(){

    var apiKey = 'fee561f616bf409cb7c39bedf29426ab';

    var Url = 'https://api.cognitive.microsoft.com/bing/v5.0/search?q=';

    WebSearch.prototype.search = function(text){
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
                    console.log(error);
                    return error;
                } else {
                    console.log(response.statusCode, body);
                    return {
                        response: response,
                        body: body
                    }
                }
            });
    }

}

exports.EntityLinking = EntityLinking;
exports.WebSearch = WebSearch;
exports.NewsSearch = NewsSearch;

/*

var testing = new EntityLinking();
testing.log('Prime Minister Ranil Wickremesinghe on Monday said that Sri Lanka has failed to reap the maximum benefits from the economic concept introduced by late President J.R.Jayewardene.He said that the present government will strive towards bringing these benefits to the country.' +
    'The Prime Minister added that President Jayewardene wanted to keep socialism till the open economy was fully introduced to the country.' +
    'Until then, he said that he would introduce Free Trade Zones. Six electorates in the Gampaha district were set apart for such economic zones,”the Prime Minister said.' +
    'Prime Minister Wickremesinghe said that the former President brought foreign investment to the country and introduced an open economic policy.' +
    'Prime Minister Wickremesinghe was speaking at the 110th birth anniversary commemoration of former President J. R.Jayewardene held at the J.R.Jayewardene Centre on Monday evening')

var testing = new NewsSearch();
testing.search('billl');

*/