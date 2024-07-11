/*
- 자바스크립트에서 클래스란 무엇인가?
  - ES6에서 도입이 되었으며, 객체를 생성하기 위한 템플릿
  - class 키워드를 사용하여 정의할 수 있음
  - 생성자, 인스턴스 메서드를 가질 수 있고 상속이 가능
- 자바스크립트에서 클래스 상속은 어떻게 이루어지나?
  - ‘extends’ 키워드를 사용해서 구현할 수 있음
  - ‘super()’ 함수를 사용하면 부모 클래스의 생성자를 호출할 수 있음
*/

import IntervalManager from '../managers/interval.manager.js';
import {
  createLocationPacket, gameStartNotification,
} from '../../utils/notification/game.notification.js';

const MAX_PLAYERS = 2;

class Game {
  constructor(id) {
    this.id = id;
    this.users = [];
    this.intervalManager = new IntervalManager();
    this.state = 'waiting'; // 'waiting', 'inProgress'
  }

  addUser(user) {
    if (this.users.length >= MAX_PLAYERS) {
      throw new Error('Game session is full');
    }
    this.users.push(user);

    this.intervalManager.addPlayer(user.id, user.ping.bind(user), 1000);
    if (this.users.length === MAX_PLAYERS) {
      setTimeout(() => {
        this.startGame();
      }, 3000);
    }
  }

  getUser(userId) {
    return this.users.find((user) => user.id === userId);
  }

  removeUser(userId) {
    this.users = this.users.filter((user) => user.id !== userId);
    this.intervalManager.removePlayer(userId);

    if (this.users.length < MAX_PLAYERS) {
      this.state = 'waiting';
    }
  }

  getMaxLatency() {
    let maxLatency = 0;
    this.users.forEach((user) => {
      maxLatency = Math.max(maxLatency, user.latency);
    });
    return maxLatency;
  }

  startGame() {
    this.state = 'inProgress';
    const startPacket = gameStartNotification(this.id, Date.now());
    console.log(this.getMaxLatency());

    this.users.forEach((user) => {
      user.socket.write(startPacket);
    });
  }

  getAllLocation() {
    const maxLatency = this.getMaxLatency();
  
    const locationData = this.users.map((user) => {
      const { x, y } = user.calculatePosition(maxLatency);
      return { id: user.id, x, y };
    });
    return createLocationPacket(locationData);
  }
}

export default Game;
