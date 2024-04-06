const URL_BASE = 'https://covid19-brazil-api.now.sh/api/report/v1/brazil/uf';
let section = document.getElementById("content");
section.style.display = "none"


const converte = {
    "acre": "AC",
    "alagoas": "AL",
    "amapa": "AP",
    "amazona": "AM",
    "bahia": "BA",
    "ceara": "CE",
    "distritro federal": "DF",
    "espirito santo": "ES",
    "goias": "GO",
    "maranhao": "MA",
    "mato grosso": "MT",
    "mato grosso do sul": "MS",
    "minas gerais": "MG",
    "para": "PA",
    "paraiba": "PB",
    "parana": "PR",
    "pernambuco": "PE",
    "piaui": "PI",
    "rio de janeiro": "RJ",
    "rio grande do norte": "RN",
    "rio grande do sul": "RS",
    "rondonia": "RO",
    "roraima": "RR",
    "santa catarina": "SC",
    "sao paulo": "SP",
    "sergipe": "SE",
    "tocantins": "TO"
};

function removerAcento(valor) {
    console.log("Função removerAcento (variavel: valor) " + valor)
  return valor.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

function converterUF(campo){
    console.log("Função ConverterUF, pré tratamento de dado (variavel campo): " + campo)
    campo = removerAcento(campo.toLowerCase());
    console.log("Função ConverterUF, após tratamento de dado (variavel campo): " + campo)
    if (campo in converte) {
        return converte[campo];
    } else {
        return null;
    }
}



let url = URL_BASE + "/ma";

let formulario = document.getElementById("formulario");
let campoInput = document.getElementById("campo");


formulario.addEventListener('submit', function(e){
    e.preventDefault(); //Para prevenir o envio do formulario
    let campo = campoInput.value
    console.log("Evento de escuta, pré tratamento de dado (variavel campo): " + campo)
    let uf = converterUF(campo)
    if (uf !== null) {
        section.style.display = "flex"
        getCountry(uf);
    } else {
        console.log("Não foi possível encontrar a UF para", campo);
    }
})



callAPI(url, function(status, response){
    console.log("Get do response da URL na função CallAPI: " + response);
})

function getCountry (uf){
    var url = URL_BASE + "/" + uf;

    callAPI(url, function(status, data){
        let uid = data.uid;
        let uf = data.uf;
        let estado = data.state;
        let casos = data.cases;
        let mortes = data.deaths;
        let suspeitas = data.suspects;
        let rejeitado = data.refuses;
        let transmissao = data.broadcast;
        let comentarios = data.comments;
        let horario = data.datetime;
        let image = 'https://devarthurribeiro.github.io/covid19-brazil-api/static/flags/' + uf + '.png'

        document.getElementById("content").innerHTML = "";
        

        document.getElementById("content").innerHTML += "<article>" +
        "<h1>" + estado + "<image src='" + image + "'/>" + "</h1>" +
        "<p> UF: <span>" + uf + "</span>" +
        "<p> Casos: <span>" + casos + "</span>" + " mil"+
        "<p> Mortes: <span>" + mortes + "</span>" +
        "<p> Suspeitas: <span>" + suspeitas + "</span>" +
        "<p> Rejeitado: <span>" + rejeitado + "</span>" +
        "<p> Transmissão: <span>" + transmissao + "</span>" +
        "<p> Comentários: <span>" + comentarios + "</span>" +
        "<p> Horário: <span>" + horario + "</span>" +
        "</article>";

    })
    
    
    
}

function callAPI(url, retorno){
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.open('GET', url, true);
    xhr.onload = function() {
        if(xhr.status === 200) {
            retorno(xhr.status, xhr.response);
        } else {
            alert("404 not fount");
        }
        
    }
    xhr.send()
}

