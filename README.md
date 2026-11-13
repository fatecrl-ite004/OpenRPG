# OpenRPG

Sistema web para gerenciamento ágil de sessões de RPG de mesa (TTRPG), voltado para a comunidade geek, mestres e jogadores. O objetivo da plataforma é solucionar a desorganização de informações durante as partidas (fichas em papel dispersas, controle manual de vida e interrupções na narrativa), centralizando campanhas, fichas digitais, inventários, anotações e simulação tática de combate em uma interface leve, funcional e acessível diretamente no navegador.

## Funcionalidades

- **Vitrine e Separação de Perfis:** Página inicial independente com roteamento limpo e direto entre a **Área do Mestre** e a **Área do Jogador**.
- **Área do Jogador (Standalone):** Ambiente exclusivo e isolado para o jogador gerenciar sua própria ficha, controlar Vida Atual e Máxima (com botões de cálculo rápido), Defesa (CA), Iniciativa, atributos modulares, inventário/mochila e rolador de dados com áudio.
- **Painel do Mestre com Campanhas Unificadas:** Criação, edição, alternância e isolamento completo de campanhas integrados no topo do painel, cadastro simplificado de jogadores da mesa, rolador de dados poliédricos (d4 a d100 com atalhos numéricos 1 a 7) e bloco de anotações de sessão com salvamento contínuo (`oninput`).
- **Fichas Digitais Parametrizáveis:** Controle de atributos vitais (Vida Máxima, Iniciativa, Defesa/CA e Mochila/Inventário detalhado), criação dinâmica de parâmetros personalizados pelo mestre e envio em um clique (`⚔️ Ao Combate`).
- **Suíte de Temas e Criador de Temas Customizados:** Seleção imediata entre 4 temas visuais integrados (*Dark Obsidian*, *Pergaminho Fantasia*, *Cyberpunk Night* e *Grimdark Monocromo*), além de um **Criador de Temas** completo com escolha livre de paleta de cores (fundo, cards, barra lateral, texto, destaque e bordas), suporte a **imagem de fundo personalizada** (upload de arquivo local ou link web externo) com controle de opacidade do overlay (0% a 100%), *live preview* em tempo real e exportação/importação de temas em arquivos `.json`.
- **Portabilidade Total em JSON:** Exportação e importação de backup geral da campanha, de fichas individuais avulsas e de temas visuais personalizados em formato `.json`.
- **Simulação de Combate Tático:** Rastreador ágil de iniciativa e turnos (com avanço automático de rodadas e destaque do combatente ativo via atalhos de teclado), recrutamento em um clique dos jogadores, inserção rápida de inimigos/NPCs, ajuste rápido de dano/cura (-5, -1, +1, +5) e alternância instantânea de condições de status (Caído, Atordoado, Sangrando, Envenenado, Cego, Invisível).
- **Acessibilidade Universal:** Painel de configurações com escala de texto customizável, modo de alto contraste, fonte adaptada para dislexia (*Lexend*), redução de animações e retorno sonoro/leitura por voz das rolagens de dados.

## Tecnologias utilizadas

- **Linguagens:** HTML5, CSS3, JavaScript (ES6+ nativo / Vanilla JS).
- **Web APIs:** Web Storage API (`localStorage`), Web Audio API, Web Speech Synthesis API.
- **Armazenamento:** Persistência cliente-side desacoplada e serializada em JSON no próprio navegador.
- **Hospedagem:** GitHub Pages.

## Pré-requisitos

Antes de executar o projeto localmente, verifique se você possui:

- [Git](https://git-scm.com/) instalado no computador (opcional, para clonar o repositório).
- Um navegador web moderno instalado (Google Chrome, Mozilla Firefox, Microsoft Edge, Safari ou compatíveis).

> Por ser uma aplicação desenvolvida com tecnologias web nativas sem dependências compiladas, **não é obrigatório ter Node.js ou npm instalados** para executar o projeto.

## Instalação e configuração

### 1. Obter o código-fonte

Clone o repositório e acesse o diretório do projeto:

```bash
git clone https://github.com/fatecrl-ite004/OpenRPG.git
cd OpenRPG
```

### 2. Instalar as dependências

Por se tratar de uma aplicação construída puramente com HTML, CSS e JavaScript nativos (*Vanilla JS*), **não há pacotes ou dependências externas a serem instaladas**. Nenhuma etapa de `npm install` é necessária.

### 3. Configurar o ambiente

Nenhuma configuração de variáveis de ambiente (`.env`) ou banco de dados externo é necessária. Todos os dados são armazenados localmente e de forma isolada por campanha e jogador no próprio navegador através do `localStorage`.

## Execução em ambiente de desenvolvimento

A aplicação pode ser executada de forma simples e direta:

### Opção 1: Abertura direta no navegador
Dê um duplo clique no arquivo `index.html` ou abra-o em qualquer navegador web.

### Opção 2: Servidor local estático (Recomendado)
Para uma experiência idêntica à de produção:

- **Via extensão do VS Code:** Utilize a extensão *Live Server*, clicando com o botão direito sobre o arquivo `index.html` e escolhendo **"Open with Live Server"**.
- **Via Python:**
  ```bash
  python -m http.server 3000
  ```
  Em seguida, acesse no navegador: `http://localhost:3000/`

## Build para produção

Por ser uma aplicação web estática nativa, o **OpenRPG não necessita de etapas de compilação ou empacotamento** (dispensando ferramentas de build como Vite ou Webpack). Os próprios arquivos-fonte (`index.html`, `jogador.html`, `mestre.html`, `fichas.html`, `combate.html`, `settings.js`, `style.css` e pasta `img/`) já constituem os arquivos prontos para deploy e publicação em qualquer servidor web ou CDN estática.

### Testar a versão de produção localmente

Abra os arquivos em uma janela anônima no navegador para testar o isolamento e persistência das campanhas e fichas no `localStorage` sem interferência de dados anteriores.

## Aplicação publicada

A aplicação está publicada e acessível publicamente via GitHub Pages:

- **Aplicação:** https://fatecrl-ite004.github.io/OpenRPG/

## Estrutura do projeto

```text
OpenRPG/
├── img/
│   └── icon.webp            # Logotipo e ícone oficial da aplicação
├── combate.html             # Módulo de Simulação de Combate (Iniciativa, turnos e HP tático)
├── fichas.html              # Módulo de Fichas de Personagem (Parâmetros customizados, EXPORTAR/IMPORTAR)
├── index.html               # Vitrine e roteamento inicial (Entrada como Mestre ou Jogador)
├── jogador.html             # Área do Jogador Standalone (Ficha solo, HP, mochila e dados)
├── mestre.html              # Painel do Mestre e Campanhas Unificadas (Jogadores, dados e anotações)
├── settings.js              # Módulo compartilhado de Temas, Criador de Temas, Acessibilidade e Áudio
├── style.css                # Folha de estilos unificada e design system da aplicação
└── README.md                # Documentação oficial do projeto
```

## Equipe

| Integrante | Responsabilidade |
|---|---|
| Leandro Andrade dos Santos | Desenvolvedor Fullstack / Documentação e Arquitetura |
| Ryan Xavier Paz Corrêa Amaral | Desenvolvedor Fullstack / Design e Interface |

## Documentação adicional

Consulte a [Wiki do projeto](https://github.com/fatecrl-ite004/OpenRPG/wiki) para obter informações complementares, como apresentação, requisitos, decisões de projeto, protótipos e roadmap.
