const socket = io()

const chatBox = document.getElementById('chatBox')
const messageLogs = document.getElementById('messageLogs')
let user

Swal.fire({
  title: 'Inicio de Sesion',
    input: 'text',
    text: 'Ingresa tu nombre',
    inputValidator: (value) => {
       return !value && 'Debes ingresar tu nombre'
    },
    allowOutsideClick: false,
}).then(resultado => {
    user = resultado.value
    console.log(user)
})

chatBox.addEventListener('keyup', (e) => {
    if(e.key === 'Enter') {
       if(chatBox.value.trim().length > 0) {
           console.log(chatBox.value)
          socket.emit('mensaje', {user: user, message: chatBox.value, hora: new Date().toLocaleString()})
          chatBox.value = ''
       }
    }
})

socket.on('mensajes', info => {
    console.log(info)
    messageLogs.innerHTML = ''
    info.forEach(message => {
       messageLogs.innerHTML += `<p>${message.user} dice: ${message.message} ${message.hora}</p>`
    })

})
