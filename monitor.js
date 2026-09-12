const axios = require('axios');
const express = require('express');

// ==================== 1. 核心配置区 ====================
// 粘贴最新的有效 Cookie（建议使用专属监控账号的 Cookie）
const COOKIE = '_browser_id=eyJfcmFpbHMiOnsibWVzc2FnZSI6IklqZ3lOamRrTkdabExXSTNNbVl0TkdOa01pMDVNRFl3TFRRd05EZzVNamcxT1RCak1pST0iLCJleHAiOiIyMDI4LTA4LTI0VDE1OjM4OjM5Ljk0MFoiLCJwdXIiOiJjb29raWUuX2Jyb3dzZXJfaWQifX0%3D--28c8784125fc5f9f913d5e09758787d224fd7008; _sprite_session=UO1dASyhmicoqKS2yIUxga3TugjkjKkBW91SQsm3orrWClYF8ByuQF%2BBw43pQjVCEjyWT%2F%2F8D8e1wp4QipBBWU%2BojSVtzKeR4eFnCBacsc5v4uIZWJE2XYFO5p8437wu4raPkn%2FslOj4JHxaxAKQ2ARbtcEvCY50KoNmc%2Fk5wzajL7WYgRIKU04Hgh5p6CU0WzIV360K3ptdUoWvbGdMM4HK2TxdUV8BKWc7QIwvpyIqorYOQIXdMOkOmNmIZaQvwJDH6OTTll%2BAvhwniISrbPC7iBc4v2fnsyS4K8f58RgQng0NnwHCIPOzzqmdhZo7n%2FguCgo0myhjS6DEhgf3qn7DEJDoi2FnKBRGEdjP%2F2W2bY5jaZ3fmBkUx0f8SuRNtksKgsgjuxEiYsmMgQlFgiIV%2BPU7hPCq0lO%2FXM%2Fp1B%2BFoDKRK5gBCogsA5OezBokQkxSAeKfgJq7KpChAJl4r95lt5u4NQZWlhiMnrvloUA5hYOtQr2mPrzQo1ugrKuR2Gfx4oZLQpB%2FYw7SqvUbKqh9pJ8xrIghzYphfjX1k5wctCcHKEhdTBbrbTEBSw%2FAkZ8cggAdWB1Eu9lm8fGAgeygw1jII%2BrD4WNvO9HfJTl5MmGEZDFu5Z7xlSazk9pjfFARXCP5%2FZVSwtOsmJJXYUDWd1fXVhDzzC%2B9b5%2ByTZD54NuFbX%2F8h3AiPyz1U6cjF15wtXQuVBWrPWEPk7ebXAE8iWIc9wfj4sfQI0zApg%3D%3D--2ypXE5jWAtR8rmj0--fkEtVxzempm2e5RInuvTHw%3D%3D';

// Telegram 告警配置
const TG_BOT_TOKEN = '8953921694:AAHzXS2zqmLB2qwwjJ85PowflRaOMA66tsw';
const TG_CHAT_ID = '-1004423976022';

