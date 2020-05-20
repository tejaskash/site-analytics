window.onload = startSession();
function startSession()
{
    
    if(window.sessionStorage.getItem('logged'))
    {console.log("Session Logged")}
    else{
    let OS = (_= function(){
        return window.bowser.detect(navigator.userAgent);
    })();
    let _UUID,_NEW = checkUser();
    fetch("https://ipinfo.io/",{method:"GET",mode:"cors",headers:{'Accept':'application/json','Authorization':`Bearer ${(_=function(){return atob("GET_YOUR_OWN_KEY")})()}`}})
    .then(response=>{return response.json()})
    .then(data => {let visitorDetails = {uuid:_UUID,os:OS,ip:data,landing:window.location.pathname,new_user:_NEW};
            let xhr = new XMLHttpRequest();
            xhr.open("POST","https://analytics.tejaskashinath.ml/db/add",true);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.send(JSON.stringify(visitorDetails));
    });
    window.sessionStorage.setItem('logged',true);
}
}
function checkUser()
{
    //Check for a cookie with a users guid. If not found, generate one and create cookie.
    let _uuid; 
    let new_user=false;
    let cookie = document.cookie.trim();
    if(cookie === "")
    {
        document.cookie="_uuid="+generateGUID()+";expires="+new Date(new Date().getTime()+1000*60*60*24*365).toUTCString()+";";
        new_user=true;
    }
    else
    {
        let cl = cookie.split(";");
        for(let i=0;i<cl.length;i++)
        {
            let key=cl[i].split("=")[0].trim();
            let value=cl[i].split("=")[1].trim(); 
            if(key == "_uuid")
            {
                _uuid = value.trim();
                break;
            }
        }
    }
    if(_uuid!=undefined)
    {
        document.cookie = "_uuid="+_uuid+";expires="+new Date(new Date().getTime()+1000*60*60*24*365).toUTCString()+";";
        
    }
    else
    {
        document.cookie = "_uuid="+generateGUID();+";expires="+new Date(new Date().getTime()+1000*60*60*24*365).toUTCString()+";";
        new_user=true;
    }
    return _uuid,new_user;
}
function generateGUID() {
    //CREDITS For This Function - https://stackoverflow.com/a/2117523
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
});
} 
