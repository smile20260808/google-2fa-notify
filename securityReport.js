const axios = require('axios');

// ==========================================
// 🔒 安全配置区域（请填入你的真实参数）
// ==========================================
const TG_BOT_TOKEN = '8953921694:AAHzXS2zqmLB2qwwjJ85PowflRaOMA66tsw'; // 替换为你的 Bot Token
const TG_CHAT_ID = '-1004423976022';     // 替换为你的带 -100 开头的群 ID

/**
 * 指定页面/功能的谷歌验证码清除专属回报函数
 */
async function send2FAResetReport({ operator, targetAccount, locationName }) {
  if (!TG_BOT_TOKEN || !TG_CHAT_ID) {
    console.error('❌ 安全错误：未配置 TG_BOT_TOKEN 或 TG_CHAT_ID');
    return;
  }

  const now = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });

  // 拼装通知消息格式
  const reportMessage = `
🚨 **【后台安全警告 - 谷歌验证码 (2FA) 已重置】**
━━━━━━━━━━━━━━━━━━
📍 **操作来源**：\`${locationName || '未指定特定入口'}\`
👤 **操作人员**：\`${operator || '管理员'}\`
📧 **目标账号**：\`${targetAccount}\`
🔑 **重置内容**：\`Google Authenticator 谷歌验证码\`
⏰ **操作时间**：\`${now}\`
━━━━━━━━━━━━━━━━━━
⚠️ *如果非本人授权操作，请立即检查后台系统安全！*
  `.trim();

  try {
    await axios.post(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
      chat_id: TG_CHAT_ID,
      text: reportMessage,
      parse_mode: 'Markdown'
    }, {
      timeout: 5000 // 5 秒超时保护
    });
    console.log('✅ 谷歌验证码重置回报已成功推送至飞机群');
  } catch (error) {
    console.error('❌ 发送 TG 通知失败:', error.response?.data?.description || error.message);
  }
}

module.exports = { send2FAResetReport };