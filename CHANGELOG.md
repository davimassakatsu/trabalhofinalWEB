# Changelog — Portifólio Davi Massakatsu

Todas as mudanças relevantes deste portfólio ficam registradas aqui.

O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/)
e o projeto usa [Versionamento Semântico](https://semver.org/lang/pt-BR/):

- **MAJOR** (`X.0.0`): redesign ou mudança grande de estrutura.
- **MINOR** (`2.X.0`): nova seção, novo projeto ou nova funcionalidade.
- **PATCH** (`2.0.X`): correção de texto, link ou bug pequeno.

## Como lançar uma nova versão

1. Atualize o número em `VERSION` e em `PORTFOLIO_VERSION` (`portfolio.js`).
   O número exibido no site (nav, hero e rodapé) vem dessa constante.
2. Adicione uma seção nova no topo deste arquivo, com a data.
3. Faça o commit e crie a tag:

   ```bash
   git commit -am "release: v2.1.0"
   git tag -a v2.1.0 -m "v2.1.0"
   git push origin master --tags
   ```

---

## [2.3.0] — 2026-11-17

### Adicionado
- Prévia ao vivo do **FUJIFY** no card de projetos, com o sistema publicado na
  Vercel (`agendapro-hazel.vercel.app`) e o modo "Clique para interagir".

### Alterado
- Descrição do FUJIFY reescrita: sistema de agendamento para clínicas
  odontológicas e de estética, com detalhes das funcionalidades e novas tags.
- Botão principal do FUJIFY agora leva ao site ao vivo.
- E-mail de contato atualizado para `dmfpro18@gmail.com` (início e contato).
- Currículo em PDF atualizado.

## [2.2.0] — 2026-11-17

### Adicionado
- Prévia ao vivo do **Memórias Fujimura** no card de projetos, com o site
  publicado na Vercel (`memoriasfujimura.vercel.app`) e o modo "Clique para interagir".
- Botão principal do Memórias Fujimura agora leva ao site ao vivo.

## [2.1.0] — 2026-11-17

### Adicionado
- Prévia ao vivo da **VUE** no card de projetos: o site publicado na Vercel
  (`vue-sportwear.vercel.app`) aparece dentro da janela de navegador do card,
  carregado só quando o card chega perto da tela.
- Botão "Clique para interagir" para navegar no site sem sair do portfólio.
- Botão principal da VUE agora leva ao site ao vivo (o repositório é privado).

## [2.0.0] — 2026-11-17

### Adicionado
- Nome do site alterado para **Portifólio Davi Massakatsu** (títulos, nav e preloader).
- Camada de motion futurista em `motion.css`, mantendo a paleta original:
  - preloader com contador e barra de carregamento;
  - orbe de partículas 3D no hero, que reage ao mouse, com anéis orbitais;
  - HUD decorativo, grid de fundo, grão de filme e glow que segue o cursor;
  - título com letras que entram em cascata e textos com efeito "decodificando";
  - cursor customizado, botões magnéticos, barra de progresso de rolagem;
  - reveal com blur ao rolar, anel orbital na foto, marquee de tecnologias.
- Showcase interativo em **Projetos** com FUJIFY, VUE e Memórias Fujimura:
  cards com tilt 3D, spotlight, borda luminosa animada e "Ver detalhes".
- Versionamento: `CHANGELOG.md`, `VERSION` e selo de versão no rodapé.

### Corrigido
- O JavaScript não carregava: as páginas pediam `portfolio.js`, mas o arquivo se
  chamava `portifolio.js`. O arquivo foi renomeado.
- Caminhos com `\` trocados por `/` (currículo, imagens e PDF).
- Links de GitHub, LinkedIn e e-mail da página inicial apontavam para placeholders.
- Tag `<span>` sem fechamento no título do hero.
- Com "reduzir movimento" ativo, o hero ficava invisível.

## [1.0.0] — 2026-06-29

### Adicionado
- Versão inicial: páginas Sobre, Projetos e Contato, fundo de estrelas,
  formulário de contato com validação e filtro de projetos.
