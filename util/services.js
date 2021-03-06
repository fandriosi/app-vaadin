export default class Services{
    message(){
        return "Hello Campinas";    
    }
    postServices(url = ``, data ) {
        // Default options are marked with *
        return fetch(url, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                // "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Basic ${btoa('Bemodaah:$#Bemodaah43')}`
            },
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client
            body: data, // body data type must match "Content-Type" header            
        }); // parses response to JSO    
    }   
    deleteServices(url = ``, data) {
        // Default options are marked with *
        return fetch(url, {
            method: "DELETE", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                // "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Basic ${btoa('Bemodaah:$#Bemodaah43')}`
            },
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client
            body: data, // body data type must match "Content-Type" header            
        }); // parses response to JSO    
    }   
    putServices(url = ``, data) {
        // Default options are marked with *
        return fetch(url, {
            method: "PUT", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                // "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Basic ${btoa('Bemodaah:$#Bemodaah43')}`
            },
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *client
            body: data, // body data type must match "Content-Type" header            
        }); // parses response to JSO    
    }   
    async getServices(url= ``){
        const request = await fetch(url, {headers:{
            "Content-Type": "application/json",
            // "Content-Type": "application/x-www-form-urlencoded",
            "Authorization": `Basic ${btoa('Bemodaah:$#Bemodaah43')}`
        }});
        const payload = await request.json();
        return payload;
    }   
   async getServicesJson(url = ``) {
        // Default options are marked with *
        const request = await fetch(url, {
            method: "GET", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, cors, *same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                // "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": `Basic ${btoa('Bemodaah:$#Bemodaah43')}`
            },
            redirect: "follow", // manual, *follow, error
            referrer: "no-referrer", // no-referrer, *clienTE          
        }); // parses response to JSOn    
        const payload = await request.json();
        return payload;
    }   
}