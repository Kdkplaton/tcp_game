import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import protobuf from 'protobufjs';
import { packetNames } from '../protobuf/packetNames.js';

// 현재 파일의 절대 경로 추출
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 프로토파일이 있는 디렉토리 경로 : 경로 설정
const protoDir = path.join(__dirname, '../protobuf');

// 주어진 디렉토리 내 모든 proto 파일을 재귀적으로 찾는 함수
const getAllProtoFiles = (dir, fileList = []) => {
  // 파일 읽어오기
  const files = fs.readdirSync(dir);

  // 읽어온 파일에 대하여 수행
  files.forEach((file) => {
    const filePath = path.join(dir, file);

    // 디렉토리면 재귀 실행, 아니면 파일 리스트 반환
    if (fs.statSync(filePath).isDirectory()) {
      getAllProtoFiles(filePath, fileList);
    } else if (path.extname(file) === '.proto') {
      fileList.push(filePath);
    }
  });
  return fileList;
};

// 모든 proto 파일 경로를 가져옴
const protoFiles = getAllProtoFiles(protoDir);

// 로드된 프로토 메시지들을 저장할 객체
const protoMessages = {};

// 모든 .proto 파일을 로드하여 프로토 메시지를 초기화
export const loadProtos = async () => {
  try {
    const root = new protobuf.Root();

    // 비동기 병렬 처리로 프로토 파일 로드
    await Promise.all(protoFiles.map((file) => root.load(file)));

    // packetNames 에 정의된 패킷들을 등록
    for (const [packageName, types] of Object.entries(packetNames)) {
      protoMessages[packageName] = {};
      for (const [type, typeName] of Object.entries(types)) {
        protoMessages[packageName][type] = root.lookupType(typeName);
      }
    }

    console.log('Protobuf 파일이 로드되었습니다.');
  } catch (error) {
    console.error('Protobuf 파일 로드 중 오류가 발생했습니다:', error);
  }
};

// 로드된 프로토 메시지들의 얕은 복사본을 반환합니다.
export const getProtoMessages = () => {
  return { ...protoMessages };    // 얕은-복사를 통해 원본이 아닌 사본을 반환
};
