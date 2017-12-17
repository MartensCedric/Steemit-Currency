
function updateStyle(){
var footers = document.getElementsByClassName('articles__summary-footer');
for(var i = 0; i < footers.length; i++)
{
	footers[i].style.border = "5px solid red";
}
}

updateStyle();
