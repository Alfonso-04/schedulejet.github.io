//---------------Variables oculatr divs----------------
divLogin = document.getElementById('divLogIn')
divSingup = document.getElementById('divSignUp')
divTablaMatricular = document.getElementById('tabladivMaricular')
divTablaVerMatricula = document.getElementById('tabladivVerMatricula')
divMaterias = document.getElementById('divMaterias')

//-------------------------Tablas--------------------------
var tablaMatricular = document.getElementById("tablaMatricular").getElementsByTagName('tbody')[0]
var tablaVerMatricula = document.getElementById("tablaVerMatricula").getElementsByTagName('tbody')[0]


//--------------Variables almacenar datos--------------
var txtemail = document.getElementById('txtemail')
var txtpassword = document.getElementById('txtpassword')
var txtnombre = document.getElementById('txtnombre')
var txtdocid = document.getElementById('txtdocid')
var txtprogram = document.getElementById('txtprogram')
var txtsemester = document.getElementById('txtsemester')
var txtmateria = document.getElementById('txtmateria')

var arrMaterias = {}
var row

let resultados = ''
var infoForm = {}
var infoFormVerMaterias = {}



//Para mostrar el apartado de registro estando en el login
function showRegistrarse() {
    divLogin.style.display = 'none'
    divSingup.style.display = ''

}
//Para mostrar el apartado de login estando en el registro
function showLogin() {
    divSingup.style.display = 'none'
    divLogin.style.display = ''


}


//--------------------VMostrar apartados ver/hacer matricula--------------------

function divVerMaterias() {

    var datosJSON
    var detallesMaterias = {
        1: "Fundamentos de programación",
        2: "Fisica mecanica",
        3: "Introducción a la ingeniería",
        4: "Fundamentos de matematicos",
        5: "Sociedad y tecnología",
        6: "Comunicación oral y escrita",
        7: "Formación de espíritu científico"

    }



    fetch(`http://localhost:3001/student/enrollment/${localStorage.getItem('id')}`)
        .then(response => response.json())
        .then(data => datosJSON = data)
        .then(() => console.log(datosJSON))

    //Validar sí hay materías matriculadas
    setTimeout(() => {
        if (!Array.isArray(datosJSON) || !datosJSON.length) {
            alert('No tienes materias matriculadas ¡MATRICULATE!')
        } else {

            //Transformamos el JSON 

            datosJSON = JSON.parse(JSON.stringify(datosJSON))

            for (let i = 0; i < datosJSON.length; i++) {


                console.log(datosJSON[i].CourseId)

                infoFormVerMaterias['courseId'] = datosJSON[i].CourseId
                infoFormVerMaterias['materia'] = detallesMaterias[i + 1]




                //Insertar en la tabla
                //cell = tablaVerMatricula.insertRow(tablaVerMatricula.lenght)
                //cell.innerHTML = infoFormVerMaterias.courseId

                //cell = tablaVerMatricula.insertRow(tablaVerMatricula.lenght)
                //cell.innerHTML = infoFormVerMaterias.materia


                var nuevaFila = tablaVerMatricula.insertRow(tablaVerMatricula.lenght)


                //Insertar en la tabla
                cell1 = nuevaFila.insertCell(0)
                cell1.innerHTML = infoFormVerMaterias.courseId

                cell2 = nuevaFila.insertCell(1)
                cell2.innerHTML = infoFormVerMaterias.materia

            }
            divTablaVerMatricula.style.display = ''

        }
    }, 3000)

}

//Mostrar apartado para escoger materias
function divEscogeMateria() {


    fetch(`http://localhost:3001/student/enrollment/${localStorage.getItem('id')}`)
        .then(response => response.json())
        .then(data => datosJSON = data)
        .then(() => console.log(datosJSON))

    //Validar sí hay materías matriculadas
    setTimeout(() => {
        if (datosJSON.length) {
            alert('Ya estás matriculado, click en ver asignaturas')

        } else {
            divMaterias.style.display = ''
        }
    }, 3000)

}





//---------------------CRUD REALIZAR HORARIO--------------


