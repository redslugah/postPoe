var request = require('request');
var fs = require('fs');
var Promise = require('promise');
var url = 'https://www.pathofexile.com/api/trade/search/Legion';
var i = 0;
var createStream = fs.createWriteStream('./itembase.txt', {
	flags:'a'
});
function letsGo(body){
	return new Promise((resolve, reject)=>{
			var novaUrl = 'https://www.pathofexile.com/api/trade/fetch/' +body.result[i]+'?query='+body.id;
			//console.log(novaUrl);
			var bodyNew = body;
			request(novaUrl, (err, res, body)=>{
				if (err){
					reject('error');
					//throw err;
				}
				results = bodyNew.result;
				console.log(i);
				if (i>results.lenght){
					reject('done');
				};
				body = JSON.parse(body);
				/*
				console.log("name: " +body.result[0].listing.account["name"]);
				console.log(body.result[0].item["name"] +' '+ body.result[0].item["typeLine"]);
				console.log(body.result[0].listing.price['currency'] + ': '+ body.result[0].listing.price['amount']);
				console.log(body.result[0].listing['whisper']);
				*/
				var tradeData = {

					accountName: body.result[0].listing.account["name"],
					itemName: body.result[0].item["name"],
					itemBase: body.result[0].item["typeLine"],
					currencyType: body.result[0].listing.price['currency'],
					currencyAmount: body.result[0].listing.price['amount'],
					whisper: body.result[0].listing['whisper']
				}
				fs.readFile('./itembase.txt', 'utf-8', (err, data)=>{
					if (err){
						reject('error');
						//throw err;
					}
					//console.log(data);
					//console.log(data, '/////////////////////////////////////////////////////////////////////////////////// \n');
					var stringified = JSON.stringify(tradeData); 
					//console.log(stringified);
					//console.log(data.indexOf(stringified));

					if(	data.indexOf(stringified) === -1){			
						createStream.write(stringified + '\n', (err)=>{
							if (err){
								reject('error');
								//throw err;
							}else{
								//createStream.end();
								resolve(console.log('data stored.'));

							}
						});
					}else{
						//createStream.end();
						resolve(console.log('data already in base, nothing done.'));
					}


				});
			});
	});
};
var jason = ''
request.post(url, {json: {"query":{"status":{"option": "online"},"name": "The Pariah","type": "Unset Ring","stats": [{"type": "and","filters": []}]},"sort": {"price": "asc"}}}, (err, res, body)=>{
	if (err){
		throw err;
	}
	console.log(body);
	callmeCarson3();

	function callmeCarson3(){
		letsGo(body).then(()=>{
			i++;
			callmeCarson3();
		}).catch((e)=>{
			if (e=='done'){
				console.log('done!');
			}
			console.log('reject');
			callmeCarson3();
		});
	};
});

