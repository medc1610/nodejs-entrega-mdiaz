const socket = io();


const listaProductos = document.getElementById('lista');

socket.on('actualizarLista', (lista) =>{
  const productos = lista.map(({_id,title,description,code,price,status,stock,category,thumbnails}) =>{
        return `<tr>
                <td>${_id}</td>
                <td>${title}</td>
                <td>${description}</td>
                <td>${code}</td>
                <td>${price}</td>
                <td>${status}</td>
                <td>${stock}</td>
                <td>${category}</td>
                <td>${thumbnails}</td>
            </tr>`;
    });
    listaProductos.innerHTML = productos.join('');
});