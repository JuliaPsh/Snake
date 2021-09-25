//ajax - xyjaks
var AjaxHandlerScript="http://fe.it-academy.by/AjaxStringStorage2.php";
var SCRsA; // элемент массива - {name:'Иванов',gamescores:'Привет'};
var UpdatePassword;

// показывает все сообщения из SCRsA на страницу
function ShowSCRs() 
{
	clearTimeout(LoadTimer);
	$('#Loading').progressbar('destroy');
    var Str='';
    for ( var M=0; M<SCRsA.length; M++ )
    {
        var SCRH=SCRsA[M];
        Str+="<b>"+EscapeHTML(SCRH.name)+":</b> "
            +EscapeHTML(SCRH.gamescores)+"<br />";
    }
	document.getElementById('ScoreList').innerHTML=Str;
}

function EscapeHTML(text)
{
    if ( !text )
        return text;
    text=text.toString()
        .split("&").join("&amp;")
        .split("<").join("&lt;")
        .split(">").join("&gt;")
        .split('"').join("&quot;")
        .split("'").join("&#039;");
    return text;
}

// получает сообщения с сервера и потом показывает
var LoadTimer;

function RefreshSCRs()
{
	document.getElementById('ScoreList').innerHTML='ТАБЛИЦА РЕКОРДОВ ФОРМИРУЕТСЯ ОЖИДАЙТЕ';
	Load=document.getElementById('Loading');
    
	$('#Loading').progressbar();
	PBFill();
	
	var Counter=0;
	function PBFill()
	{
		if(Counter>=100)
		{Counter=0}
		Counter+=10;
		console.log(Counter);
		$('#Loading').progressbar('value',Counter);
		LoadTimer=setTimeout(PBFill,250);
	}
	setTimeout(RefSCRs, 4000);
}
function RefSCRs() 
{
    $.ajax(
        {
            url : AjaxHandlerScript,
            type : 'POST',
            data : { f : 'READ', n : 'FF_CHAT_MESSAGES' },
            cache : false,
            success : ReadReady,
            error : ErrorHandler
        }
    );
}

function ReadReady(ResultH) // сообщения получены - показывает
{
    if ( ResultH.error!=undefined )
        alert(ResultH.error); 
    else
    {
        SCRsA=[];
        if ( ResultH.result!="" ) // либо строка пустая - сообщений нет
        {
            // либо в строке - JSON-представление массива сообщений
            SCRsA=JSON.parse(ResultH.result); 
        }
        ShowSCRs();
    }
}

// получает сообщения с сервера, добавляет новое,
// показывает и сохраняет на сервере
var GS=0;



function Save(_GameScore) 
{
	document.getElementsByClassName('gameover').style.cssText+='display:none';
	
    UpdatePassword=Math.random();
    $.ajax(
        {
            url : AjaxHandlerScript,
            type : 'POST',
            data : { f : 'LOCKGET', n : 'FF_CHAT_MESSAGES',
                p : UpdatePassword },
            cache : false,
            success : LockGetReady,
            error : ErrorHandler
        }
    );
}

// сообщения получены, добавляет, показывает, сохраняет
function LockGetReady(ResultH) 
{
    if ( ResultH.error!=undefined )
        alert(ResultH.error); 
    else
    {
        SCRsA=[];
        if ( ResultH.result!="" ) // либо строка пустая - сообщений нет
        {
            // либо в строке - JSON-представление массива сообщений
            SCRsA=JSON.parse(ResultH.result); 
        }

        var SenderName=document.getElementById('Name').value;
        SCRsA.push( { name:SenderName, gamescores:GS } );
		SCRsA.sort(Compare);
        if ( SCRsA.length>10 )
		{

			SCRsA.pop();
		}
            

        $.ajax(
            {
                url : AjaxHandlerScript,
                type : 'POST',
                data : { f : 'UPDATE', n : 'FF_CHAT_MESSAGES',
                    v : JSON.stringify(SCRsA), p : UpdatePassword },
                cache : false,
                success : UpdateReady,
                error : ErrorHandler
            }
        );
    }
}

// сообщения вместе с новым сохранены на сервере
function UpdateReady(ResultH) 
{
    if ( ResultH.error!=undefined )
        alert(ResultH.error); 
}

function ErrorHandler(jqXHR,StatusStr,ErrorStr)
{
    alert(StatusStr+' '+ErrorStr);
}

function Compare(A,B)
{
	return B.gamescores-A.gamescores;
}
function GameScoreReady(_GameScore)
{
		GS=_GameScore;
}