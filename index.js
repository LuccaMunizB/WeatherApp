const dayGrande = document.querySelector('.temp__atual')
const dayMax = document.querySelector('.max')
const dayMin = document.querySelector('.min')
const nomeClima = document.querySelector('.descricao__temp')
if (!("geolocation" in navigator)) {
  navigator.geolocation.getCurrentPosition(function (position) {
    var latitude = position.coords.latitude;
    var longitude = position.coords.longitude;
    var timestamp = position.timestamp;
    myFunction(latitude, longitude)
  });
} else {
  var latitude = -30.033056;
  var longitude = -51.230000;
  myFunction(latitude, longitude, 0, 23, 1, 1, 1)
}
const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'];
var dataAtual = new Date();
var hora = dataAtual.getHours();
const diaDaSemanaNum = dataAtual.getDay();
var dayGrande1;
var dayMax1;
var dayMin1;
var mesAtua1;
var auxiliarLat;
var auxiliarLong;
var diaDesc = [];

function myFunction(latitude, longitude, inicio, fim, day, a, b) {
  fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=sunset&daily=sunrise&hourly=temperature_2m,apparent_temperature,weathercode&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=America%2FSao_Paulo`)
    .then((resp) => resp.json())
    .then((data) => {
      if (!(a == 1)) {
        const horass = document.querySelector('.horass')
        horass.remove()
      } 
      auxiliarLat = latitude;
      auxiliarLong = longitude;
      const numero = Math.round(data.hourly.temperature_2m[hora])
      const horass = document.createElement("div")
      horass.className = 'horass'

      if (b == 1) {
        nomeClima.textContent = getNomeClima(data.hourly.weathercode[0]);
        for (j = 0; j < 7; ++j) {
          let mesAtua = data.daily.time[j]
          mesAtua1 = data.daily.time
          let mesAtual1 = mesAtua.substring(mesAtua.length - 5, mesAtua.length - 3)
          let nomeDoMes = ''
          if (mesAtual1.charAt(0) == 0) { mesAtual1 = mesAtual1.charAt(1) }
          console.log(mesAtual1)
          switch (parseInt(mesAtual1)) {
            case 1: nomeDoMes = 'Jan'; break;
            case 2: nomeDoMes = 'Fev'; break;
            case 3: nomeDoMes = 'Mar'; break;
            case 4: nomeDoMes = 'Abr'; break;
            case 5: nomeDoMes = 'Mai'; break;
            case 6: nomeDoMes = 'Jun'; break;
            case 7: nomeDoMes = 'Jul'; break;
            case 8: nomeDoMes = 'Ago'; break;
            case 9: nomeDoMes = 'Set'; break;
            case 10: nomeDoMes = 'Out'; break;
            case 11: nomeDoMes = 'Nov'; break;
            case 12: nomeDoMes = 'Dez'; break;
          }
          const mes = document.querySelector('.mes' + (j + 1));
          dayGrande1 = data.hourly.temperature_2m
          dayMax1 = data.daily.temperature_2m_max
          dayMin1 = data.daily.temperature_2m_min
          mes.innerHTML = mesAtua.substring(mesAtua.length - 2, mesAtua.length) + " " + nomeDoMes
          console.log(mes)
          const dia = document.querySelector('.dia' + (j + 1));
          dia.innerHTML = diasDaSemana[diaDaSemanaNum + j];
          const max__day = document.querySelector('.max__dia' + (j + 1));
          const min__day = document.querySelector('.min__dia' + (j + 1));
          var temp__max = Math.round(data.daily.temperature_2m_max[j]);
          var temp__min = Math.round(data.daily.temperature_2m_min[j]);
          max__day.textContent = temp__max + " °C";
          min__day.textContent = temp__min + " °C";
          const imagem__barra = document.querySelector('.diaimg' + (j + 1))
          let x = data.hourly.weathercode[j]
          diaDesc[j] = x
          imagem__barra.src = getUrlImg(x)
          dayGrande.textContent = Math.round(dayGrande1[hora]) + "°C";
          dayMax.textContent = "Max: " + Math.round(dayMax1[0]) + "°C";
          dayMin.textContent = "Min: " + Math.round(dayMin1[0]) + "°C";

          dataAtual1.textContent = diasDaSemana[diaDaSemanaNum] + ", " + mesAtua1[0];
        }
      }
      for (i = inicio; i <= fim; ++i) {

        const text = data.hourly.time[i]
        let dia = dataAtual.getDate()
        let texto = text.substring(text.length - 8, text.length - 6)
        texto = parseInt(texto)
        if (parseInt(text.substring(text.length - 5, text.length)) <= parseInt(hora) &&
          dia == texto) {
          continue;
        } else {
          const horas = document.createElement("div")
          const horario = document.createElement("p")
          const imagem = document.createElement("img")
          const temperatura = document.createElement("p")
          horas.className = 'horas'
          horario.className = 'hor'
          imagem.className = 'imag'
          temperatura.className = 'temp'
          horario.textContent = text.substring(text.length - 5, text.length)
          let x = data.hourly.weathercode[i]
          if(day!=1){
            imagem.src = getUrlImg(x, (i-inicio))
          } else{
            imagem.src = getUrlImg(x, i)
          }
          const tem = data.hourly.temperature_2m[i].toString()
          const caixa1 = '.horas-diarias1'
          const caixa = document.querySelector(caixa1)
          temperatura.textContent = tem + " °C"
          caixa.appendChild(horass)
          horass.appendChild(horas)
          horas.appendChild(horario)
          horas.appendChild(imagem)
          horas.appendChild(temperatura)
        }
      }
      if (day) {
        const carouselContent = document.querySelector('.horass');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const containerWidth = document.querySelector('.horas-diarias1').offsetWidth;
        let totalItems = 0;
        totalItems = document.querySelectorAll('.horas').length;
        console.log(totalItems)
        console.log("aqaui: " + totalItems)
        const itemsPerSlide = 8; // Número de elementos a serem mostrados de uma vez
        let currentIndex = 0;

        function updateCarousel() {
          const maxIndex = totalItems - itemsPerSlide;
          currentIndex = Math.min(currentIndex, maxIndex);
          const translateValue = -currentIndex * (containerWidth / itemsPerSlide);
          carouselContent.style.transform = `translateX(${translateValue}px)`;
        }

        nextBtn.addEventListener('click', () => {
          currentIndex = Math.min(currentIndex + itemsPerSlide, totalItems - itemsPerSlide);
          updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
          currentIndex = Math.max(currentIndex - itemsPerSlide, 0);
          updateCarousel();
        });
      }
    }
    )
}

const body = document.querySelector('.body');


function getUrlImg(x, i) {
  console.log("i aqui: ", i)
  console.log("x aqui: ,", x)
  switch (true) {
    case (x == 0):
      if (i >= 19 || i <= 6) {
        return "Img/Moon.png";
      } else {
        return "Img/Sun.png"
      }
    case (x >= 1 && x <= 3):
      if (i >= 19 || i <= 6) {
        return "Img/Clouds-Night.png";
      } else {
        return "Img/Clouds-Sun.png";
      }
    case (x >= 45 && x <= 48):
      return "Img/Fog.png";
    case (x >= 51 && x <= 55):
      return "Img/Rain.png";
    case (x >= 56 && x <= 57):
      return "Img/Freezing.png";
    case (x >= 61 && x <= 67):
      return "Img/Rain.png";
    case (x >= 71 && x <= 75):
      return "Img/Snow.png";
    case (x == 77):
      return "Img/Snow.png";
    case (x >= 80 && x <= 82):
      return "Img/Rain.png";
    case (x >= 85 && x <= 86):
      return "Img/Snow.png";
    case (x >= 95 && x <= 99):
      return "Img/Thunderstorm.png";
    default:
      console.log("date-invalid");
      break;
  }
}
function getNomeClima(x) {
  switch (true) {
    case (x == 0):
      document.body.style.background = "rgb(64,126,212)";
      document.body.style.background = "linear-gradient(180deg, rgba(64,126,212,1) 14%, rgba(87,160,248,1) 54%)";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundRepeat = "no-repeat";
      return "Céu Limpo";
    case (x >= 1 && x <= 3):
      document.body.style.background = "rgb(64,126,212)";
      document.body.style.background = "linear-gradient(180deg, rgba(64,126,212,1) 14%, rgba(87,160,248,1) 54%)";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundRepeat = "no-repeat";
      return "Céu com Nuvens"
    case (x >= 45 && x <= 48):
      document.body.style.background = "rgb(31,64,111)";
      document.body.style.background = "linear-gradient(180deg, rgba(31,64,111,1) 28%, rgba(82,134,198,1) 68%)";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundRepeat = "no-repeat";
      return "Céu Nublado";
    case (x >= 51 && x <= 55):
      document.body.style.background = "linear-gradient(180deg, #8aa4b7 0%, #54799d 100%)";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundRepeat = "no-repeat";
      return "Chuvoso";
    case (x >= 56 && x <= 57):
      document.body.style.background = "linear-gradient(180deg, #0e153a 0%, #ffffff 5%, #ffffff 95%, #0e153a 100%)";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundRepeat = "no-repeat";
      return "Chuva de Granizo";
    case (x >= 61 && x <= 67):
      document.body.style.background = "linear-gradient(180deg, #8aa4b7 0%, #54799d 100%)";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundRepeat = "no-repeat";
      return "Chuvoso";
    case (x >= 71 && x <= 75):
      document.body.style.background = "linear-gradient(180deg, #e6f7ff 0%, #ffffff 100%)";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundRepeat = "no-repeat";
      return "Nevando";
    case (x == 77):
      document.body.style.background = "linear-gradient(180deg, #e6f7ff 0%, #ffffff 100%)";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundRepeat = "no-repeat";
      return "Nevando";
    case (x >= 80 && x <= 82):
      document.body.style.background = "linear-gradient(180deg, #8aa4b7 0%, #54799d 100%)";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundRepeat = "no-repeat";
      return "Chuvoso";
    case (x >= 85 && x <= 86):
      document.body.style.background = "linear-gradient(180deg, #e6f7ff 0%, #ffffff 100%)";
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundRepeat = "no-repeat";
      return "Nevando";
    case (x >= 95 && x <= 99):
      document.body.style.background = "linear-gradient(180deg, #2b2c2e 0%, #0e153a 100%)";
      document.body.style.backgroundRepeat = "no-repeat";
      document.body.style.backgroundSize = "cover";
      return "Tempestade";
    default:
      console.log("date-invalid");
      break;
  }
}

const dataAtual1 = document.querySelector('.dataAtual')
const diaSemana = document.querySelector('.diaSemana')
function diaEmax(diaClicado) {
  console.log(diaDesc)
  switch (diaClicado) {
    case dia01:
      dayGrande.style.fontSize = '23vh'
      dayGrande.textContent = Math.round(dayGrande1[hora]) + "°C";
      dayMax.textContent = "Max: " + Math.round(dayMax1[0]) + "°C";
      dayMin.textContent = "Min: " + Math.round(dayMin1[0]) + "°C";
      dataAtual1.textContent = diasDaSemana[diaDaSemanaNum] + ", " + mesAtua1[0];
      myFunction(auxiliarLat, auxiliarLong, 0, 23, 1, 0, 0)
      nomeClima.textContent = getNomeClima(diaDesc[0])
      break;
    case dia02:
      dayGrande.style.fontSize = '5vh'
      dayGrande.textContent = "Max: " + Math.round(dayMax1[1]) + "°C" + " / " + "Min: " + Math.round(dayMin1[1]) + "°C";
      dayMax.textContent = '';
      dayMin.textContent = '';
      dataAtual1.textContent = "Previsão para: " + diasDaSemana[diaDaSemanaNum + 1] + ", " + mesAtua1[1];
      myFunction(auxiliarLat, auxiliarLong, 24, 47, 2, 0, 0)
      nomeClima.textContent = getNomeClima(diaDesc[1])
      break;
    case dia03:
      dayGrande.style.fontSize = '5vh'
      dayGrande.textContent = "Max: " + Math.round(dayMax1[2]) + "°C" + " / " + "Min: " + Math.round(dayMin1[2]) + "°C";
      dayMax.textContent = '';
      dayMin.textContent = '';
      dataAtual1.textContent = "Previsão para: " + diasDaSemana[diaDaSemanaNum + 2] + ", " + mesAtua1[2];
      myFunction(auxiliarLat, auxiliarLong, 48, 71, 3, 0, 0)
      nomeClima.textContent = getNomeClima(diaDesc[2])
      break;
    case dia04:
      dayGrande.style.fontSize = '5vh'
      dayGrande.textContent = "Max: " + Math.round(dayMax1[3]) + "°C" + " / " + "Min: " + Math.round(dayMin1[3]) + "°C";
      dayMax.textContent = '';
      dayMin.textContent = '';
      dataAtual1.textContent = "Previsão para: " + diasDaSemana[diaDaSemanaNum + 3] + ", " + mesAtua1[3];
      myFunction(auxiliarLat, auxiliarLong, 72, 95, 4, 0, 0)
      nomeClima.textContent = getNomeClima(diaDesc[3])
      break;
    case dia05:
      dayGrande.style.fontSize = '5vh'
      dayGrande.textContent = "Max: " + Math.round(dayMax1[4]) + "°C" + " / " + "Min: " + Math.round(dayMin1[4]) + "°C";
      dayMax.textContent = '';
      dayMin.textContent = '';
      dataAtual1.textContent = "Previsão para: " + diasDaSemana[diaDaSemanaNum + 4] + ", " + mesAtua1[4];
      myFunction(auxiliarLat, auxiliarLong, 96, 119, 5, 0, 0)
      nomeClima.textContent = getNomeClima(diaDesc[4])
      break;
    case dia06:
      dayGrande.style.fontSize = '5vh'
      dayGrande.textContent = "Max: " + Math.round(dayMax1[5]) + "°C" + " / " + "Min: " + Math.round(dayMin1[5]) + "°C";
      dayMax.textContent = '';
      dayMin.textContent = '';
      dataAtual1.textContent = "Previsão para: " + diasDaSemana[diaDaSemanaNum + 5] + ", " + mesAtua1[5];
      myFunction(auxiliarLat, auxiliarLong, 120, 143, 6, 0, 0)
      nomeClima.textContent = getNomeClima(diaDesc[5])
      break;
    case dia07:
      dayGrande.style.fontSize = '5vh'
      dayGrande.textContent = "Max: " + Math.round(dayMax1[6]) + "°C" + " / " + "Min: " + Math.round(dayMin1[6]) + "°C";
      dayMax.textContent = '';
      dayMin.textContent = '';
      dataAtual1.textContent = "Previsão para: " + diasDaSemana[diaDaSemanaNum + 6] + ", " + mesAtua1[6];
      myFunction(auxiliarLat, auxiliarLong, 144, 167, 7, 0, 0)
      nomeClima.textContent = getNomeClima(diaDesc[6])
      break;
  }
}

