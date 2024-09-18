# Chrome Mute Auto

Uma extensão do Chrome que gerencia automaticamente o áudio das abas, garantindo que apenas uma aba reproduza áudio por vez, a menos que a aba esteja fixada.

## Funcionalidades

- **Silenciar outras abas**: Quando uma aba começa a reproduzir áudio, todas as outras abas são silenciadas automaticamente, exceto as abas fixadas essas continuaram com reprodução de audio.
- **Gerenciamento de áudio**: A aba atual que está reproduzindo áudio não será silenciada.
- **Detecção de áudio**: Monitora as atualizações das abas para detectar quando uma aba começa a reproduzir áudio.

## Instalação

1. Clone este repositório ou baixe o código-fonte.
2. Abra o Chrome e vá para `chrome://extensions/`.
3. Ative o "Modo de desenvolvedor" no canto superior direito.
4. Clique em "Carregar sem compactação" e selecione a pasta do projeto.
5. Feche e abra o Chrome para garantir um funcionamento correto da extensão.

## Uso

1. Após instalar a extensão, ela começará a monitorar automaticamente as abas do Chrome.
2. Quando uma aba começa a reproduzir áudio, todas as outras abas serão silenciadas, a menos que a aba atual esteja fixada.

## Contribuição

1. Faça um fork do projeto.
2. Crie uma nova branch (`git checkout -b feature/nova-funcionalidade`).
3. Faça commit das suas alterações (`git commit -am 'Adiciona nova funcionalidade'`).
4. Faça push para a branch (`git push origin feature/nova-funcionalidade`).
5. Abra um Pull Request.

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo LICENSE para mais detalhes.