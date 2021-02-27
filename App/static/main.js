let mode;
const minPokemon = 0;
const maxPokemon = 964;
const DEFAULT_LIMIT = 50;
const DEFAULT_OFFSET = 50;
let token = "";
let selected = "";
let count = 0;
const endpoint = 'https://pokeapi.co/api/v2';
const server = "";

async function postData(url = '', data = {}, token) {
    const response = await fetch(url, {
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${token}`
        },
        body: JSON.stringify(data)
    });
    if(response.ok)
        return response.text(); 
    throw response.status;
}

async function getData(url = '', token){
    const response = await fetch(url ,{
      headers:{'Authorization': `JWT ${token}`}
    });
    if(response.ok)
        return response.json(); 
    throw response.status;
}


function displayPokemon(pokemon){
    let result = document.querySelector('#result');

     result.innerHTML =  `
     <div class="card col m4 offset-m4" style="margin-top: 20px">
        <div class="card-image" >
            <img class="teal" src="${pokemon.sprites.front_default}" alt="${pokemon.name} Image">
            <span class="card-title"><p>${pokemon.name} # ${pokemon.id}</p></span>
        </div>
        <div class="card-content">
            <p> Type1: ${pokemon.types[0].type.name}</p>
            ${pokemon.types.length > 1 ? '<p> Type2: '+pokemon.types[1].type.name+'</p>' : "" }
            <p> Weight: ${pokemon.weight}</p>
            <p> Height: ${pokemon.height}</p>
            <a data-target="modal1" onclick="select({id:${pokemon.id}, name:'${pokemon.name}'});" style="position:absolute; right:15px; bottom:80px"  class="btn-floating btn-large waves-effect waves-light red modal-trigger">
            <span class="iconify" style="font-size:40px; margin-top:8px" data-icon="mdi-pokeball" data-inline="false"></span>
            </a>
            
        </div>
    </div>`;
}

function select(pokemon){
  selected = pokemon;
  mode = 'create';
  document.querySelector('#pkmn').innerHTML = `Name your ${pokemon.name}`;
}

async function getPokemon(query){
           
    try{
        let result = await getData(endpoint+`/pokemon/${query}`);
        displayPokemon(result);
    }catch (error){
        alert(`${query} Not Found!`);
    }
}

function loadToken(){
  let val = localStorage.getItem('dextr-token')
  if (val){
    document.querySelector('#tokenText').value = val;
    token = val;
  }
}

function setToken(token){
  localStorage.setItem('dextr-token', token);
  token = val;
  console.log('token saved');
}

document.querySelector("#tokenText").addEventListener('change',event=>{
  setToken(event.target.value);
});

function next(){
    document.querySelector("#prevBtn").removeAttribute('disabled');
    if(count < maxPokemon)
        count+= DEFAULT_OFFSET;
    if(count + DEFAULT_OFFSET > maxPokemon)
      document.querySelector("#nextBtn").setAttribute('disabled', true);
    loadListing(DEFAULT_LIMIT, count);
}

function prev(){
  document.querySelector("#nextBtn").removeAttribute('disabled');
  if(count > minPokemon)
    count-= DEFAULT_OFFSET;
  if(count - DEFAULT_OFFSET < minPokemon)
    document.querySelector("#prevBtn").setAttribute('disabled', true);
  loadListing(DEFAULT_LIMIT, count);
}

async function loadListing(limit=DEFAULT_LIMIT, offset=DEFAULT_OFFSET){
    try{
        let listingData = await getData(endpoint+`/pokemon/?limit=${limit}&offset=${offset}`);
        let listing = document.querySelector('#listing');
        
        let html = "";

        for(let pokemon of listingData.results){
            html+= `<a href="#!" id="${pokemon.name}" onclick="selectPokemon('${pokemon.name}')" class="collection-item">${pokemon.name}</a>`
        }

        listing.innerHTML = html;
        
    }catch (error){
        console.log(error);
    }
}

async function loadTable(){
    let table = document.querySelector('#myPokeLising');
    let data = await getData(server+'/mypokemon', token);
    let i = 1;
    table.innerHTML = "";
    for(let rec of data){
      table.innerHTML+=`<tr>
                          <td>${rec.name}</td>
                          <td>${rec.stats.name}</td>
                          <td>
                            <a class="waves-effect waves-light btn" onclick="releasePokemon(${i})"><i class="material-icons left">delete</i>Release</a>
                              <a data-target="modal1" class="modal-trigger waves-effect waves-light btn" onclick="renamePokemon({name:'${rec.name}', id:'${i}'})"><i class="material-icons left" >edit</i>Rename</a>
                          </td>
                        </tr>`;
      i++;
    }
}

function renamePokemon(poke){
  selected = poke;
  mode = 'update';
  document.querySelector('#pkmn').innerHTML = `Rename ${poke.name}`;
}

async function releasePokemon(id){
  let response = await fetch(`${server}/mypokemon/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `JWT ${token}`
    },
  });
  let mssg = await response.text();
  loadTable();
  M.toast({html: 'Bye Bye'});
}

function selectPokemon(pokemon){
    let activeLinks = document.querySelectorAll(".active");
    if(activeLinks){
        for(let link of activeLinks)
            link.classList.remove("active");
    }
    getPokemon(pokemon);    
    let link = document.querySelector(`#${pokemon}`);
    link.classList.add('active');
}

async function savePokemon(){
  let res;
  if(mode == 'create'){
      res = await postData(
    server+'/mypokemon', 
    {
      pid:selected.id,
      name: document.querySelector('#name').value
    },
    token);
  }else{
    res = await fetch(
      `${server}/mypokemon/${selected.id}`,
      {
        method: 'PUT',
        body: JSON.stringify(
          {
            name: document.querySelector('#name').value
          }
        ),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `JWT ${token}`
        }
      }
    );
    res = await res.text();
  }
  M.toast({html: res});
  loadTable();
}

document.addEventListener('DOMContentLoaded', function() {
    let sidenavs = document.querySelectorAll('.sidenav');
    sidenavs = M.Sidenav.init(sidenavs);
    let tabs = document.querySelectorAll('.tabs');
    tabs = M.Tabs.init(tabs);
    let modals = M.Modal.init(document.querySelectorAll('.modal'),
    {onCloseEnd:savePokemon});

    loadListing();
    loadToken();
    loadTable();

});