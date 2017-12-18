var steemPrice;
var sbdPrice;

function updateStyle(){
	var timestamps = document.getElementsByClassName('timestamp__link');
	var footers = document.getElementsByClassName('articles__summary-footer');
	var dropDownMenus = document.getElementsByClassName('VerticalMenu menu vertical VerticalMenu');

	for(var i = 0; i < footers.length; i++)
	{
		var isPowered = timestamps[i].childElementCount == 2;
		if(!isPowered)
			footers[i].style.border = "5px solid red";
		else footers[i].style.border = "5px solid blue";

		//TODO REMOVE
		if(isPowered)
			continue;

		var reward = footers[i].children[0].children[0]
								.children[1].children[0].children[0];

    if(reward.childElementCount != 3)
			reward = reward.children[0];

		var integer = reward.children[1].innerText;
		var decimal = reward.children[2].innerText;
		reward = integer + decimal;
		console.log(reward);

		if(dropDownMenus[i].childElementCount != 0)
		{
			//Not paid yet
			if(dropDownMenus[i].childElementCount == 2)
			{
				console.log('Not paid yet!');
			}else{

					console.log(dropDownMenus[i].children[0].children[0].childNodes[1]);
					var payoutTemp = dropDownMenus[i].children[0].children[0].childNodes[1];
					var payout = payoutTemp.nodeValue;

					var authorTemp = dropDownMenus[i].children[1].children[0].childNodes[1];
					var author = authorTemp.nodeValue;

					var curationTemp = dropDownMenus[i].children[2].children[0].childNodes[1];
					var curation = curationTemp.nodeValue;

					var endPayout = payout.split('$')[1];
					var endAuthor = author.split('$')[1];
					var endCuration = curation.split('$')[1];

					console.log('After split');

					var sbd = isPowered ? 0.00 : endAuthor/2.00;
					sbd *= sbdPrice;
					var sp = isPowered ? endAuthor : endAuthor/(2.00 * steemPrice); //Not exactly correct

					console.log(sbd);
					console.log(endCuration);
					console.log(sp);
					var totalValue = +sbd + +endCuration + +sp;
					console.log(totalValue);
					totalValue = totalValue.toFixed(2);
					console.log(totalValue);

					authorTemp.nodeValue = authorTemp.nodeValue.replace(endAuthor, sbd.toFixed(2) + ' USD');
					curationTemp.nodeValue = curationTemp.nodeValue.replace(endCuration, endCuration + ' USD');
					payoutTemp.nodeValue = payoutTemp.nodeValue.replace(endPayout, totalValue + ' USD');

					//TODO SP
					console.log(endAuthor);
					console.log('SBD : ' + sbd);
					console.log('SP : ' + sp);
					console.log(endCuration);
			}
		}
	}
}

function getPrice(crypto, currency)
{
	var url = 'https://api.coinmarketcap.com/v1/ticker/' + crypto + '/?convert=' + currency;
	var method = 'GET';
	var xhr = createCORSRequest(method, url);
	xhr.onload = function() {
	  // Success code goes here.
		var price = JSON.parse(xhr.responseText)[0]["price_usd"];

		if(crypto == 'steem')
			steemPrice = price;
		else if(crypto == 'steem-dollars')
			sbdPrice = price;

			if(steemPrice != undefined && sbdPrice != undefined)
			{
					updateStyle();
					updateWallet();
			}
	};

	xhr.onerror = function() {
	  // Error code goes here.
		console.log('failed!');
		console.log(xhr);
	};
	xhr.send();
}

var createCORSRequest = function(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {
    // Most browsers.
    xhr.open(method, url, true);
  } else if (typeof XDomainRequest != "undefined") {
    // IE8 &amp; IE9
    xhr = new XDomainRequest();
    xhr.open(method, url);
  } else {
    // CORS not supported.
    xhr = null;
  }
  return xhr;
}

function updateWallet()
{
	var userWallet = document.getElementsByClassName('UserWallet');
	console.log(userWallet);
	if(userWallet == undefined)
		return;

	var sbd = userWallet[0].children[3].children[0].children[0];
	sbd.innerText = sbd.innerText.replace("$1.00 of STEEM", '$' + sbdPrice + ' USD');
	console.log(sbd);
}

getPrice('steem', 'USD');
getPrice('steem-dollars', 'USD');
