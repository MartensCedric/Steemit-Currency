//if($.browser.mozilla)
  // netscape.security.PrivilegeManager.enablePrivilege('UniversalBrowserRead');

function updateStyle(){
	var footers = document.getElementsByClassName('articles__summary-footer');
	for(var i = 0; i < footers.length; i++)
	{
		footers[i].style.border = "5px solid red";
	}
}

function getPrice(crypto, currency)
{
	var url = 'https://api.coinmarketcap.com/v1/ticker/' + crypto + '/?convert=' + currency;
	var method = 'GET';
	var xhr = createCORSRequest(method, url);

	xhr.onload = function() {
	  // Success code goes here.
		return JSON.parse(xhr.responseText)[0]["price_usd"];
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


updateStyle();
var price = getPrice("STEEM", "USD");
