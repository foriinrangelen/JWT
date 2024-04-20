const cookieParser = require('cookie-parser');
const express= require('express');
const jwt= require('jsonwebtoken');

const app= express();
// 원래는 dotenv 모듈 활용 하여 process.env.ACESS_TOKEN_SECRET 으로 접근
const secretText= 'superSecret';
// refreshtoken용 serectkey 생성
const refreshSecretText= 'supersuperSecret';
// refreshtoken DB대용 배열 생성
let refreshTokens= [];
app.use(express.json());
// ✅ cookieparsing을 위한 미들웨어 등록
app.use(cookieParser());

  ///////////////////////////////////////////////////////////////////////////////////
 //////////              AccessToken + RefreshToekn의 Flow                //////////       
///////////////////////////////////////////////////////////////////////////////////
//  1. 유저의 로그인 요청
//  2. 서버에서 AccessToeken 과 RefreshToken 생성해서 응답, 클라이언트는 쿠키 등에 저장
//  3. 클라이언트의 요청시 access token 이용
//  4. 서버측에서 토큰이 유효한지 확인후, 보호된 리소스 응답
//  5. 클라이언트가 다시 요청시 똑같이 access token으로 요청, 그러나 토큰만료
//  6. 서버측에서 유효하지 않은 토큰(invaild token error)이라고 응답
//  7. 이 때 클라이언트에서 같이 보관하고 있던 refresh token으로 요청
//  8. 서버 측에서 refresh token이 유효한지 확인 후 access token과 refresh token 재발급


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
    // 토큰은 request headers에서 가져오기 (request headers의 authorization에 토큰이 저장된다)
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
    // 유효기간 추가하기( 세번째 매개변수에 { expiresIn:'시간' } 으로 설정  )
    const accessToken= jwt.sign(user, secretText, { expiresIn:'30s' });
    
    // jwt를 이용해서 refreshToken도 생성하기 (원론적으론 DB에 저장, 실습에선 배열로 테스트)
    const refreshToken= jwt.sign(user, refreshSecretText, { expiresIn:'1d' });

    // 임시 배열(DB대용)에 push
    refreshTokens.push(refreshToken);

    // refreshToken을 쿠키에 넣어주기 ( 'jwt' 이름으로 refreshToken 저장 )
    res.cookie('jwt', refreshToken, { httpOnly: true, maxAge:24* 60* 60* 1000 });

    // 원래는 Header에 추가
    res.json({accessToken: accessToken});

})

// ✅ access토큰 만료 후 refresh토큰으로 재발급 받기
app.get('/refresh', (req, res)=> {
    console.log('req.cookies', req.cookies)
    // ✅ 쿠키 가져오기
    const cookies= req.cookies;
    // ✅ 쿠키안에 jwt가 없다면 403 return
    if(!cookies?.jwt) return res.sendStatus(403);
    // ✅ refreshtoken 가져온후 DB에 있는 토큰확인 (여기선 배열로 확인)
    const refreshToken= cookies.jwt;
    if(!refreshTokens.includes(refreshToken)) {
        return res.sendStatus(403);
    }
    // ✅ refresh토큰이 유효한 토큰인지 확인
    jwt.verify(refreshToken, refreshSecretText, (err, user)=> {
        // 유효한 토큰이 아니라면
        if(err) return res.sendStatus(403);
        // 유효한 토큰이라면 access토큰 재발급하기
        const accessToken= jwt.sign( {name: user.name}, secretText, { expiresIn:'30s' }) ;
        // 재발급 후 클라이언트에게 전달
        res.json( {accessToken} )
    })



    
})


const port= 4000;
app.listen(port, ()=> {
    console.log(`listening on port ${port}`);
})