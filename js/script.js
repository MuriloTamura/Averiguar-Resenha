const FRASES = [
    {
        texto: "Resenha Confirmada!",
        imagem: "images/resenha-confirmada.jpg"
    },
    {
        texto: "Resenha Cancelada",
        imagem: "images/resenha-cancelada.jpg"
    }
];

function revelarFrase() {
    const hoje = new Date().toDateString();
    const ultimoClique = localStorage.getItem('ultimoClique');
    
    // Verifica se já clicou hoje
    if (ultimoClique === hoje) {
        return;
    }
    
    // Mostra loading e esconde conteúdo anterior
    const loading = document.getElementById('loading');
    const fraseContainer = document.getElementById('fraseContainer');
    const imagemContainer = document.getElementById('imagemContainer');
    const btnRevelar = document.getElementById('btnRevelar');
    
    loading.classList.add('active');
    fraseContainer.classList.add('hidden');
    imagemContainer.classList.add('hidden');
    btnRevelar.disabled = true;
    
    // Simula tempo de processamento (3 segundos)
    setTimeout(() => {
        // Escolhe uma frase aleatoriamente (50% de chance cada)
        const indiceAleatorio = Math.random() < 0.5 ? 0 : 1;
        const fraseEscolhida = FRASES[indiceAleatorio];
        
        // Salva a frase e a data do clique
        localStorage.setItem('fraseDodia', JSON.stringify(fraseEscolhida));
        localStorage.setItem('ultimoClique', hoje);
        
        // Esconde loading
        loading.classList.remove('active');
        
        // Exibe a frase e imagem
        exibirFrase();
        atualizarBotao();
    }, 3000);
}

function exibirFrase() {
    const fraseContainer = document.getElementById('fraseContainer');
    const imagemContainer = document.getElementById('imagemContainer');
    const imagemPrincipal = document.getElementById('imagemPrincipal');
    const fraseSalva = localStorage.getItem('fraseDodia');
    
    if (fraseSalva) {
        const fraseObj = JSON.parse(fraseSalva);
        
        // Exibe a frase
        fraseContainer.innerHTML = `<p class="frase">${fraseObj.texto}</p>`;
        fraseContainer.classList.remove('hidden');
        
        // Troca a imagem
        imagemPrincipal.src = fraseObj.imagem;
        imagemPrincipal.alt = fraseObj.texto;
        imagemContainer.classList.remove('hidden');
    }
}

function atualizarBotao() {
    const hoje = new Date().toDateString();
    const ultimoClique = localStorage.getItem('ultimoClique');
    const btnRevelar = document.getElementById('btnRevelar');
    const tempoRestante = document.getElementById('tempoRestante');
    
    if (ultimoClique === hoje) {
        btnRevelar.disabled = true;
        btnRevelar.textContent = 'Já revelado hoje';
        
        // Calcula tempo até meia-noite
        const agora = new Date();
        const amanha = new Date(agora);
        amanha.setDate(amanha.getDate() + 1);
        amanha.setHours(0, 0, 0, 0);
        
        const diferenca = amanha - agora;
        const horas = Math.floor(diferenca / (1000 * 60 * 60));
        const minutos = Math.floor((diferenca % (1000 * 60 * 60)) / (1000 * 60));
        
        tempoRestante.textContent = `Próxima averiguação disponível em ${horas}h ${minutos}min`;
    } else {
        // Reseta para o estado inicial quando pode clicar novamente
        btnRevelar.disabled = false;
        btnRevelar.textContent = 'averiguar';
        tempoRestante.textContent = '';
        resetarParaEstadoInicial();
    }
}

function resetarParaEstadoInicial() {
    const ultimoClique = localStorage.getItem('ultimoClique');
    const hoje = new Date().toDateString();
    
    // Só reseta se o último clique foi em um dia diferente
    if (ultimoClique && ultimoClique !== hoje) {
        const fraseContainer = document.getElementById('fraseContainer');
        const imagemContainer = document.getElementById('imagemContainer');
        const imagemPrincipal = document.getElementById('imagemPrincipal');
        
        // Volta para a imagem inicial
        imagemPrincipal.src = 'images/jarvis resenha.jpeg';
        imagemPrincipal.alt = 'Jarvis';
        imagemContainer.classList.remove('hidden');
        
        // Volta para o texto inicial
        fraseContainer.innerHTML = '<p style="color: #999;">Clique no botão para averiguar resenha</p>';
        fraseContainer.classList.remove('hidden');
        
        // Limpa o localStorage
        localStorage.removeItem('fraseDodia');
    }
}

// Inicializa ao carregar a página
window.onload = function() {
    exibirFrase();
    atualizarBotao();
    
    // Atualiza o contador a cada minuto
    setInterval(atualizarBotao, 60000);
};