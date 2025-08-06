const form = document.querySelector("#cep-form");
const cepInput = document.querySelector("#cep-input");
const cepError = document.querySelector("#cep-error");
const resultado = document.querySelector("#resultado");
const submitButton = form.querySelector("button");

function validarCEP(cep) {
    const cepRegex = /^\d{5}-?\d{3}$/;
    return cepRegex.test(cep);
}

function formatarCEP(cep) {
    cep = cep.replace(/\D/g, "");
    if (cep.length === 8) {
        return `${cep.slice(0, 5)}-${cep.slice(5)}`;
    }
    return cep;
}

async function buscarDados(cep) {
    try {
        const resposta = await fetch(`https://viacep.com.br/ws/${cep}/json`, { method: "GET" });
        const dados = await resposta.json();
        
        if (dados.erro) {
            resultado.innerHTML = `<p>CEP não encontrado.</p>`;
            return;
        }

        console.log(dados);
        resultado.innerHTML = `
            <dl>
                <dt>CEP:</dt>
                <dd>${dados.cep}</dd>
                <dt>Logradouro:</dt>
                <dd>${dados.logradouro}</dd>
                <dt>Complemento:</dt>
                <dd>${dados.complemento || "Não informado"}</dd>
                <dt>Bairro:</dt>
                <dd>${dados.bairro}</dd>
                <dt>Cidade:</dt>
                <dd>${dados.localidade}</dd>
                <dt>Estado:</dt>
                <dd>${dados.uf}</dd>
                <dt>IBGE:</dt>
                <dd>${dados.ibge}</dd>
                <dt>GIA:</dt>
                <dd>${dados.gia || "Não informado"}</dd>
                <dt>DDD:</dt>
                <dd>${dados.ddd}</dd>
                <dt>SIAFI:</dt>
                <dd>${dados.siafi}</dd>
            </dl>
        `;
    } catch (error) {
        console.error("Erro ao buscar dados:", error);
        resultado.innerHTML = `<p>Erro ao carregar os dados.</p>`;
    }
}

cepInput.addEventListener("input", () => {
    let cep = cepInput.value;
    cep = formatarCEP(cep);
    cepInput.value = cep;

    if (validarCEP(cep)) {
        cepInput.classList.remove("invalid");
        cepError.textContent = "";
        submitButton.disabled = false;
    } else {
        cepInput.classList.add("invalid");
        cepError.textContent = "Digite um CEP válido (ex: 12345-678 ou 12345678)";
        submitButton.disabled = true;
    }
});

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const cep = cepInput.value.replace(/\D/g, "");
    if (validarCEP(cepInput.value)) {
        buscarDados(cep);
    }
});