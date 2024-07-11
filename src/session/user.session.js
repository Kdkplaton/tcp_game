import { userSessions } from './sessions.js';
import User from '../classes/models/user.class.js';

// 세션 유저 정보 생성
export const addUser = (socket, uuid) => {
  // user 초기화
  const user = new User(uuid, socket);
  userSessions.push(user);
  return user;
};

// 세션 유저 정보 삭제
export const removeUser = (socket) => {
  const index = userSessions.findIndex((user) => user.socket === socket);
  if (index !== -1) {
    return userSessions.splice(index, 1)[0];
  }
};

// 세션 유저 ID로 찾기
export const getUserById = (id) => {
  return userSessions.find((user) => user.id === id);
};

// 다음 sequence 값이 존재하면 반환 / 없으면 null
// user는 id로 선택함
export const getNextSequence = (id) => {
  const user = getUserById(id);
  if (user) {
    return user.getNextSequence();
  }
  return null;
};

export const getUserBySocket = (socket) => {
  return userSessions.find((user) => user.socket === socket);
};
