var request = require('request');
var fs = require('fs');
var Promise = require('promise');
var url = 'https://www.pathofexile.com/api/trade/search/Legion';
var i = 0;
var createStream = fs.createWriteStream('./itembase.txt', {
	flags:'a'
});
var allDiffs= [];
function getDiff(id, diff){
	var novaUrl = 'https://www.pathofexile.com/api/trade/fetch/' +diff+'?query='+id;
	//for(let i = 0; i < allDiffs.length-1; i++){
	if (allDiffs.indexOf(diff) > -1){
		return;
	}
	allDiffs.push(diff);
	
	//console.log(novaUrl);
	request(novaUrl, (err, res, body)=>{
		if (err){
			reject('error');
			//throw err;
		}	
		body = JSON.parse(body);
		
				var tradeData = {

					accountName: body.result[0].listing.account["name"],
					itemName: body.result[0].item["name"],
					itemBase: body.result[0].item["typeLine"],
					currencyType: body.result[0].listing.price['currency'],
					currencyAmount: body.result[0].listing.price['amount'],
					whisper: body.result[0].listing['whisper']
				}
				console.log(tradeData);
			});
}

function rolling(results){
	request.post(url, {json: {"query":{"status":{"option": "online"},"name": "Mao Kun","type": "Shore Map","stats": [{"type": "and","filters": []}]},"sort": {"price": "asc"}}}, (err, res, body)=>{
		if (err){
			throw err;
		}
	/*if (body.result.length > results.length){
		var longString = body.result;
		var smallString = results;
	}else{
		*/
		var longString = results;
		var smallString = body.result;
		/*
	}*/
	var difference = [];
	for (let i = 0 ; i < smallString.length;i++){
		var exist = false;
		for (let j = 0 ; j < longString.length;j++){
			if (smallString[i] === longString[j]){
				//console.log('igual')
				exist = true;
			}
		}
		if(!(exist)){
		difference.push(smallString[i]);
		}
	}
	if (difference.length>0){
		//console.log('ifdiff');
		//console.log(difference);
		for(let i = 0 ; i < difference.length;i++){
			getDiff(body.id, difference[i]);
		}
		rolling(body.result);
	}else{
		//console.log('else');
		rolling(results);
	}
});
}

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
				if (i==0/*results.length-1*/){
					console.log(results);
					reject(results);
				};
				body = JSON.parse(body);
				//console.log(results.length);
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
request.post(url, {json: {"query":{"status":{"option": "online"},"name": "Mao Kun","type": "Shore Map","stats": [{"type": "and","filters": []}]},"sort": {"price": "asc"}}}, (err, res, body)=>{
	if (err){
		throw err;
	}
	console.log(body);
	callmeCarson3();

	function callmeCarson3(){
		letsGo(body).then(()=>{
			i++;
			callmeCarson3();
		}).catch((results)=>{
			console.log(results);
			if (results){
				console.log('done!');
				rolling(results);
			}else{			
			console.log('reject');
			}
			//callmeCarson3();
		});
	};
});

