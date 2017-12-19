var steemPrice;
var sbdPrice;
var userLang = navigator.language || navigator.userLanguage;
var footers = document.getElementsByClassName('articles__summary-footer');
var oldLength = 0;


function updateStyle(footersToUpdate){
	var timestamps = document.getElementsByClassName('timestamp__link');
	oldLength += footersToUpdate.length;
	var dropDownMenus = document.getElementsByClassName('VerticalMenu menu vertical VerticalMenu');

	if(dropDownMenus.length === footers.length + 1)
	{
			dropDownMenus = Array.prototype.slice.call(dropDownMenus).slice(1);
	}

	for(var i = 0; i < footers.length; i++)
	{
		var isPowered = timestamps[i].childElementCount == 2;
		if(!isPowered)
			footers[i].style.border = "5px solid red";
		else footers[i].style.border = "5px solid blue";

		var reward = footers[i].children[0].children[0]
								.children[1].children[0].children[0];

	    if(reward.childElementCount != 3)
			reward = reward.children[0];


		var integer = reward.children[1].innerText;
		var decimal = reward.children[2].innerText;
		var steemreward = integer + decimal;

		console.log(steemreward);
		console.log(reward);

		if(hasClass(reward, 'strikethrough')) //Payout Refused
			continue;
		//If there's a a dropdown (The price is atleast $0.00)
		if(dropDownMenus[i].childElementCount != 0)
		{
			console.log(dropDownMenus[i]);
			//Not paid yet
			if(dropDownMenus[i].childElementCount === 2)
			{
				console.log('Not paid yet : ' + steemreward);
				var curationEstPayout = 0.25 * +steemreward;
				var authorEstPayout = 0.75 * +steemreward;
				var sbd = isPowered ? 0.00 : authorEstPayout/2.00;
				sbd *= sbdPrice;
				var sp = isPowered ? authorEstPayout : authorEstPayout/(2.00 * steemPrice); //Not exactly correct

				authorEstPayout = +sbd + +sp;
				var totalPayout = +curationEstPayout + +authorEstPayout;
				totalPayout = totalPayout.toFixed(2);

				var pendingPayoutNode = dropDownMenus[i].children[0].children[0].childNodes[1];
				pendingPayoutNode.nodeValue = pendingPayoutNode.nodeValue = 'Estimated : $' + totalPayout + ' USD';

				var totalInteger = Math.trunc(totalPayout);
				var totalDecimal = getDecimal(totalPayout);

				reward.children[1].innerText = totalInteger;
				reward.children[2].innerText = '.' + totalDecimal + ' USD';

			}else{

					var payoutTemp = dropDownMenus[i].children[0].children[0].childNodes[1];
					var payout = payoutTemp.nodeValue;

					var authorTemp = dropDownMenus[i].children[1].children[0].childNodes[1];
					var author = authorTemp.nodeValue;

					var curationTemp = dropDownMenus[i].children[2].children[0].childNodes[1];
					var curation = curationTemp.nodeValue;

					var endPayout = payout.split('$')[1];
					var endAuthor = author.split('$')[1];
					var endCuration = curation.split('$')[1];

					var sbd = isPowered ? 0.00 : endAuthor/2.00;
					sbd *= sbdPrice;
					var sp = isPowered ? endAuthor : endAuthor/(2.00 * steemPrice); //Not exactly correct

					var totalValue = +sbd + +endCuration + +sp;

					totalValue = totalValue.toFixed(2);

					var totalInteger = Math.trunc(totalValue);
					var totalDecimal = getDecimal(totalValue);

					reward.children[1].innerText = totalInteger;
					reward.children[2].innerText = '.' + totalDecimal + ' USD';

					authorTemp.nodeValue = authorTemp.nodeValue.replace(endAuthor, (+sbd + +sp).toFixed(2) + ' USD');
					curationTemp.nodeValue = curationTemp.nodeValue.replace(endCuration, endCuration + ' USD');
					payoutTemp.nodeValue = payoutTemp.nodeValue.replace(endPayout, totalValue + ' USD');
			}
		}
	}
}

function getDecimal(number)
{
	var nstring = (number + ""),
	    narray  = nstring.split("."),
	    result  = ( narray.length > 1 ? narray[1] : "0" );
			return result;
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
					updateStyle(footers);
					updateWallet();
					listenNewPosts();
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
	if(userWallet === undefined || userWallet[0] === undefined)
		return;

	var sbd = userWallet[0].children[3].children[0].children[0];
	sbd.innerText = sbd.innerText.replace("$1.00 of STEEM", '$' + sbdPrice + ' USD');
}

function hasClass(element, cls) {
  return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function checkIfNewPosts() {
	console.log(footers.length + ' ' + oldLength);
	if(footers.length != oldLength)
	{
		var newFooters = Array.prototype.slice.call(footers).slice(oldLength);
		updateStyle(newFooters);
	}
}

function listenNewPosts()
{
	setInterval(checkIfNewPosts, 500);
}

getPrice('steem', 'USD');
getPrice('steem-dollars', 'USD');
