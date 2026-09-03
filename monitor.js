const { chromium } = require('playwright');
const axios = require('axios');
const { authenticator } = require('otplib');

// 配置信息（请替换为你的真实信息）
const RENDER_WEBHOOK_URL = 'https://google-2fa-notify.onrender.com/notify-2fa';
const ADMIN_URL = 'https://jemnkcwc.com/admin';
const USERNAME = 'peiai@gmail.com';
const PASSWORD = 'a123456789';
const TWO_FACTOR_SECRET = 'TV646YMZWSGXHHUTL5NVSOAU327NPUXP'; // 替换为你的 16 或 32 位密钥（不要加空格）

let notifiedLogIds = new Set(); // 防止重复推送

async function runMonitor() {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
try { 
    console.log('🚀 正在打开后台登录页面...');
    await page.goto(ADMIN_URL);
    await page.waitForTimeout(2000);

    // 1. 自动填写账号密码
    await page.fill('input[type="text"]', USERNAME);
    await page.fill('input[type="password"]', PASSWORD);

    // 2. 自动生成并填写 6 位谷歌验证码
    const twoFactorCode = authenticator.generate(TWO_FACTOR_SECRET);
    console.log(`🔐 自动计算出的 2FA 动态验证码: ${twoFactorCode}`);

    // 如果验证码有独立输入框，尝试自动填写（支持常见验证码框选择器）
    const twoFactorInput = await page.$('input[placeholder*="验证码"], input[placeholder*="Google"], input[name*="code"], input[name*="two_factor"]');
    if (twoFactorInput) {
      await twoFactorInput.fill(twoFactorCode);
    }

    // 点击登录提交按钮
    const submitBtn = await page.$('button[type="submit"]');
    if (submitBtn) await submitBtn.click();

    await page.waitForTimeout(3000);
    console.log('✅ 全自动登录完成，开始定时轮询监听历史记录...');

    // 3. 定时轮询监听（每 15 秒刷新一次）
    setInterval(async () => {
      try {
        await page.reload();
        await page.waitForTimeout(2000);

        const pageContent = await page.content();

        if (pageContent.includes('清除了 Google 認證')) {
          const historyItems = await page.$$eval('body', elements => 
            elements.map(e => e.innerText)
          );

          for (const text of historyItems) {
            if (text.includes('清除了 Google 認證')) {
              const logLines = text.split('\n').filter(line => line.includes('清除了 Google 認證'));

              for (const line of logLines) {
                const logUniqueId = line.trim();
                
                if (!notifiedLogIds.has(logUniqueId)) {
                  notifiedLogIds.add(logUniqueId);

                  // 提取管理员名称
                  const adminMatch = line.match(/(管理员\(.*?\))/);
                  const operator = adminMatch ? adminMatch[1] : '系统管理员';

                  // 推送到 Render 机器人
                  await axios.post(RENDER_WEBHOOK_URL, {
                    account: '查看的会员账号',
                    operator: operator,
                    lastOnline: new Date().toLocaleString(),
                    location: line
                  });

                  console.log(`🚀 [推送成功] 检测到新记录: ${line}`);
                }
              }
            }
          }
        }
      } catch (err) {
        console.error('刷新页面或提取数据失败:', err.message);
      }
    }, 15000);

  } catch (err) {
    console.error('运行失败:', err.message);
  }
}

runMonitor();