//Agregar una materia 
async function agregarMateria() {
    i = 1
    //Validción sí el campo está vacio
    if (txtmateria.value == 0) {
        alert('Llene todos los campos')
    } else {
        //Sí no está vacio almacenar los valores en infoform
        infoForm['idTabla'] = txtmateria.value
        infoForm['txtMateria'] = txtmateria.selectedOptions[0].getAttribute('data-name')


        //Crear variable para insertar una nueva fila
        var nuevaFila = tablaMatricular.insertRow(tablaMatricular.lenght)


        //Insertar en la tabla
        cell1 = nuevaFila.insertCell(0)
        cell1.innerHTML = infoForm.idTabla

        cell2 = nuevaFila.insertCell(1)
        cell2.innerHTML = infoForm.txtMateria

        cell3 = nuevaFila.insertCell(2)
        cell3.innerHTML = `<div class="text-center">
                                <a class= "btn btn-danger " onClick="onDelete(this)">Delete</a>
                           </div>`


        document.getElementById("form").reset()
        divTablaMatricular.style.display = ''






    }
}
//Eliminar una materia
function onDelete(td) {
    if (confirm('¿Deseas eliminar esta materia?')) {
        row = td.parentElement.parentElement

        tablaMatricular.deleteRow(row.rowIndex)




    }
}
//Funcion para pasarle los datos de la tabla y enviarlas a la API
function sendMaterias(infoForm) {
    rowsTablaMatricular = tablaMatricular.rows.length
    if (rowsTablaMatricular < 7) {
        alert('Selecciona todas las materias, por favor')


    }else{
        
    
    //Cuando se inicia sesión se obtiene el ID y se almacena en LocalStorage para que no se pierda
    console.log("id: " + localStorage.getItem('id'))
    

    //For para recorrer la primera columna de la tabla que contiene los IDs de las materias
    for (let i = 0; i < rowsTablaMatricular; i++) {
        for (let j = 0; j < 3; j++) {
            arrMaterias[i] = tablaMatricular.rows[i].cells.item(0).innerText

        }

    }
    //Obtener el tamaño del objeto 
    var arrMateriasSize = Object.keys(arrMaterias).length
    //Imprimir datos para monitorear que todo va bien
    console.log("Obj materias: ")
    console.log(arrMaterias)
    console.log("Tamaño obj materias: " + arrMateriasSize)

    //Bucle for por sí se agrega más de una materia
    for (let i = 0; i < arrMateriasSize; i++) {


        //Variable params que almacenará los datos que van para MYSQL
        const params = {
            StudentId: localStorage.getItem('id'),
            CourseId: arrMaterias[i]

        }
        console.log(params)

        //Decir que nuestro fetch es de tipo POST
        const options = {
            method: 'POST',
            body: JSON.stringify(params),
            headers: {
                'Content-Type': 'application/json'


            }
        }

        //Fetch para enviar los datos
        fetch('http://localhost:3001/student/enrollment', options)

            .then(response => response.json())
        alert('Registro creado exitosamente, ya se encuentra matriculado en la asignatura: ' + arrMaterias[i])
    }

    divTablaMatricular.style.display = 'none'
    }
divEscogeMateria.style.display = 'none'
}






//---------------------------SESION------------------------------

//Registrarse
function signUp() {

    registrado = false
    //Declarar variables a usar
    //Por alguna razón sí tomo las declaradas al principio su valor da "undefined"
    //Así que la solución fue hacerlo otra vez en esta función
    let txtemail = document.getElementById('txtemailreg').value
    let txtpassword = document.getElementById('txtpasswordreg').value
    let txtnombre = document.getElementById('txtnombre').value
    let txtdocid = document.getElementById('txtdocid').value
    let txtprogram = document.getElementById('txtprogram').value
    let txtsemester = document.getElementById('txtsemester')

    while (registrado != true) {


        //Parametros a enviar a SQL
        const params = {
            StudentName: txtnombre,
            StudentDocId: txtdocid,
            StudentUser: txtemail,
            StudentPass: txtpassword,
            ProgramId: txtprogram


        }
        console.log(params)
        //User y pass quedan vacios

        //Request tipo POST
        const options = {
            method: 'POST',
            body: JSON.stringify(params),
            headers: {
                'Content-Type': 'application/json'


            }
        }

        fetch('http://localhost:3001/student', options)

            .then(response => response.json())



        //Pedir los valores para monitorear sí se agregó el usuario

        fetch('http://localhost:3001/student')
            .then(response => response.json())
            .then(json => console.log(json))


        alert('Registro exitoso, bienvenido')



        console.log(params)
        registrado = true
    }
    setTimeout(() => {

        location.reload()
    }, 3000)

}

//Iniciar sesión
async function signIn() {
    //Obtener valores de los inpits
    txtemail = document.getElementById('txtemail').value
    txtpassword = document.getElementById('txtpassword').value
    var passwordJSON
    var password

    //POST el usuario para traer los datos de inicio relacionado con ese usuario
    //NOTA: No supe como alertar cuando el usuario no coincide o no se encuentra en la base de datos
    //así que simplemente dará error y no avanzará hasta que se ingrese un nombre de usuario registrado
    fetch(`http://localhost:3001/student/${txtemail}`)
        .then(response => response.json())
        .then(data => passwordJSON = data)
        .then(() => console.log(passwordJSON))
        .catch(error => (alert('Usuario o contraseña incorrectos')))

    //Como la petición demora un tiempo (imperceptible para nosotros pero para la maquina no lo es)
    //Se crea la funcion setTimeout para simular el delay y que se ejecute el codigo después de que lleguen la request a la API
    setTimeout(() => {

        //Transformamos el JSON 
        passwordOBJ = JSON.parse(JSON.stringify(passwordJSON))

        console.log(passwordOBJ[0].StudentPass)
        console.log(passwordOBJ[0].id)
        localStorage.setItem('id', passwordOBJ[0].id)

        password = passwordOBJ[0].StudentPass
        //Validación sí la pass ingresada es igual a la obtrnida mediante el usuario ingresado
        if (txtpassword == password) {
            alert('Inicio de sesión exitoso')
            window.location.replace('./html/sistema.html')

        } else {
            alert('Usuario o contraseña incorrectos')
        }



        //console.log(password.StudentPass)

    }, 1500)

}
