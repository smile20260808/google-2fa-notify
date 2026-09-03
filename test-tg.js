const https = require('https');

// 请把单引号里的内容替换为你自己的 Token 和 Chat ID
const BOT_TOKEN = '8953921694:AAHzXS2zqmLB2qwwjJ85PowflRaOMA66tsw';
const CHAT_ID = '-1004423976022';

const postData = JSON.stringify({
  chat_id: CHAT_ID,
  text: '🔔 这是一条本地测试通知，如果收到说明 Bot 配置完全正常！'
});

const options = {
  hostname: 'api.telegram.org',
  port: 443,
  path: `/bot${BOT_TOKEN}/sendMessage`,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = https.request(options, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    console.log('响应状态码:', res.statusCode);
    console.log('返回内容:', data);
  });
});

req.on('error', (e) => {
  console.error('请求异常:', e.message);
});

req.write(postData);
req.end();