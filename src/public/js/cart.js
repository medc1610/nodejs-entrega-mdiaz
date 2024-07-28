
async function agregar(link){

    fetch(link, {
        method: 'POST',        
    });

}

async function comprar(host,idcart){

    fetch(`${host}/api/carts/${idcart}/purchase`, {
        method: 'PUT',        
    }).then(response => {
        window.location = `${host}/products`
    });
   
}


function logout(host){

    fetch(`${host}/logout`, {
        method: 'GET',
    });

}