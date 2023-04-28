const venom = require('venom-bot');
const qrcode = require('qrcode-terminal');

function sendWelcomeMessage(client, from) {
  const message = `Olá! Eu sou o bot de figurinhas. Para criar uma figurinha, basta me enviar uma imagem. Experimente agora mesmo!`;
  return client.sendText(from, message);
}

async function createSticker(client, from, imageUrl) {
  try {
    await client.sendImageAsSticker(from, imageUrl);
    const message = `Figurinha criada com sucesso!`;
    return client.sendText(from, message);
  } catch (error) {
    console.error('Erro ao criar figurinha:', error);
    const message = `Não foi possível criar a figurinha. Por favor, tente novamente mais tarde.`;
    return client.sendText(from, message);
  }
}

venom.create()
  .then(async (client) => {
    console.log('WhatsApp Bot iniciado!');

    // Gera o código QR e exibe no terminal
    const qrCode = await client.getQRCode();
    qrcode.generate(qrCode, { small: true });

    client.onMessage(async (message) => {
      // Verifica se a mensagem é do tipo texto
      if (message.type === 'chat') {
        const body = message.body.toLowerCase();

        // Verifica se a mensagem contém a palavra-chave "figurinha"
        if (body.includes('figurinha')) {
          const from = message.from;
          await sendWelcomeMessage(client, from);

          // Aguarda a imagem ser enviada pelo usuário
          const imageMessage = await client.waitForMessage(from, { type: 'image' });
          const imageUrl = imageMessage.body;
          await createSticker(client, from, imageUrl);
        }
      }
    });
  })
  .catch((error) => {
    console.error('Erro ao iniciar o bot:', error);
  });
