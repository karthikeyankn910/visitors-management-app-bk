const options = document.getElementById('model-list');
const form = document.getElementById('form');
const req = new XMLHttpRequest();
const viewBtn = document.getElementById('view-btn');
const exportBtn = document.getElementById('export-btn');
const loginBtn = document.getElementById('login-btn');
const tableView = document.getElementById('db-data');


//default dropdown value
var selectedValue = 'visitors';


//select-option (dropdown) change listener
options.addEventListener('change', (event)=> {
    selectedValue = event.target.value; 
}) 

// login button click listener credentials and send request for login
loginBtn.addEventListener('click', (event) => { 
    req.open('POST', `http://localhost:4000/api/v1/admin/login`, true);
    req.setRequestHeader('Content-type', 'application/json');
    let credentials = {
        "email": "karthik@gmail.com",
        "password": "karthik",
    };
    req.send(JSON.stringify(credentials));
    alert("You have logged in successfully for 10s");
});



//view button click listener
viewBtn.addEventListener('click', (event) => {
    req.open('GET', `http://localhost:4000/api/v1/${selectedValue}`);
    req.setRequestHeader('auth-token', JSON.parse(localStorage.getItem('credentials')));
    req.send(); 
}); 



//export button click listener
exportBtn.addEventListener('click', (event) => {
    req.open('GET', `http://localhost:4000/api/v1/${selectedValue}/download`, true); 
    req.setRequestHeader('Content-type', 'application/json');
    req.setRequestHeader('Content-Disposition', 'attachment');
    req.setRequestHeader('auth-token', JSON.parse(localStorage.getItem('credentials'))); 
    req.send(); 
    
}); 






// set localstorage to get key
req.onreadystatechange = () => {
    if (req.readyState === 4 && req.responseURL === "http://localhost:4000/api/v1/admin/login") { 
        localStorage.setItem("credentials", JSON.stringify(req.response));
    } 
    else if(req.readyState === 4 && !req.responseURL.includes('download')) {
        tableView.innerText = req.response;
    }
    else if (req.readyState === 4 && req.responseURL.includes('download')) {
        var content = req.response;
        if (req.responseURL.includes('visitors')) 
            fileName = 'visitor'; 
        else if (req.responseURL.includes('employees'))
            fileName = 'employee';
        else   
            fileName = 'branch'
        html5saver(content, fileName);
    }
     
}



function html5saver(content, fileName) { 
    var encoded = encodeURI(content); 
    var a = document.createElement('a');
    a.setAttribute('href', 'data:text/csv;charset=utf-8'+encoded);
    a.setAttribute('download', fileName); 
    document.body.appendChild(a);
    a.style.display ='none';
    a.click(); 
    document.body.removeChild(a);
}