const express= require('express');
const jwt= require('jsonwebtoken');

const app= express();
// 원래는 dotenv 모듈활용 하여 process.env.ACESSTOKEN 으로 접근
const secretText= 'superSecret';

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


app.use(express.json());

app.get('/post', ()=> {
    res.json(posts);
})

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