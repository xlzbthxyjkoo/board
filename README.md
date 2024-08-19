## 게시판 
![image](https://github.com/user-attachments/assets/1aa90eb5-61e9-4025-bca1-ca55c5bd0061)
### 기능
- 메인 화면에는 한쪽에 게시글 목록과 다른쪽에 가장 최근에 작성된 게시글 내용이 보여져야함
- 목록 나열 순서는 가장 최근에 작성/수정한 순<br/><br/>
**1. Pagination**
- 게시글 7개 이상 -> 새로운 페이지 생성
- 하단 Pagination bar로 원하는 페이지로 이동 가능<br/><br/>
**2. 게시글 등록**
- 게시글 등록 버튼 클릭 시 글 작성 가능
- 등록 버튼을 누르면 보고 있던 게시글 대신 등록을 위한 Form 보여짐
![image](https://github.com/user-attachments/assets/76b7fd15-83a9-460d-bd16-c084b48441cd)
- 제목, 작성자, 내용 모두 입력해야함 -> 공백으로 제출 버튼 클릭 시 제목, 작성자, 내용 입력하라는 alert창 보여짐
- 끝까지 backspace 눌러서 내용 지우면 빨간 경고 보여짐
![image](https://github.com/user-attachments/assets/8c98e2d2-b34f-439b-9e7a-28fe4b2307f7)
- Home 버튼 누르면 가장 처음에 보였던 메인 화면으로 돌아감<br/><br/>
**3. 게시글 수정/삭제**
![image](https://github.com/user-attachments/assets/c7f67499-8b3c-4e33-9b00-e305079e6078)
- 목록에서 원하는 게시글 클릭하면 수정/삭제 가능<br/><br/>
### 툴
**Server**
- Express
- MySQL
- Node.js<br/><br/>

**Client**
- Vite
- React
- axios<br/><br/>

**Design**
- antd
