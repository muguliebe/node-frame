# node-frame
node base project

### run
```
npm install;
npm run start;
```

### file structure
```
- dist:           ---- 빌드 결과 파일
- src:            ---- 소스 루트
  - config          ---- 노드 런타임에 필요한 설정 파일 
  - controller      ---- http request 받아주는 시작 포인트
  - model           ---- 몽고 연결 시 사용하는 Schema
  - service         ---- 클래스 단위 서비스
  - util            ---- 단순 유틸리티성
  * app.js          ---- 노드 시작 진입점 (* 최초 수행)
  * server.js       ---- http server 구성 및 시작 진입점
* .babelrc        ---- 바벨파일(pure javascript convert)
* .eslintignore   ---- es lint 무시할 파일
* .eslintrc.js    ---- es lint Rule 설정
* .gitignore      ---- git 무시할 파일
* .jsbeautifyrc   ---- 코드 스타일 설정
* .gulpfile.js    ---- 걸프 Task 설정
* package.json    ---- npm package
* README.md       ---- README.md

```

### to know
- npm run start: 노드몬 사용
   - 개발용임으로 배포 시에는 구성을 바꿔야 함
- 몽고DB
   - 테스트용 mlab의 몽고가 연결되어 있으므로 설정 변경 필요
   - src/properties.dev.json 이 몽고 정보
- 암호화
   - 암호키 파일: src/config/security.json
   - 암호키 파일 변경 후, 노드를 띄워 아래 URL로 테스트 가능
      - /test/encrypt/:val
      - /test/decrypt/:val
   - 암호화 된 값으로 몽고 DB 패스워드 등에 활용
      - 이때는 config.js 에서 패스워드 값을 decrypt 해줘야 함
      
- babel
   - async/await 사용까지 구성되어있음
- Transaction
   - 모든 트랜잭션을 몽고 DB에 남기도록 되어있음