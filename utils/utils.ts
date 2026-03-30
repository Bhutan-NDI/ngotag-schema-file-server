import { create, Header, Payload } from 'jwt/mod.ts';
import { decodeBase64 } from 'std/encoding/base64.ts';
import { ISSUER, JWT_TOKEN_SECRET } from '../config.ts';

export const secretKey = await crypto.subtle.importKey(
  'raw',
  new Uint8Array(decodeBase64(JWT_TOKEN_SECRET)),
  { name: 'HMAC', hash: 'SHA-256' },
  true,
  ['sign', 'verify'],
);

const header: Header = {
  alg: 'HS256',
  typ: 'JWT',
};

export const getAuthToken = async () => {
  const payload: Payload = {
    iss: ISSUER,
    id: crypto.randomUUID(),
  };

  const jwt = await create(header, payload, secretKey);

  return {
    token: jwt,
    payload,
  };
};
