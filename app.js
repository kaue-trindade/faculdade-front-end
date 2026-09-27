// ==========================================================
// ONG AU AU - SCRIPT PRINCIPAL (SPA + TEMPLATES DINÂMICOS)
// ==========================================================

// 1. DADOS DE ORIGEM (Array de Objetos para alimentar os templates)
const listaCaes = [
  {
    status: 'Disponíveis',
    badge: 'badge-success',
    imagem: '../imagens/cachorro1.jpg',
    descricao: 'Cachorro resgatado'
  },
  {
    status: 'Vacinados',
    badge: 'badge-info',
    imagem: '../imagens/cachorro2.jpg',
    descricao: 'Cachorro disponível para adoção'
  },
  {
    status: 'Castrados',
    badge: 'badge-success',
    imagem: '../imagens/cachorro3.jpg',
    descricao: 'Cachorro brincando'
  }
];

// 2. SISTEMA DE TEMPLATE: Converte os dados em elementos HTML com .map()
function gerarCardsCaesHTML() {
  return listaCaes.map(cao => `
    <div class="card">
      <span class="badge ${cao.badge}">${cao.status}</span>
      <img src="${cao.imagem}" alt="${cao.descricao}">
    </div>
  `).join('');
}

// 3. MAPEAMENTO DAS ROTAS DA SPA
const rotas = {
  '/': `
    <div class="alert-box">
      <strong>Aviso importante:</strong> Feira de adoção presencial neste fim de semana!
    </div>

    <section class="sobre-section">
      <h2>Sobre a ONG Au Au</h2>
      <p>A ONG Au Au trabalha para resgatar, cuidar e encontrar novos lares para cães em situação de abandono.</p>
    </section>

    <h2>Algumas fotos</h2>
    <section class="cards-container">
      ${gerarCardsCaesHTML()}
    </section>

    <div class="toast">
      <p>🐶 Conheça nossos peludinhos disponíveis!</p>
    </div>
  `,

  '/projetos': `
    <div class="alert-box">
      <strong>Participe:</strong> Nossos projetos acontecem graças ao apoio de voluntários!
    </div>

    <section class="sobre-section">
      <h2>Nossos Projetos</h2>
      <p>Conheça as principais iniciativas e ações que desenvolvemos diariamente para resgatar e proteger cães.</p>
    </section>

    <section class="cards-container">
      <article class="card card-projeto">
        <span class="badge badge-success">Resgate</span>
        <img src="../imagens/caesabn.jpg" alt="Resgate de cães abandonados">
        <div class="card-content">
          <h3>Resgate de Cães</h3>
          <p>Nosso projeto de resgate visa salvar cães em situação de abandono e vulnerabilidade.</p>
        </div>
      </article>

      <article class="card card-projeto">
        <span class="badge badge-info">Adoção</span>
        <img src="../imagens/ciaadocao.jpg" alt="Campanha de Adoção">
        <div class="card-content">
          <h3>Campanha de Adoção</h3>
          <p>Promovemos feiras e campanhas para conectar animais a famílias responsáveis e amorosas.</p>
        </div>
      </article>

      <article class="card card-projeto">
        <span class="badge badge-success">Conscientização</span>
        <img src="../imagens/novostutores.jpg" alt="Seleção de Novos Tutores">
        <div class="card-content">
          <h3>Seleção de Novos Tutores</h3>
          <p>Entrevistas e orientações para garantir um ambiente seguro e acolhedor para cada cão.</p>
        </div>
      </article>
    </section>
  `,

  '/cadastro': `
    <div class="alert-box">
      <strong>Participe:</strong> Escolha abaixo se deseja ser voluntário ou adotar um cãozinho!
    </div>

    <section class="sobre-section">
      <h2>Formulário de Cadastro</h2>
      <p>Preencha os dados abaixo com atenção. Nossa equipe entrará em contato.</p>
    </section>

    <form class="form-cadastro">
      <fieldset class="form-fieldset">
        <legend>Tipo de Cadastro</legend>
        <div class="radio-group">
          <label><input type="radio" name="tipoCadastro" value="voluntario" required checked> Voluntário</label>
          <label><input type="radio" name="tipoCadastro" value="tutor" required> Tutor (Adoção)</label>
        </div>
      </fieldset>

      <fieldset class="form-fieldset" id="bloco-voluntario">
        <legend>Dados do Voluntário</legend>
        <div class="form-group">
          <label for="nomeVol">Nome Completo:</label>
          <input type="text" id="nomeVol" required>
        </div>
        <div class="form-group">
          <label for="telVol">Telefone:</label>
          <input type="tel" id="telVol" required>
        </div>
      </fieldset>

      <fieldset class="form-fieldset" id="bloco-tutor" style="display: none;">
        <legend>Dados para Adoção (Tutor)</legend>
        <div class="form-group">
          <label for="nomeTut">Nome completo:</label>
          <input type="text" id="nomeTut">
        </div>
        <div class="form-group">
          <label for="telTut">Telefone:</label>
          <input type="tel" id="telTut">
        </div>
      </fieldset>

      <button type="submit" class="btn">Enviar Cadastro</button>
    </form>
  `
};

