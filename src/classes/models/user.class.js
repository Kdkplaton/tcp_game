// 객체지향 패턴
/* 장/단점
- 장점
  - 코드 재사용성
  - **가독성 및 유지보수성**
  - 데이터 캡슐화
  - 다형성
  - …
- 단점
  - 절차 지향 패턴보다 많은 메모리와 처리 시간이 소모될 가능성이 있다.
  - 복잡하다.
  - 러닝커브가 상대적으로 높다.
*/

import { createPingPacket } from '../../utils/notification/game.notification.js';

class User {
  constructor(id, socket) {
    this.id = id;
    this.socket = socket;
    this.x = 0;
    this.y = 0;
    this.sequence = 0;
    this.lastUpdateTime = Date.now();
  }

  updatePosition(x, y) {
    this.x = x;
    this.y = y;
    this.lastUpdateTime = Date.now();
  }

  getNextSequence() {
    return ++this.sequence;
  }
  
  ping() {
    const now = Date.now();

    //console.log(`${this.id}: ping`);
    this.socket.write(createPingPacket(now));
  }

  handlePong(data) {
    const now = Date.now();
    this.latency = (now - data.timestamp) / 2;
    console.log(`Received pong from user ${this.id} at ${now} with latency ${this.latency}ms`);
  }

  // 추측항법을 사용하여 위치를 추정하는 메서드
  calculatePosition(latency) {
    const timeDiff = latency / 1000;  // 레이턴시를 초 단위로 계산
    const speed = 1;  // 속도 고정
    const distance = speed * timeDiff;

    // x, y 축에서 이동한 거리 계산
    return {
      x: this.x + distance,
      y: this.y,
    };
  }

}

export default User;
