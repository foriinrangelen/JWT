const express= require('express');
const jwt= require('jsonwebtoken');

const app= express();
// 원래는 dotenv 모듈 활용 하여 process.env.ACESS_TOKEN_SECRET 으로 접근
const secretText= 'superSecret';

app.use(express.json());

// get 요청으로 데이터 받아가기 위한 data
const posts= [
    {
        username:"K",
        title:"1"
    },
    {
        username:"Y",
        title:"2"
    }
]

// 기존 get 라우터에서
// app.get('/post', ()=> {
//     res.json(posts);
// })

// authMiddleware미들웨어를 통과해야지만(토큰이 유효해야지만) 접근가능하게 설정
app.get('/post',authMiddleware, (req, res)=> {
    res.json(posts);
})

function authMiddleware(req, res, next) {
    // 토큰은 request headers에서 가져오기
    const authHeader= req.headers['authorization'];
    // Bearer [토큰] 구조에서 토큰만 가져오기(Bearer 잘라내기)
    const token= authHeader && authHeader.split(' ')[1];
    // 만약 토큰이 존재하지 않는다면
    if( token == null ) return res.sendStatus(401).send('Unauthorized');
    // 토큰 존재 확인후 유효한 토큰인지 확인
    // jwt.verify(): 토큰이 유효한지 확인하기위한 메서드 요청헤더의 토큰과 서버의 secretKey를 조합하여 확인
    // 하고 클라이언트로 받은 jwt토큰을 디코드해서 payload를 가져옴(user 매개변수에 들어감)
    jwt.verify(token, secretText, (err, user)=> {
        // 유효하지 않다면 403 에러 return
        if(err) return res.sendStatus(403).send('Forbidden');
        // 유효하다면 req.user값에 user payload 데이터를 넣어서 다른 MiddleWare에서도 사용가능하게만들기
        req.user= user;
        // next(): 다음으로 넘어가기 
        // app.get('/post',authMiddleware, (req, res)=> {} 에서, 두번째 매개변수 authMiddleware에서
        //  next()해줘서,다음 매개변수인 (req, res)=>{} 로 넘어갈 수 있게해줌
        next();
    })

}

app.post('/login', (req, res)=> {
    const userName= req.body.username;
    const user= { name: userName };

    // jwt를 이용해서 토큰 생성하기 ( payload + secretText )
    // jwt.sign() : 첫번째 매개변수에 payload, 두번째 매개변수에 secretKey를 조합하여 jwt토큰 return하는 Method
    const accessToken= jwt.sign(user, secretText);

    // 원래는 Header에 추가
    res.json({accessToken: accessToken});

})


const port= 4000;
app.listen(port, ()=> {
    console.log(`listening on port ${port}`);
})