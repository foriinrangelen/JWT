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
- RefreshToken생성 후 cookie에 추가
- 유효기간 설정
##
### RefreshToken2.js
- AccessToken만료후 RefreshToken 활용해서 AccessToken재발급받기
##

