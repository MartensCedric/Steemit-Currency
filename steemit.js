var steemPrice;
var sbdPrice;
var userLang = navigator.language || navigator.userLanguage;
var footers = document.getElementsByClassName('articles__summary-footer');
var timestamps = document.getElementsByClassName('timestamp__link');
var oldLength = 0;
var href = window.location.href;

//multiple-currency
//'Pending' is a solution that only works in english
//Comments
//Post footers
//Adjust price formula
//upvoting issue


/**
* Updates footers with USD price
**/
function updateStyle(footersToUpdate){
	//Drop down menus are where it says "Payout pending..." or "Author : $x.xx..."
	var dropDownMenus = document.getElementsByClassName('VerticalMenu menu vertical VerticalMenu');
	//On the feed page there's an extra element that has these classes that we don't want
	if(dropDownMenus.length === footers.length + 1)
	{
			dropDownMenus = Array.prototype.slice.call(dropDownMenus).slice(1);
	}

	for(var i = oldLength; i < footers.length; i++)
	{
			var isPowered = timestamps[i].childElementCount == 2;
			updateDropDownMenu(dropDownMenus[i], extractReward(footers[i]), isPowered);
	}
    oldLength += footersToUpdate.length;
}

function updatePostReward(reward)
{
	var dropDownMenus = document.getElementsByClassName('VerticalMenu menu vertical VerticalMenu');
	//check if its powered
	updateDropDownMenu(dropDownMenus[0], reward, false);
}

function updateDropDownMenu(ddm, reward, isPowered)
{
		var integer = reward.children[1].innerText;
		var decimal = reward.children[2].innerText;
		var steemreward = integer + decimal;

		//If there's a a dropdown (The price is atleast $0.00)
		if(ddm.childElementCount > 1)
		{
			//Now it can either be :
			//- Not paid yet (pending)
			//- Paid

			//This obviously does not work for non english version of the website
			if(ddm.children[0].innerHTML.indexOf("Pending") != -1)
			{
				var curationEstPayout = 0.25 * +steemreward;
				var authorEstPayout = 0.75 * +steemreward;
				var sbd = isPowered ? 0.00 : authorEstPayout/2.00;
				sbd *= sbdPrice;
				var sp = isPowered ? authorEstPayout : authorEstPayout/(2.00 * steemPrice); //Not exactly correct

				authorEstPayout = +sbd + +sp;
				var totalPayout = +curationEstPayout + +authorEstPayout;
				totalPayout = totalPayout.toFixed(2);

				var pendingPayoutNode = ddm.children[0].children[0].childNodes[1];
				pendingPayoutNode.nodeValue = pendingPayoutNode.nodeValue = 'Estimated : $' + totalPayout + ' USD';

				updateDollarBox(totalPayout, reward);
			}else{ //Paid payouts

					var payoutTemp = ddm.children[0].children[0].childNodes[1];
					var payout = payoutTemp.nodeValue;

					var authorTemp = ddm.children[1].children[0].childNodes[1];
					var author = authorTemp.nodeValue;

					var curationTemp = ddm.children[2].children[0].childNodes[1];
					var curation = curationTemp.nodeValue;

					var endPayout = payout.split('$')[1];
					var endAuthor = author.split('$')[1];
					var endCuration = curation.split('$')[1];

					var sbd = isPowered ? 0.00 : endAuthor/2.00;
					sbd *= sbdPrice;
					var sp = isPowered ? endAuthor : endAuthor/(2.00 * steemPrice); //Not exactly correct

					var totalValue = +sbd + +endCuration + +sp;
					totalValue = totalValue.toFixed(2);
					updateDollarBox(totalValue, reward);

					authorTemp.nodeValue = authorTemp.nodeValue.replace(endAuthor, (+sbd + +sp).toFixed(2) + ' USD');
					curationTemp.nodeValue = curationTemp.nodeValue.replace(endCuration, endCuration + ' USD');
					payoutTemp.nodeValue = payoutTemp.nodeValue.replace(endPayout, totalValue + ' USD');
			}
		}
}

function updateDollarBox(tv, reward)
{
	var totalInteger = Math.trunc(tv);
	var totalDecimal = getDecimal(tv);

	reward.children[1].innerText = totalInteger;
	reward.children[2].innerText = '.' + totalDecimal + ' USD';
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
	if(userWallet === undefined || userWallet[0] === undefined)
		return;

	var sbd = userWallet[0].children[3].children[0].children[0];
	sbd.innerText = sbd.innerText.replace("$1.00 of STEEM", '$' + sbdPrice + ' USD');
}

function updateComments()
{
	var commentFooters = document.getElementsByClassName('Comment__footer');
	console.log('Updating comments!');
	console.log(commentFooters.length + ' comments to process!');
	for(var i = 0; i < commentFooters.length; i++)
	{
		console.log('comment start');
		var reward = commentFooters[i].children[0].children[0].children[0].children[1].children[0].children[0];
		var ddm = commentFooters[i];
		console.log(commentFooters[i]);
		console.log('Current reward ' + reward);
		if(reward.childElementCount != 3)
		{
				console.log('o shit');
				reward = reward.children[0];
		}


		console.log(reward);
		//updateDropDownMenu()
	}
}

function hasClass(element, cls) {
  return (' ' + element.className + ' ').indexOf(' ' + cls + ' ') > -1;
}

function checkIfNewPosts() {
	if(href != window.location.href)
	{
		href = window.location.href;
		oldLength = 0;

		var postFooters = document.getElementsByClassName('PostFull__footer row');
		if(footers.length != 0)
		{
			updateStyle(footers);
		}else if(postFooters.length != 0){

      updatePostReward(postFooters[0].children[0].children[1].children[0]
																.children[1].children[0]
																.children[0].children[0]);

      updateComments();
		}

	}else if(footers.length > 0 && oldLength == 0)
	{
			updateStyle(footers);
	}else{
		if(footers.length > oldLength)
		{
			var newFooters = Array.prototype.slice.call(footers).slice(oldLength);
			updateStyle(newFooters);
		}
	}
}

function extractReward(footer)
{
		var reward = footer.children[0].children[0]
							.children[1].children[0].children[0];

		if(reward.childElementCount != 3)
			reward = reward.children[0];

		return reward;
}

function listenNewPosts()
{
	setInterval(checkIfNewPosts, 1000);
}

getPrice('steem', 'USD');
getPrice('steem-dollars', 'USD');
