## ExpreeJS JWT활용 로그인구현

#### 1. 프로젝트 폴더 생성
#### 2. `npm init`
#### 3. `npm install dotenv express jsonwebtoken nodemon cookie-parser`
##
### cretejwt.js
- jwt 생성
##
### authMiddleware.js
- authMiddleware 생성
- jwt parsing & 인증성공 후 미들웨어넘기기
##
### RefreshToken.js
#### AccessToken + RefreshToekn의 Flow
1. 유저의 로그인 요청
2. 서버에서 AccessToeken 과 RefreshToken 생성해서 응답, 클라이언트는 쿠키 등에 저장
3. 클라이언트의 요청시 access token 이용
4. 서버측에서 토큰이 유효한지 확인후, 보호된 리소스 응답
5. 클라이언트가 다시 요청시 똑같이 access token으로 요청, 그러나 토큰만료
6. 서버측에서 유효하지 않은 토큰(invaild token error)이라고 응답
7. 이 때 클라이언트에서 같이 보관하고 있던 refresh token으로 요청
8. 서버 측에서 refresh  token이 유효한지 확인 후 access token과 refresh token 재발급
- authMiddleware 생성
- jwt parsing & 인증성공 후 미들웨어넘기기
##
