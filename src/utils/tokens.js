import jwt from 'jsonwebtoken';

export function createTokens(payload) {
  const accessTTLmin = Number(process.env.ACCESS_TOKEN_TTL_MIN || 15);
  const refreshTTLDays = Number(process.env.REFRESH_TOKEN_TTL_DAYS || 30);

  const accessToken = jwt.sign(
    payload,
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: `${accessTTLmin}m` },
  );
  const refreshToken = jwt.sign(
    payload,
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: `${refreshTTLDays}d` },
  );

  const now = new Date();
  const accessTokenValidUntil = new Date(now.getTime() + accessTTLmin * 60 * 1000);
  const refreshTokenValidUntil = new Date(now.getTime() + refreshTTLDays * 24 * 60 * 60 * 1000);

  return { accessToken, refreshToken, accessTokenValidUntil, refreshTokenValidUntil };
}

export function verifyAccess(token) {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
}

export function verifyRefresh(token) {
  return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
}
