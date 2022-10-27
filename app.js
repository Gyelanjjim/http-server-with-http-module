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
  
const posts = [
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
/*
const httpRequestListener = function (request, response) { // (3)
    response.writeHead(200, { "Content-Type": "application/json" }); // (4)
    response.end(JSON.stringify({ message: "userCreated" })); // (5)
  };
*/
const httpRequestListener =  function(request, response){
    const { url, method } = request;

    if(method === "POST"){
        //response.writeHead(200, {'Content-Type':'appliction/json'})
        //response.end(JSON.stringify({message: 'userCreated'}));
        // url이 /users/signup 이면 회원가입을 실행:
        if (url === "/users/signup") {
            let body = "";

            //콜백함수: 데이터를 모아서 하나의 스트링으로
            request.on("data", (data) => { 
                body += data;
            });

            //콜백함수: 
            request.on("end", ()=>{
                // 하나의 스트링으로 만든 body를 파싱해서 user에 할당
                const user = JSON.parse(body);

                // 전역변수 users에 입력받은 객체를 추가
                users.push({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    password: user.password,
                });

                // 데이터타입은 json으로 
                response.writeHead(200, {'Content-Type':'appliction/json'});

                // json으로 작성된 stringify(...)의 ...을 응답'body'에 표시
                response.end(JSON.stringify({
                    message : "userCreated",
                    "users" : users
                }));
            });
        // url이 /posts/signup 이면 게시글 입력을 실행:
        }else if(url === "/posts/signup"){
            let body = "";

            //콜백함수: 데이터를 모아서 하나의 스트링으로
            request.on("data", (data) => { 
                body += data;
            });

            //콜백함수: 
            request.on("end", ()=>{
                // 하나의 스트링으로 만든 body를 파싱해서 post에 할당
                const post = JSON.parse(body);

                 // 전역변수 posts에 입력받은 객체를 추가
                posts.push({
                    id: post.id,
                    title: post.title,
                    content: post.content,
                    userId: post.userId
                });
                // 데이터타입은 json으로 
                response.writeHead(200, {'Content-Type':'appliction/json'});

                // json으로 작성된 stringify()의 객체 내용을 응답'body'에 표시
                response.end(JSON.stringify({
                    message : "postCreated",
                    "posts" : posts }));
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
