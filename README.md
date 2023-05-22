# Getting Started

src/static 폴더 아래에 있는 모든 .md 파일에 대해 vector db 를 생성(또는 업데이트) 하는 과정입니다. 아래 명령어를 입력하면 src/data_store 경로에 vector db 가 생성(또는 업데이트) 됩니다.

```bash
$npx ts-node -r tsconfig-paths/register src/save.local.db.ts
Created a chunk of size 104, +
which is longer than the specified 50
Created a chunk of size 66, +
which is longer than the specified 50
Created a chunk of size 91, +
which is longer than the specified 50
Created a chunk of size 953, +
which is longer than the specified 50
```

개발 모드 시작

```bash
$npm run dev
```
