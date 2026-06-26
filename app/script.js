const API_URL = 'https://script.google.com/macros/s/AKfycbxUz45jXZEvsOzF0SM2eZk3FWVE8wumz6oZiwmqYlL5KoB5ikfMq40K4WpSAKMxPLy2/exec';

window.addEventListener('DOMContentLoaded', () => {
    // Apenas para garantir que o total seja carregado após a atualização
    updateTotalDonations().then(() => {
        getTotalDonations();
        getDonations();
    });
});

function getTotalDonations() {
    fetch(`${API_URL}?acao=getTotal`)
        .then(res => res.json())
        .then(data => {
            // Se o retorno for o número direto (ex: 0.86), usamos 'data'
            // Se for um objeto { total: 0.86 }, usamos 'data.total'
            const valor = typeof data === 'object' ? data.total : data;

            // Formata para moeda brasileira
            const valorFormatado = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            }).format(valor);

            document.getElementById('total-arrecadado').textContent = valorFormatado;
        })
        .catch(err => console.error('Erro ao buscar total:', err));
}

function getDonations() {
    fetch(`${API_URL}?acao=getTransacoes`)
        .then(res => res.json())
        .then(data => {
            const container = document.getElementById('lista-doadores');
            // Extrai apenas a 'description' conforme você solicitou
            const html = data.map(d => `<span class="mx-4">✨ ${d.description}</span>`).join('');
            container.innerHTML = html;
        })
        .catch(err => console.error('Erro ao buscar doações:', err));
}

function updateTotalDonations() {
    return fetch(`${API_URL}?acao=atualizarPlanilha`).catch(e => console.error(e));
}

// Função para copiar a chave Pix
document.getElementById('btn-copiar').addEventListener('click', () => {
    const chavePix = 'SUA_CHAVE_PIX_AQUI'; // <--- INSIRA SUA CHAVE AQUI

    // API nativa para copiar para a área de transferência
    navigator.clipboard.writeText(chavePix).then(() => {
        const msg = document.getElementById('msg-copiado');
        msg.classList.remove('hidden'); // Mostra a mensagem de sucesso

        // Esconde a mensagem após 2 segundos
        setTimeout(() => {
            msg.classList.add('hidden');
        }, 2000);
    }).catch(err => {
        console.error('Erro ao copiar: ', err);
    });
});