// 68 位活跃管理员 UUID 清单
const ADMIN_UUIDS = [
  "57c6af58-6380-4ddb-b6fc-dcd67d91960c", "6f3fc577-3902-4763-bdbd-6ce76c943bcb",
  "2b3e4a79-797f-475e-b2e0-30c60f58e1e4", "a83dd263-8885-4e56-9589-a05ceb6d87d5",
  "e205569d-672f-4300-94f4-48999982fbec", "28db02b6-aca7-4f09-8d2d-86bc697e8bdb",
  "784a91f4-6869-4877-8764-7b4213893ac1", "61628456-7b0b-4c51-a24b-71017dc32379",
  "be1a817d-ea59-4737-ab98-10d2d2c07393", "3432d745-e627-49b3-9a5d-15d328278c85",
  "199bbc0b-45d8-4924-a5e5-8a5cf3f19cf1", "dd6a14d4-2d33-454a-9551-0642f5623b35",
  "47f2ed5e-6283-436e-b32a-633703ce11b7", "c8c173ad-364f-49a3-8da3-e482c11ff9c3",
  "dec881bc-db63-4ef5-9b14-d5f8638eee1d", "e789c375-20b6-401e-a0fc-8287295a53c4",
  "e23eaf8b-636d-4788-b83e-652ec1f0618e", "3c098eca-1064-4d7e-a4e9-8ac832816cfc",
  "c72717ee-f5f4-4315-adcc-fa32ce4fa43c", "dc505e17-442c-4b97-8849-47c81f1ca50b",
  "07858974-586d-4712-ab5f-f6a4a7b118f6", "cdfa441e-15bb-4e07-8ff6-dc6b44fd8246",
  "7723185f-0d5d-4d80-b4ec-87b621ce3fa8", "735ea9bc-7108-4274-96ec-83fd1ada0f5b",
  "d2acfd14-f36e-4cf8-acb2-9c37f7b28480", "1941ff60-5713-4ff1-b97f-06ee7082ccf4",
  "e835dcdc-905d-4e63-8295-f7e3db88097f", "fbdd86a1-8d29-4809-bd77-96f1e16551b3",
  "6e970c6e-aa28-4a6a-b250-04a7b2f6a12e", "980a6c78-16ee-469a-8038-cd4bd40bd7d6",
  "e8ad28c3-7974-481b-bc57-b375c5a93e2f", "ccb8dfe6-5fbc-48b5-b2b3-5e4c951ef93c",
  "bc303440-c7d0-44b2-8dbf-90e6a136df4d", "dc419c16-507d-43cd-8d16-11d1d0bcc731",
  "f5a2f7f9-feff-428c-8367-10ca5397a258", "49dd6b7d-9438-4890-99b1-46d3e1517232",
  "1495a145-df3c-445a-a785-b61e2b6b852c", "943e4dbf-0aab-4e24-8462-cb45d2702e5d",
  "754bd737-1361-419c-82af-5818cb0be36f", "ab999e65-422c-4f41-a681-6b9eb29a5816",
  "7a4769e5-5371-46c9-b3a3-f01dc4f24006", "a1a9ac7e-8037-43fd-9f9c-2ff5e3fd3e5d",
  "59b8ab1c-cfd8-4ffe-b184-ae6d04a4522a", "04ad7ac7-f606-40fc-affe-820f641094e6",
  "15e65fc2-7c47-4503-a199-c9a100e62f24", "05341994-b28e-4b0c-b06f-01d303b013af",
  "86e94b4b-f330-4bf6-9362-a3a1b1531e62", "4b221a73-f725-47e3-a948-47c1bfe723b0",
  "493c861e-62de-47c2-a901-2ae0cd929089", "fe321fcf-d510-4900-9257-41e30a20c86e",
  "da01ce7a-ae09-478a-867f-65f2dba051f2", "62a382d2-000d-49f1-90e0-9803d5f7b20f",
  "0232a213-a451-4a0d-b912-abe4625d62c4", "b1fd27ea-6437-43b5-ad83-ac2b047d6b25",
  "5e6a534e-a410-4f32-ad86-971eb8ade4f3", "ad950414-84fb-465c-8e59-c78d54f73a0e",
  "325a0411-8d0a-43bb-88e9-3f19234b93c3", "c83ebb71-72f4-4c48-a6f3-2e68fc397fa2",
  "adf4b92c-e49b-4bae-9074-1ba567825b86", "185eb59e-23f1-4345-ab41-e8053e16250e",
  "9aa596a4-39b9-4169-9116-03a7d9deeaed", "4a9a5476-0e69-4695-9533-80cded07b165",
  "a3ab57f9-1d46-4103-ad54-465137af023b", "f5ea6b04-370f-4aa3-847d-1805ea429111",
  "f12e4e89-22a8-47ef-95b3-d565557a02bf", "7ba05d47-8073-46d3-8e46-acc3149ec2cb",
  "3e6dc23e-e658-4356-bde3-220649811a7b", "07031bc4-7f31-484e-b716-ba84069ade0a"
];