// 4. FUNÇÃO CENTRAL DE ROTEAMENTO (MANIPULAÇÃO DO DOM VIA HASH)
function navegar(caminho) {
  const container = document.getElementById('conteudo-principal');
  if (!container) return;

  // Normaliza o caminho para encontrar a rota certa
  let chave = caminho;
  if (caminho.includes('projetos')) chave = '/projetos';
  else if (caminho.includes('cadastro')) chave = '/cadastro';
  else chave = '/';

  // Injeta o fragmento HTML da rota no contêiner principal
  container.innerHTML = rotas[chave] || '<h2>Página não encontrada</h2>';

  // Atualiza o hash da URL (ex: index.html#projetos)
  // O hash funciona perfeitamente no protocolo file:// pois não recarrega a tela
  const hashNovo = chave === '/' ? '' : chave.replace('/', '');
  if (window.location.hash.replace('#', '') !== hashNovo) {
    window.location.hash = hashNovo;
  }

  if (chave === '/cadastro') {
    configurarAlternanciaCadastro();
  }

  const menuToggle = document.getElementById('menu-toggle');
  if (menuToggle) menuToggle.checked = false;
}

// 5. INTERCEPTAÇÃO DOS LINKS DO MENU
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', (evento) => {
    evento.preventDefault();
    const destino = link.getAttribute('href');
    navegar(destino);
  });
});

// Quando o usuário usa os botões de voltar/avançar, o hash muda automaticamente
// O evento 'hashchange' detecta isso e renderiza a rota correspondente
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.replace('#', '');
  navegar(hash || '/');
});

// 6. VALIDAÇÃO DE CAMPOS (manipulação condicional do DOM)
// Função auxiliar: aplica estilo de erro/sucesso e injeta mensagem no HTML
function validarCampo(campo, condicao, mensagem) {
  // Remove mensagem de erro anterior se existir
  const erroAnterior = campo.parentElement.querySelector('.mensagem-erro');
  if (erroAnterior) erroAnterior.remove();

  if (!condicao) {
    // Campo INVÁLIDO: borda vermelha + mensagem injetada no DOM
    campo.classList.add('campo-erro');
    campo.classList.remove('campo-sucesso');

    const span = document.createElement('span'); // cria o elemento de aviso
    span.className = 'mensagem-erro';
    span.textContent = mensagem;
    campo.parentElement.appendChild(span); // injeta abaixo do campo

    return false; // falhou
  } else {
    // Campo VÁLIDO: borda verde
    campo.classList.remove('campo-erro');
    campo.classList.add('campo-sucesso');
    return true; // passou
  }
}

// Função que valida todos os campos do formulário antes de enviar
function validarFormulario() {
  const tipoCadastro = document.querySelector('input[name="tipoCadastro"]:checked')?.value;
  const regexTel = /^\d{10,11}$/; // Aceita somente números com 10 ou 11 dígitos
  let formularioValido = true;

  if (tipoCadastro === 'voluntario') {
    const nome = document.getElementById('nomeVol');
    const tel  = document.getElementById('telVol');

    const nomeOk = validarCampo(nome, nome.value.trim() !== '', 'Nome obrigatório.');
    const telOk  = validarCampo(tel,  regexTel.test(tel.value), 'Telefone inválido (10 ou 11 dígitos).');

    formularioValido = nomeOk && telOk;
  } else {
    const nome = document.getElementById('nomeTut');
    const tel  = document.getElementById('telTut');

    const nomeOk = validarCampo(nome, nome.value.trim() !== '', 'Nome obrigatório.');
    const telOk  = validarCampo(tel,  regexTel.test(tel.value), 'Telefone inválido (10 ou 11 dígitos).');

    formularioValido = nomeOk && telOk;
  }

  return formularioValido;
}

