const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", 
  port: 587,
  secure: false, 
  auth: {
    user: String(process.env.MAIL_USER || "").trim(),
    pass: String(process.env.MAIL_PASS || "").trim(),
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Adicionada a variável senhaUsuario
const enviarEmailBoasVindas = async (emailUsuario, nomeUsuario, senhaUsuario) => {
  if (!process.env.MAIL_USER || !process.env.MAIL_PASS) {
    console.error('>>> [AVISO]: Credenciais de e-mail ausentes no .env');
    return;
  }

  try {
    await transporter.sendMail({
      from: `"Simulado Medicina" <${process.env.MAIL_USER.trim()}>`,
      to: emailUsuario.trim(),
      subject: "Bem-vindo ao Simulado! 🎓",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; color: #333;">
          <h2 style="color: #2c3e50;">Olá, ${nomeUsuario}!</h2>
          <p>Seu cadastro foi realizado com sucesso. Agora você já pode começar seus estudos!</p>
          
          <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #2c3e50;">Seus dados de acesso:</h3>
            <p style="margin-bottom: 5px;"><strong>E-mail:</strong> ${emailUsuario}</p>
            <p style="margin-top: 0;"><strong>Senha:</strong> ${senhaUsuario}</p>
          </div>
          
          <p>Acesse o portal para começar!</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #7f8c8d;">Esta é uma mensagem automática do seu sistema de simulados.</p>
        </div>
      `
    });
    console.log('>>> [SUCESSO]: E-mail com senha enviado para:', emailUsuario);
  } catch (error) {
    console.error('>>> [ERRO NO SERVIÇO DE E-MAIL]:', error.message);
  }
};

module.exports = { enviarEmailBoasVindas };