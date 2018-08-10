let map;
let infowindow;

//funcion que inicializa el mapa que tiene como parametro filter
function initMap(searchValue) {  

  navigator.geolocation.getCurrentPosition(function (pos) {

    lat = pos.coords.latitude;
    lon = pos.coords.longitude;

    let myLatlng = new google.maps.LatLng(lat, lon);  
    let mapOptions = {
      center: myLatlng,
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.MAP
    };

    map = new google.maps.Map(document.getElementById("mapa"), mapOptions);

   
    infowindow = new google.maps.InfoWindow();

    // request guarda el radio y el tipo de lugares que queremos obtener
    let request = {
      location: myLatlng,
      radius: 5000,
      types: ["restaurant"]
    };

    // Servicio PlaceService y enviamos la petición.
    let service = new google.maps.places.PlacesService(map);

    service.nearbySearch(request, function (results, status) {
      
      if (status === google.maps.places.PlacesServiceStatus.OK) {

        if (searchValue ) {  
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
  let marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  // Asignamos el evento click del marcador
  google.maps.event.addListener(marker, 'click', function () {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
  });
}

//esta funcion jala los places
function updateList(places) { 

  const postRestaurant = document.getElementById('postRestaurant');
  postRestaurant.innerHTML = null;
  for (let i = 0; i < places.length; i++) {
    const place = places[i]
    const contPlace = document.createElement('div');
    contPlace.setAttribute('class', "w3-container w3-card w3-white w3-round w3-margin-top w3-margin-bottom");
    const space1 = document.createElement('br');
    contPlace.innerHTML = place.name

    //Botón que abre el modal
    const buttonInformation = document.createElement("input");
    buttonInformation.setAttribute ('type', 'button')
    buttonInformation.setAttribute ('value', '+ Más información')
    buttonInformation.setAttribute ('class', 'buttonInfo')
    buttonInformation.setAttribute ('style', 'display:block')
    buttonInformation.onclick= () => {
      document.getElementById('id01').style.display='block';
      loadModal(place);
    }
    const space2 = document.createElement('br');
    
    postRestaurant.appendChild(contPlace);
    contPlace.appendChild(space1);
    contPlace.appendChild(buttonInformation);
    contPlace.appendChild(space2);
   
  }

}

//Función que jala y pinta la información para el modal. Tiene el parametro place.
function loadModal (place) {
  const modalPlace = document.getElementById ("modalPlace")
  modalPlace.innerHTML =  "<br>";
  modalPlace.innerHTML += "<b>"+ place.name +"</b>";
  modalPlace.innerHTML += "<br>";
  modalPlace.innerHTML += "Rating: " + place.rating ;
  modalPlace.innerHTML += "<br>";
  modalPlace.innerHTML += "Dirección: " + place.vicinity;
  modalPlace.innerHTML += "<br>";
  if (place.opening_hours.open_now === false) {
    local = 'Cerrado';
  } else if (place.opening_hours.open_now === true) {
    local = 'Abierto';
  }
  modalPlace.innerHTML += "Horario: " + local;
	} 


 
  


