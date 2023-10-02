let verificador;



function mySearch() {
    const pesquisa = document.querySelector('.pesquisa__barra');
    let pesquisar = pesquisa.value;
    pesquisar = pesquisar.replaceAll(" ", "+");
    while (true) {
        if (pesquisar.endsWith("+")) {
            pesquisar = pesquisar.slice(0, -1);
        } else {
            break;
        }
    }
    if(pesquisar === verificador){
        console.log("repetindo info")
    }else{
        verificador = pesquisar;
        fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${pesquisar}&count=10&language=pt&format=json`)
            .then((resp) => resp.json())
            .then((data) => {
                let longitude = data.results[0].longitude
                let latitude = data.results[0].latitude
                myFunction(latitude, longitude, 0, 23, 1, 0, 1)
                mostrarDetalhes(dia01)

            })
    }
}



