// Función para menú responsive
const menuOptions = () => {
  var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}



var map;
var infowindow;

//funcion que inicializa el mapa que tiene como parametro filter
function initMap(searchValue) {  

  navigator.geolocation.getCurrentPosition(function (pos) {

    lat = pos.coords.latitude;
    lon = pos.coords.longitude;

    var myLatlng = new google.maps.LatLng(lat, lon);  //objeto 

    var mapOptions = {
      center: myLatlng,
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.MAP
    };

    map = new google.maps.Map(document.getElementById("mapa"), mapOptions);

    // Creamos el infowindow
    infowindow = new google.maps.InfoWindow();

    // Especificamos la localización, el radio y el tipo de lugares que queremos obtener
    var request = {
      location: myLatlng,
      radius: 5000,
      types: ["restaurant"]
    };

    // Creamos el servicio PlaceService y enviamos la petición.
    var service = new google.maps.places.PlacesService(map);

    service.nearbySearch(request, function (results, status) {
      
      if (status === google.maps.places.PlacesServiceStatus.OK) {

        if (searchValue ) {  //si hay un filtro , filtra todo aquel cuyo nombre en minusculas que incluye al filtro en minusculas
          //si el texto esta incliudo
          results = results.filter(place => place.name.toLowerCase().includes(searchValue.toLowerCase()))
        }
        //la funcion updateList recibe los resultados y los pinta 
        updateList(results) 

        for (var i = 0; i < results.length; i++) {
          crearMarcador(results[i]);

        }
      }
    });
  });
}

function crearMarcador(place) {
  // Creamos un marcador
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  // Asignamos el evento click del marcador
  google.maps.event.addListener(marker, 'click', function () {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}

//esta funcion
function updateList(places) { 

  const postRestaurant = document.getElementById('postRestaurant');
  postRestaurant.innerHTML = null;
  for (let i = 0; i < places.length; i++) {
    const place = places[i]
    const contPlace = document.createElement('div');
    contPlace.setAttribute('class', "w3-container w3-card w3-white w3-round w3-margin")
    contPlace.innerHTML = place.name

    const buttonInformation = document.createElement("input");
    buttonInformation.setAttribute ('type', 'button')
    buttonInformation.setAttribute ('value', 'Más información')
    buttonInformation.setAttribute ('class', 'w3-button w3-black')
    buttonInformation.setAttribute ('style', 'display:block')
    // buttonInformation.setAttribute ('onclick', "document.getElementById('id01').style.display='block'" )
    buttonInformation.onclick= () => {
      document.getElementById('id01').style.display='block';
      loadModal(place);
    }
    postRestaurant.appendChild(contPlace);
    contPlace.appendChild(buttonInformation);
   
  }

}

function loadModal (place) {
  const modalPlace = document.getElementById ("modalPlace")
  modalPlace.innerHTML  = "<b>"+ place.name +"</b>";
  modalPlace.innerHTML  += "<br>";
  modalPlace.innerHTML+=   "Rating:" + place.rating ;
  modalPlace.innerHTML  += "<br>";
  modalPlace.innerHTML+=   "Dirección:" + place.vicinity;


}
