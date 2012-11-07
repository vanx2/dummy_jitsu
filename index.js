var request = require('request')
  , cheerio = require('cheerio')
  , oauth = require('./oauth')
  , twitter = require('twitter')
  , CronJob = require('cron').CronJob;
  ;

function get_html(URL, cb) {
  request(URL, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      cb(error, body);
    }
  });
}

function scrape(body) {
  var exists = '販売中';
  $ = cheerio.load(body);
  var stats = $('[name=event0Status]');
  var fest = stats[0].attribs.value;
  var party = stats[1].attribs.value;

  fest  = (fest === exists);
  party = (party === exists);
  return { fest: fest, party: party };
}

function tweet_message(stats) {
  var message = [];
  if(stats.fest) {
/*
    message.push('学園祭のチケットに空きがでています!');
    message.push('キャンセル待ちをされている方はこちらからどうぞ!!');
    message.push('http://atnd.org/event/Nodefest2012');
    message.push('#nodefest');
*/
    message.push('Dummy jitsu!');
  }
  return message.join('\n');
}

function tweets(stats) {
  var message = tweet_message(stats);
  console.log(message);

  var bot = new twitter(oauth);

  bot.updateStatus(message, function (data) {
    console.log(data);
  });
}

function main() {
  var URL = "http://atnd.org/event/Nodefest2012";
  get_html(URL, function(err, body) {
    var stats = scrape(body);
    if (stats.fest) tweets(stats);
  });
}

function cron(interval) {
  var cronJob = CronJob;

  var job = new cronJob({
    cronTime: interval,
    onTick: main,
    start: true
  });

  job.start();
}

// test
// every 1 sec
var interval = "* * * * * *";

// every 15 minutes
//var interval = "*/15 * * * *";

cron(interval);
