import axios from 'axios';

async function test() {
  const client = axios.create({ baseURL: 'http://localhost:3001/v1', validateStatus: () => true });
  const csrfRes = await client.get('/auth/csrf');
  console.log('Set-Cookie Header:', csrfRes.headers['set-cookie']);
  
  function extractCookies(res: any) {
    const rawCookies = res.headers['set-cookie'] || [];
    return rawCookies.map((c: string) => c.split(';')[0]).join('; ');
  }
  
  console.log('Extracted:', extractCookies(csrfRes));
  console.log('Data:', csrfRes.data);
  
  const token = csrfRes.data.csrfToken;
  const cookie = extractCookies(csrfRes);
  
  // Try calling logout with just CSRF
  const logoutRes = await client.post('/auth/logout', {}, {
    headers: {
      Cookie: cookie,
      'x-csrf-token': token
    }
  });
  console.log('Logout Res:', logoutRes.status, logoutRes.data);
}

test().catch(console.error);
