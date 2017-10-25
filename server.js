var http = require("http");
var mongo = require("mongodb").MongoClient;
var u = require("url");
var qs = require("querystring");

var server = http.createServer(function(request,response){

	var url  = u.parse(request.url);
	var cmds = url.pathname.split("/");

	if(cmds[1] == "signin"){

		// post로 넘어온 데이터를 읽는다
		var postdata = "";
		request.on("data", function(data){
			postdata += data;
		});

		// 모두 읽으면 변수와 값을 분리해서 처리한다
		request.on("end", function(){
			var query = qs.parse(postdata); // postdata : id=xxx&pw=123456
			// query = {
			//     id : "xxx",
			//     pw : "123456"	
			// }
			if(!query.id || !query.pw){
				response.end("id or password is wrong!");
			}else{
				// mongo db 주소 구조 = 프로토콜://주소:포트/데이터베이스이름 -> db 변수에 전달
				mongo.connect("mongodb://localhost:27017/testdb", function(error, db){ 
					if(error){
						response.write(error);
					}else{
						// db 검색
						console.log("[query]")
						console.log(query);
						var cursor = db.collection('user').find(query); // 쿼리의 구조 json object
						console.log("[item]")
						cursor.forEach(function(item){
							console.log(item);
						});
					}
					response.end("");
				});
			}
		});

	}else{
		response.end("page not found");
	}
});

server.listen(8090,function(){
	console.log("server is running...");
});