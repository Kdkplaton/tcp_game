// DB 마이그레이션 : 코드로 작성한 클래스를 실제 데이터베이스에 테이블로 옮기는 과정
// 모델을 생성하게 되면 ORM (Object Relation Mapping) 이 migration 파일을 생성하고, 
// migration 파일이 데이터 베이스에 적용한다
// ORM에서는 데이터베이스의 구조를 migration file들을 통해 주로 관리

// - 새로운 기능 추가로 인해 *스키마 변경이 필요할 때 (지금 우리 상황)*
// - 데이터베이스 성능 향상을 위해 구조를 최적화할 때
// - 데이터베이스 시스템을 교체할 때 (예: MySQL에서 PostgreSQL로)

import fs from 'fs';
import path from 'path';
import pools from '../database.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const executeSqlFile = async (pool, filePath) => {
  const sql = fs.readFileSync(filePath, 'utf8');
  const queries = sql
    .split(';')   // ';' 를 기준으로 분리하여 인식한다.
    .map((query) => query.trim())
    .filter((query) => query.length > 0);

  for (const query of queries) {
    await pool.query(query);
  }
};

const createSchemas = async () => {
  const sqlDir = path.join(__dirname, '../sql');
  try {
    // USER_DB SQL 파일 실행
    await executeSqlFile(pools.USER_DB, path.join(sqlDir, 'user_db.sql'));

    console.log('데이터베이스 테이블이 성공적으로 생성되었습니다.');
  } catch (error) {
    console.error('데이터베이스 테이블 생성 중 오류가 발생했습니다:', error);
  }
};

createSchemas()
  .then(() => {
    console.log('마이그레이션이 완료되었습니다.');
    process.exit(0); // 마이그레이션 완료 후 프로세스 종료
  })
  .catch((error) => {
    console.error('마이그레이션 중 오류가 발생했습니다:', error);
    process.exit(1); // 오류 발생 시 프로세스 종료
  });
