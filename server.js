const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// 从 Render 的环境变量中自动读取 Token 和 群 ID
const TG_BOT_TOKEN = process.env.TG_BOT_TOKEN;
const TG_CHAT_ID = process.env.TG_CHAT_ID;

// 接收后台请求的接口
app.post('/notify-2fa', async (req, res) => {
  const { account, lastOnline, operator, location } = req.body;
  const now = new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
// 添加对根路径的处理，让 UptimeRobot 收到 200 状态码
app.get('/', (req, res) => {
  res.status(200).send('OK');
});
  const text = `
🚨 **【后台安全警告 - 谷歌验证码已重置】**
━━━━━━━━━━━━━━━━━━
📍 **操作来源**：\`${location || '专属谷歌清除页面'}\`
👤 **操作人员**：\`${operator || '管理员'}\`
📧 **目标账号**：\`${account || '未知账号'}\`
⏰ **最后上线**：\`${lastOnline || '无记录/未上线'}\`
⏱️ **操作时间**：\`${now}\`
━━━━━━━━━━━━━━━━━━
⚠️ *如果非本人授权操作，请检查后台系统账号安全！*
  `.trim();

  try {
    await axios.post(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
      chat_id: TG_CHAT_ID,
      text: text,
      parse_mode: 'Markdown'
    });
    return res.json({ success: true, message: '通知已成功发送至 Telegram' });
  } catch (error) {
    console.error('发送失败:', error.response?.data?.description || error.message);
    return res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`服务运行中，端口：${PORT}`));