import { getProtoMessages } from '../../init/loadProtos.js';
import { getProtoTypeNameByHandlerId } from '../../handlers/index.js';
import { config } from '../../config/config.js';
import CustomError from '../error/customError.js';
import { ErrorCodes } from '../error/errorCodes.js';

export const packetParser = (data) => {
  const protoMessages = getProtoMessages();

  // 공통 패킷 구조를 디코딩
  // 공통 패킷 내용: [handlerId, userId, clientVersion, sequence]
  const Packet = protoMessages.common.Packet;

  let packet;
  try {
    // 패킷 디코딩
    packet = Packet.decode(data);
  } catch (error) {
    throw new CustomError(ErrorCodes.PACKET_DECODE_ERROR, '패킷 디코딩 중 오류 발생.');
  }

  const handlerId = packet.handlerId;
  const userId = packet.userId;
  const clientVersion = packet.clientVersion;
  const sequence = packet.sequence;

  // clientVersion 검증
  if (clientVersion !== config.client.version) {
    throw new CustomError(
      ErrorCodes.CLIENT_VERSION_MISMATCH,
      '클라이언트 버전 불일치.',
    );
  }

  // 핸들러 ID에 따라 적절한 payload 구조를 디코딩
  const protoTypeName = getProtoTypeNameByHandlerId(handlerId);
  if (!protoTypeName) {
    throw new CustomError(ErrorCodes.UNKNOWN_HANDLER_ID, `알 수 없는 핸들러 ID: ${handlerId}`);
  }

  const [namespace, typeName] = protoTypeName.split('.');
  const PayloadType = protoMessages[namespace][typeName];
  
  let payload;
  try {
    payload = PayloadType.decode(packet.payload);
  } catch(error) {
    throw new CustomError(ErrorCodes.PACKET_STRUCTURE_MISMATCH, '패킷 구조 불일치.');
  }

  // // 필드 검증 - 위 decode 과정에서 거치는(포함된) 과정임
  // // 중복이므로 주석처리
  // const errorMessage = PayloadType.verify(payload);
  // if (errorMessage) {
  //   throw new CustomError(
  //     ErrorCodes.PACKET_STRUCTURE_MISMATCH,
  //     `패킷 구조 불일치: ${errorMessage}`,
  //   );
  // }

  // 필드가 비어 있거나, 필수 필드가 누락된 경우 처리
  const expectedFields = Object.keys(PayloadType.fields);
  const actualFields = Object.keys(payload);
  const missingFields = expectedFields.filter((field) => !actualFields.includes(field));

  if (missingFields.length > 0) {
    throw new CustomError(
      ErrorCodes.MISSING_FIELDS,
      `필수 필드가 누락됨: ${missingFields.join(', ')}`,
    );
  }

  //console.log('handlerId:', handlerId, 'userId:', userId);
  //console.log(`clientVersion: ${clientVersion}`);
  //console.log('sequence:', sequence, 'payload:', payload);

  return { handlerId, userId, payload, sequence };
};
