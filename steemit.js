var steemPrice;
var sbdPrice;

function updateStyle(){
	var timestamps = document.getElementsByClassName('timestamp__link');
	var footers = document.getElementsByClassName('articles__summary-footer');
	for(var i = 0; i < footers.length; i++)
	{
		var isPowered = timestamps[i].childElementCount == 2;
		if(!isPowered)
			footers[i].style.border = "5px solid red";
		else footers[i].style.border = "5px solid blue";
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
