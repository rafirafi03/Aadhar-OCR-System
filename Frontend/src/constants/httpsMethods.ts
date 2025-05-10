export const HttpMethod = {
  GET: 'GET',
  POST: 'POST'
} as const;

export type HttpMethod = keyof typeof HttpMethod;