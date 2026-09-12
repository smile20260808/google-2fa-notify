const axios = require('axios');

// 1. 填入你当前的 Cookie
const COOKIE = '在此替换你的完整Cookie内容';

// 2. 刚才测试操作的管理员 peiai 的 UUID
// （如果不确定 peiai 的 UUID，先保持下面这个，或者去浏览器复制他的链接里的那串 UUID）
const TEST_ADMIN_UUID = '57c6af58-6380-4ddb-b6fc-dcd67d91960c'; 

async function runTest() {
  console.log('🔍 正在单点拉取管理员历史页面...');
  const url = 'https://jemnkcwc.com/admin/users/' + TEST_ADMIN_UUID + '/histories';
  
  try {
    const res = await axios.get(url, {
      headers: {
        'Cookie': COOKIE,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      timeout: 10000
    });

    const html = res.data;
    console.log(`📄 页面获取成功，总字符长度: ${html.length}`);

    // 检查关键字
    const hasClear = html.includes('清除');
    const hasGoogle = html.includes('Google');
    console.log(`🔎 页面包含 "清除": ${hasClear} | 包含 "Google": ${hasGoogle}`);

    if (!hasClear || !hasGoogle) {
      console.log('⚠️ 警告：当前拉取到的页面根本没有 "清除" 或 "Google"！');
      console.log('👉 可能原因：');
      console.log('1. TEST_ADMIN_UUID 不是刚才执行操作的那个管理员');
      console.log('2. 后台历史记录有延迟或翻页到了下一页');
      return;
    }

    // 查找位置并打印前后文字
    const idx = html.indexOf('清除');
    const snippet = html.slice(Math.max(0, idx - 100), Math.min(html.length, idx + 200));
    console.log('\n--- 🎯 真实页面核心片段如下 ---');
    console.log(snippet.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
    console.log('-------------------------------\n');

  } catch (err) {
    console.error('❌ 拉取失败:', err.message);
    if (err.response) {
      console.error('状态码:', err.response.status);
    }
  }
}

runTest();