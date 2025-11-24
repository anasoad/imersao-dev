let cardContainer = document.querySelector(".card-container");
let searchInput = document.querySelector("#search-input");
const searchButton = document.querySelector("#botao-busca"); // Adiciona o botão de busca
const darkModeToggle = document.querySelector("#dark-mode-toggle");
const body = document.body;
let dados = [];

async function buscarDados() {    
    try {
        let resposta = await fetch("data.json");
    if (!resposta.ok) {
        throw new Error(`HTTP error! status: ${resposta.status}`);
    }
        dados = await resposta.json();
        // Não renderiza mais os cards no carregamento inicial
    } catch (error) {
        console.error("Falha ao buscar dados:", error);
        cardContainer.innerHTML = `<p class="error-message">Não foi possível carregar os dados. Tente novamente mais tarde.</p>`;
    }
}

function renderizarCards(dados) {
    // Limpa o container antes de renderizar os novos cards
    cardContainer.innerHTML = "";

    // Se não houver dados E o campo de busca não estiver vazio, mostre a mensagem.
    if (dados.length === 0 && searchInput.value.trim() !== "") {
        cardContainer.innerHTML = `<p class="no-results-message">Nenhum resultado encontrado para "${searchInput.value}".</p>`;
        return;
    }
    for (let dado of dados) {
        let article = document.createElement("article");
        article.classList.add("card");
        article.innerHTML = `
        <h2>${dado.nome}</h2>
        <p><strong>Ano:</strong> ${dado.data_criacao}</p>
        <p class="descricao">${dado.descricao}</p>
        <a href="${dado.link}" target="_blank">Saiba mais</a>
        `
        cardContainer.appendChild(article);
    }
}

/**
 * @function handleSearch
 * @description Filtra os dados com base no termo de busca.
 * Alterado para usar startsWith() em 'nome' para buscar apenas a inicial.
 * Mantém includes() em 'descricao' para busca geral (pode ser ajustado se necessário).
 */
function handleSearch() {
    // Pega o valor diretamente do elemento input
    let termoBusca = searchInput.value.trim().toLowerCase();

    // Se o campo de busca estiver vazio, limpa os resultados e não faz mais nada.
    if (termoBusca === "") {
        cardContainer.innerHTML = ""; // Apenas limpa o container
        return;
    }

    let dadosFiltrados = dados.filter(dado => {
        // *** ALTERAÇÃO AQUI: USANDO startsWith() ***
        // Agora, busca se o NOME começa com o termo
        const nomeComecaCom = dado.nome.toLowerCase().startsWith(termoBusca);

        // Opcional: Mantém a busca por inclusão na descrição,
        // para que a descrição ainda possa ser pesquisada por qualquer palavra.
        const descricaoContem = dado.descricao.toLowerCase().includes(termoBusca);

        // Retorna o dado se o nome começar com o termo OU a descrição contiver o termo
        return nomeComecaCom || descricaoContem; 
    });
    renderizarCards(dadosFiltrados);
}

// --- Lógica do Dark Mode ---

// Verifica a preferência do usuário no carregamento da página
if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark-mode");
}

// Adiciona o evento de clique ao botão de toggle
darkModeToggle.addEventListener("click", () => {
     body.classList.toggle("dark-mode");
    // Salva a preferência do usuário no localStorage
    if (body.classList.contains("dark-mode")) {
    localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }
});

buscarDados();

// --- Eventos de Busca ---

// Adiciona evento de clique ao botão de busca
searchButton.addEventListener("click", handleSearch);

// Adiciona evento de tecla ao campo de busca para acionar com "Enter"
searchInput.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        handleSearch();
    }
});