const venom = require('venom-bot');
const opn = require('opn');
opn('https://www.google.com', {app: ['chrome', '--incognito']});

venom
  .create()
  .then((client) => {
    console.log('WhatsApp Bot iniciado!');
    const qrcode = require('qrcode-terminal');

// Gera o código QR e exibe no terminal
client
  .getQRCode()
  .then((qrCode) => {
    qrcode.generate(qrCode, { small: true });
  })
  .catch((error) => {
    console.error('Erro ao gerar o código QR:', error);
  });
    // Função para enviar uma mensagem de boas-vindas quando o usuário iniciar uma conversa com o bot
    function sendWelcomeMessage(from) {
      const message = `Olá! Eu sou o bot de figurinhas. Para criar uma figurinha, basta me enviar uma imagem. Experimente agora mesmo!`;
      client.sendText(from, message);
    }

    // Função para criar a figurinha a partir de uma imagem enviada pelo usuário
    function createSticker(from, imageUrl) {
      client
        .sendImageAsSticker(from, imageUrl)
        .then(() => {
          const message = `Figurinha criada com sucesso!`;
          client.sendText(from, message);
        })
        .catch((error) => {
          console.error('Erro ao criar figurinha:', error);
          const message = `Não foi possível criar a figurinha. Por favor, tente novamente mais tarde.`;
          client.sendText(from, message);
        });
    }

    client.onMessage((message) => {
      // Verifica se a mensagem é do tipo texto
      if (message.type === 'chat') {
        const body = message.body.toLowerCase();

        // Verifica se a mensagem contém a palavra-chave "figurinha"
        if (body.includes('figurinha')) {
          const from = message.from;
          sendWelcomeMessage(from);

          // Aguarda a imagem ser enviada pelo usuário
          client.onMessage((message) => {
            if (message.type === 'image') {
              const imageUrl = message.body;
              createSticker(from, imageUrl);
            }
          });
        }
      }
    });
  })
  .catch((error) => {
    console.error('Erro ao iniciar o bot:', error);
  });