const seenRecords = new Set();
let isInitialRun = true;
let expiredNotified = false;

// ==================== 2. 工具与通知函数 ====================

// Cookie 失效告警
async function notifyCookieExpired() {
  if (expiredNotified) return;
  expiredNotified = true;
  console.error('❌ [鉴权失效] 当前后台 Cookie 已过期或被系统登出！');
  try {
    await axios.post('https://api.telegram.org/bot' + TG_BOT_TOKEN + '/sendMessage', {
      chat_id: TG_CHAT_ID,
      text: '⚠️ *【系统警报】后台 Cookie 凭证已过期*\n\n系统已检测到闲置登出或凭证失效，2FA 监听暂停，请更新 COOKIE。',
      parse_mode: 'Markdown'
    }, { timeout: 5000 });
  } catch (e) {}
}

// 获取会员详细信息（直接读取真实 investors 页面）
async function getMemberInfo(memberUuid) {
  const targetUrl = 'https://jemnkcwc.com/admin/investors/' + memberUuid;
  try {
    const res = await axios.get(targetUrl, {
      headers: {
        'Cookie': COOKIE,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      },
      timeout: 8000,
      maxRedirects: 5
    });

    const text = res.data;
    const clean = (val) => val ? val.replace(/<[^>]+>/g, '').trim() : null;

    let username = null;
    const uMatch = text.match(/平台會員\s+([a-zA-Z0-9_-]+)/i) || 
                   text.match(/(?:帐号|帳號)[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>/i) ||
                   text.match(/(?:帐号|帳號)\s*[:：\t]\s*([a-zA-Z0-9_-]+)/i);
    if (uMatch) username = clean(uMatch[1]);

    let balance = '0.00';
    const bMatch = text.match(/可用额度[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>/i) || 
                   text.match(/可用额度\s*[:：\t]\s*([0-9.,]+)/i);
    if (bMatch) balance = clean(bMatch[1]);

    let points = '0.00';
    const pMatch = text.match(/點數餘額[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>/i) || 
                   text.match(/點數餘額\s*[:：\t]\s*([0-9.,]+)/i);
    if (pMatch) points = clean(pMatch[1]);

    let lastLogin = '无记录';
    const lMatch = text.match(/最後上線時間[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>/i) || 
                   text.match(/最後上線時間\s*[:：\t]\s*([^\n\r<]+)/i);
    if (lMatch) lastLogin = clean(lMatch[1]);

    return {
      username: username || memberUuid,
      balance: balance || '0.00',
      points: points || '0.00',
      lastLogin: lastLogin || '无记录'
    };
  } catch (err) {
    return {
      username: memberUuid,
      balance: '查询失败',
      points: '查询失败',
      lastLogin: '查询失败'
    };
  }
}

// 发送安全告警
async function sendAlert(adminName, memberInfo, timestamp) {
  const now = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
  const text = '🚨 *【安全告警】检测到清除 Google 2FA*\n\n' +
               '👤 *操作管理员*: `' + adminName + '`\n' +
               '🆔 *会员账号*: `' + memberInfo.username + '`\n' +
               '💰 *可用额度*: `' + memberInfo.balance + '`\n' +
               '🎯 *点数余额*: `' + memberInfo.points + '`\n' +
               '🌐 *最后上线*: `' + memberInfo.lastLogin + '`\n' +
               '🕒 *操作时间*: `' + (timestamp || now) + '`\n' +
               '⏱ *发现时间*: `' + now + '`';

  try {
    const res = await axios.post('https://api.telegram.org/bot' + TG_BOT_TOKEN + '/sendMessage', {
      chat_id: TG_CHAT_ID,
      text: text,
      parse_mode: 'Markdown'
    }, { timeout: 5000 });

    if (res.data && res.data.ok) {
      console.log(`✅ [TG 推送成功] 管理员: ${adminName} 清除了会员: ${memberInfo.username}`);
    }
  } catch (err) {
    console.error('❌ TG 推送失败:', err.message);
  }
}

// ==================== 3. 单个管理员巡检 ====================

async function checkAdmin(uuid) {
  const url = 'https://jemnkcwc.com/admin/users/' + uuid + '/histories';
  try {
    const res = await axios.get(url, {
      headers: {
        'Cookie': COOKIE,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      timeout: 8000,
      maxRedirects: 0,
      validateStatus: status => (status >= 200 && status < 300) || status === 302
    });

    // 严格检测闲置登出及重定向
    if (res.status === 302) {
      const location = res.headers.location || '';
      if (location.includes('sign_in') || location.includes('login')) {
        notifyCookieExpired();
      }
      return;
    }

    const html = res.data;
    if (typeof html === 'string' && html.includes('name="password"') && html.includes('commit')) {
      notifyCookieExpired();
      return;
    }

    if (!html.includes('清除') || (!html.includes('Google') && !html.includes('認證'))) return;

    // 清理标签统一空格
    const pure = html.replace(/<[^>]+>/g, ' ').replace(/[\u00a0\s]+/g, ' ');

    // 宽松正则匹配整段记录
    const regex = /管理員[\(（]([^\)）]+)[\)）][^0-9a-fA-F-]{0,80}清除[^0-9a-fA-F-]{0,80}Google[^0-9a-fA-F-]{0,80}認證[^0-9a-fA-F-]{0,80}([0-9a-fA-F-]{36})/gi;
    let match;

    while ((match = regex.exec(pure)) !== null) {
      const adminName = match[1].trim();
      const memberUuid = match[2].trim();

      // 提取时间戳
      const preSnippet = pure.slice(Math.max(0, match.index - 80), match.index);
      const timeMatch = preSnippet.match(/(\d{1,2}月\d{1,2}日\s*\d{2}:\d{2}(?::\d{2})?)/);
      const timestamp = timeMatch ? timeMatch[1].trim() : '';

      // 去重键：管理员 + 会员UUID + 时间
      const recordKey = `${adminName}_${memberUuid}_${timestamp}`;
      if (seenRecords.has(recordKey)) {
        continue;
      }
      seenRecords.add(recordKey);

      if (isInitialRun) {
        console.log(`[基线初始化收录] 管理员: ${adminName} | 目标: ${memberUuid}`);
      } else {
        console.log(`\n⚡ [实时发现 2FA 清除动作!] 操作人: ${adminName} | 会员UUID: ${memberUuid}`);
        const memberInfo = await getMemberInfo(memberUuid);
        await sendAlert(adminName, memberInfo, timestamp);
      }
    }
  } catch (err) {
    if (err.response && err.response.status === 401) {
      notifyCookieExpired();
    }
  }
}

// ==================== 4. 批量并发控制 ====================

async function scanAll() {
  const BATCH_SIZE = 8;
  for (let i = 0; i < ADMIN_UUIDS.length; i += BATCH_SIZE) {
    const batch = ADMIN_UUIDS.slice(i, i + BATCH_SIZE);
    await Promise.all(batch.map(uuid => checkAdmin(uuid)));
    await new Promise(r => setTimeout(r, 100));
  }
}

// ==================== 5. 主程序启动 ====================

(async () => {
  console.log('🚀 开始基线初始化，正在扫描 ' + ADMIN_UUIDS.length + ' 位在职管理员历史...');
  await scanAll();
  isInitialRun = false;
  console.log('✅ 初始化完成！已建立最新基线，实时侦测中（每 10 秒巡检一轮）...\n');

  setInterval(async () => {
    await scanAll();
  }, 10000);
})();

// ==================== 6. Render 保活 Web 服务 ====================

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('2FA Monitor Bot is running 24/7!');
});

app.listen(PORT, () => {
  console.log(`🌐 保活 Web 服务已启动，监听端口: ${PORT}`);
});