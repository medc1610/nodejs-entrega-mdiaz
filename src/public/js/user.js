
async function eliminar(host,email){

    fetch(`${host}/api/users/${email}`, {
        method: 'delete',        
    }).then( response => {
        if(response.status == '200'){
            window.location = `${host}/users`
        }else {
            // Si la respuesta es un error (código 400), maneja el mensaje de error
            response.json().then(errorResponse => {
                const errorMessage = errorResponse.error;
                const info = document.getElementById('info'); 
                info.textContent = errorMessage;
            });
        }
    });;

}

async function premium(host,idUser){

    fetch(`${host}/api/users/premium/${idUser}`, {
        method: 'PUT',        
    }).then( response => {
        if(response.status == '200'){
            window.location = `${host}/users`
        }else {
            // Si la respuesta es un error (código 400), maneja el mensaje de error
            response.json().then(errorResponse => {
                const errorMessage = errorResponse.error;
                const info = document.getElementById('info'); 
                info.textContent = errorMessage;
            });
        }
    });
   
}


function logout(){

    fetch(`${host}/logout`, {
        method: 'GET',
    });

}