// 7. LÓGICA DO FORMULÁRIO (VOLUNTÁRIO VS TUTOR + SUBMIT)
function configurarAlternanciaCadastro() {
  const radios = document.querySelectorAll('input[name="tipoCadastro"]');
  const blocoVoluntario = document.getElementById('bloco-voluntario');
  const blocoTutor = document.getElementById('bloco-tutor');

  if (!radios.length || !blocoVoluntario || !blocoTutor) return;

  function atualizarVisibilidade() {
    const selecionado = document.querySelector('input[name="tipoCadastro"]:checked')?.value;

    if (selecionado === 'tutor') {
      blocoVoluntario.style.display = 'none';
      blocoTutor.style.display = 'block';
      blocoVoluntario.querySelectorAll('input, select, textarea').forEach(el => el.disabled = true);
      blocoTutor.querySelectorAll('input, select, textarea').forEach(el => el.disabled = false);
    } else {
      blocoVoluntario.style.display = 'block';
      blocoTutor.style.display = 'none';
      blocoTutor.querySelectorAll('input, select, textarea').forEach(el => el.disabled = true);
      blocoVoluntario.querySelectorAll('input, select, textarea').forEach(el => el.disabled = false);
    }
  }

  radios.forEach(radio => radio.addEventListener('change', atualizarVisibilidade));
  atualizarVisibilidade();

  // Exibe os cadastros já salvos no localStorage ao abrir a página
  exibirCadastrosSalvos();

  // Tratamento do evento SUBMIT com validação + localStorage
  const formulario = document.querySelector('.form-cadastro');
  if (formulario) {
    formulario.addEventListener('submit', (evento) => {
      evento.preventDefault(); // Impede o reload da página

      // Só prossegue se todos os campos passarem na validação
      if (validarFormulario()) {
        const tipoCadastro = document.querySelector('input[name="tipoCadastro"]:checked')?.value;

        // Coleta os dados do formulário em um objeto
        const nome = tipoCadastro === 'voluntario'
          ? document.getElementById('nomeVol').value.trim()
          : document.getElementById('nomeTut').value.trim();

        const tel = tipoCadastro === 'voluntario'
          ? document.getElementById('telVol').value
          : document.getElementById('telTut').value;

        const novoCadastro = { tipo: tipoCadastro, nome, telefone: tel };

        // Lê a lista atual do localStorage e converte de texto para array (JSON.parse)
        const listaSalva = localStorage.getItem('cadastros');
        const lista = listaSalva ? JSON.parse(listaSalva) : [];

        // Adiciona o novo cadastro na lista
        lista.push(novoCadastro);

        // Converte o array de volta para texto e salva no localStorage (JSON.stringify)
        localStorage.setItem('cadastros', JSON.stringify(lista));

        alert('🐾 Cadastro enviado com sucesso! Entraremos em contato.');
        formulario.reset();
        atualizarVisibilidade();

        // Limpa as classes de feedback após o reset
        formulario.querySelectorAll('input').forEach(el => {
          el.classList.remove('campo-sucesso', 'campo-erro');
        });

        // Atualiza a lista exibida na tela com o novo cadastro
        exibirCadastrosSalvos();
      }
    });
  }
}

// 8. LOCALSTORAGE: recupera e exibe os cadastros salvos na tela
function exibirCadastrosSalvos() {
  // Remove lista anterior para evitar duplicatas
  const listaExistente = document.getElementById('lista-cadastros');
  if (listaExistente) listaExistente.remove();

  // Recupera o texto salvo no localStorage
  const listaSalva = localStorage.getItem('cadastros');
  if (!listaSalva) return;

  // Converte o texto de volta para array de objetos (JSON.parse)
  const lista = JSON.parse(listaSalva);
  if (!lista.length) return;

  // Usa .map() com Template Literal para gerar o HTML de cada item
  const listaHTML = lista.map(item => `
    <li>
      <strong>${item.tipo === 'voluntario' ? '🙋 Voluntário' : '🐶 Tutor'}</strong>
      — ${item.nome} | ${item.telefone}
    </li>
  `).join('');

  // Cria a seção e injeta no contêiner principal
  const container = document.getElementById('conteudo-principal');
  if (!container) return;

  const secao = document.createElement('section');
  secao.id = 'lista-cadastros';
  secao.className = 'sobre-section';
  secao.innerHTML = `
    <h3>📋 Cadastros Recebidos (${lista.length})</h3>
    <ul>${listaHTML}</ul>
  `;
  container.appendChild(secao);
}

// 7. INICIALIZAÇÃO: ao carregar a página, lê o hash e abre a rota correta
document.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash.replace('#', '');
  // Se houver um hash na URL (ex: #projetos), navega para ele
  // Caso contrário, carrega a página inicial
  navegar(hash || '/');
});
