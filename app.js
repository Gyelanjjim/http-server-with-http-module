const http = require("http");
const server = http.createServer();
const users = [
    {
      id: 1,
      name: "Rebekah Johnson",
      email: "Glover12345@gmail.com",
      password: "123qwe",
    },
    {
      id: 2,
      name: "Fabian Predovic",
      email: "Connell29@gmail.com",
      password: "password",
    },
];
  
let posts = [
    {
      id: 1,
      title: "간단한 HTTP API 개발 시작!",
      content: "Node.js에 내장되어 있는 http 모듈을 사용해서 HTTP server를 구현.",
      userId: 1,
    },
    {
      id: 2,
      title: "HTTP의 특성",
      content: "Request/Response와 Stateless!!",
      userId: 1,
    },
];

const data = function(){
    let dataArray = [];
    for(let i = 0; i<posts.length; i++){
        for(let j = 0; j<users.length; j++){
            if (users[j].id === posts[i].userId){
                let userPost = {
                    "userID"           : users[j].id,
                    "userName"         : users[j].name,
                    "postingId"        : posts[i].id,
                    "postingTitle"     : posts[i].title,
                    "postingContent"   : posts[i].content 
                }
                dataArray.push(userPost);
            }
        }
    }
    return dataArray;
}

const subA = function(arr, num){
    arrNew =[];
    for(let i=0; i<arr.length; i++){
        if(arr[i].id!==num){
            arrNew.push(arr[i]);
        }
    }
    return arrNew;
  }

  const postFind = function (arr, idx){ 
    let result =[];
    for(let i=0; i<arr.length; i++){
      if(arr[i].userId === idx){
        result.push({
          "postingId"       : arr[i].id,
          "postingName"     : arr[i].title,
          "postingContent"  : arr[i].content  
        });
      }
    }
    return result; 
  }
  
  const userFind = function (arr1, arr2, userId){ 
    let result = {};
    for(let i in arr1){
      if(arr1[i].id === userId){
        result = {
          "userID"    : arr1[i].id,
          "userName"  : arr1[i].name,
          "postings"  : postFind(arr2, userId)
        }
      }
    }
    return result;
  }

const httpRequestListener =  function(request, response){
    const { url, method } = request;
    if (method === 'GET'){
        if (url === '/ping'){
            response.writeHead(200, {'Content-Type' : 'appliction/json'});
            response.end(JSON.stringify({message : 'pong'}));
        }else if (url === '/posts/inquire'){
            response.writeHead(200, {'Content-Type' : 'appliction/json'});
            response.end(JSON.stringify({ "data" : data() }));
        }else if (url === '/users/posts/inquire'){
            let body = "";

            request.on("data", (data) => { 
                body += data;
            });

            request.on("end", ()=>{
                const user = JSON.parse(body);
                
                let result={}; 
                result = userFind(users, posts, user.id); 
                
                response.writeHead(200, {'Content-Type':'appliction/json'});
                response.end(JSON.stringify({"data" : result}));
            });
            
        }
    }else if(method === "POST"){
        if (url === "/users/signup") {
            let body = "";

            request.on("data", (data) => { 
                body += data;
            });

            request.on("end", ()=>{
                const user = JSON.parse(body);

                users.push({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    password: user.password,
                });

                response.writeHead(200, {'Content-Type':'appliction/json'});

                response.end(JSON.stringify({
                    message : "userCreated",
                    "users" : users
                }));
            });
        }else if(url === "/posts/signup"){
            let body = "";

            request.on("data", (data) => { 
                body += data;
            });

            request.on("end", ()=>{
                const post = JSON.parse(body);

                posts.push({
                    id: post.id,
                    title: post.title,
                    content: post.content,
                    userId: post.userId,
                });

                response.writeHead(200, {'Content-Type':'appliction/json'});

                response.end(JSON.stringify({
                    message : "postCreated",
                    "posts" : posts }));
            });
        }
    }else if(method === "PATCH"){
        if(url === '/posts/change'){
            let body = "";
            
            request.on("data", (data) => { 
                body += data;
            });
            
            request.on("end", ()=>{
                const post = JSON.parse(body);

                for(let i in posts){
                    if (posts[i].id === post.id){
                         posts[i].content = post.content;
                    } 
                    
                }
                
                response.writeHead(200, {'Content-Type' : 'appliction/json'});
                response.end(JSON.stringify({ "data" : data() }));
            });
        }
    
    }else if(method === "DELETE"){
        if(url === '/posts/delete'){
            let body = "";

            request.on("data", (data) => { 
                body += data;
            });
            request.on("end", ()=>{
                const post = JSON.parse(body);
                
                posts = subA(posts, post.id);
                response.writeHead(200, {'Content-Type' : 'appliction/json'});
                response.end(JSON.stringify({ "message" : "postingDeleted", "posts" : posts }));
            });
            
        }
    }
}
server.on("request", httpRequestListener);

const IP = '127.0.0.1';
const PORT = 8000;

server.listen(PORT, IP, function(){
    console.log(`Listening to request on ip ${IP} & port ${PORT}`);
})