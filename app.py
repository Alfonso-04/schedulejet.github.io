from flask import Flask, request, jsonify
from flask_mysqldb import MySQL
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

app.config['MYSQL_HOST'] = 'localhost' 
app.config['MYSQL_PORT'] = '3306' 
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'sistemahorarios'

mysql = MySQL(app)

app.secret_key = "mysecretkey"


#TABLA DOCENTE
@app.route('/obtenertododocente', methods=['GET'])
def obtenertododocente():
    try:
        cur = mysql.connection.cursor()
        cur.execute('SELECT * FROM docentes')
        rv = cur.fetchall()
        cur.close()
        payload = []
        content = {}
        for result in rv:
            content = {'id': result[0], 'nombreCompleto_docente': result[1], 'docIdentidad': result[2]}
            payload.append(content)
            content = {}
        return jsonify(payload)
    except Exception as e:
        print(e)
        return jsonify({"Mensaje":e})


@app.route('/obtenerporiddocente/<id_docente>',methods=['GET'])
def obtenerporiddocente(id_docente):
    try:
        cur = mysql.connection.cursor()
        cur.execute('SELECT * FROM docente WHERE id_docente = %s', (id_docente))
        rv = cur.fetchall()
        cur.close()
        payload = []
        content = {}
        for result in rv:
            content = {'id_docente': result[0], 'nombrecompleto_docente': result[1], 'doc_identidad': result[2]}
            payload.append(content)
            content = {}
        return jsonify(payload)
    except Exception as e:
        print(e)
        return jsonify({"Mensaje":e})
    


@app.route('/agregarprofe', methods=['POST'])
def agregarprofe():
    try:
        if request.method == 'POST':
            nombreCompleto_docente = request.json['nombre']  ## nombre del profesor
            docIdentidad = request.json['identificacion']  ## identificacion del profesor
            cur = mysql.connection.cursor()
            cur.execute= "INSERT INTO docentes (nombreCompleto_docente, docIdentidad) VALUES ('%s','%s')" % (nombreCompleto_docente, docIdentidad)
            mysql.connection.commit()
        return jsonify({"Mensaje":"Registro realizado"})
        
    except Exception as e:
        print(e)
        return jsonify({"Mensaje":e})



@app.route('/actualizar_profe/<id_docente>', methods=['PUT'])
def actualizar_profe(id_docente):
    try:
        nombrecompleto_docente = request.json['nombre']  ## nombre del profesor
        doc_identidad = request.json['identificacion']  ## identificacion del profesor
        cur = mysql.connection.cursor()
        cur.execute("""
        UPDATE docente
        SET nombrecompleto_docente = %s,
            doc_identidad = %s,
        WHERE id_docente = %s
        """, (nombrecompleto_docente, doc_identidad))
        mysql.connection.commit()
        return jsonify({"Mensaje":"Registro actualizado correctamente"})
    except Exception as e:
        print(e)
        return jsonify({"Mensaje":e})



@app.route('/borrar_profesor/<id_docente>', methods = ['DELETE'])
def borrar_profesor(id_docente):
    try:
        cur = mysql.connection.cursor()
        cur.execute('DELETE FROM docente WHERE id_docente = %s', (id_docente))
        mysql.connection.commit()
        return jsonify({"Mensaje":"Registro eliminado"}) 
    except Exception as e:
        print(e)
        return jsonify({"Mensaje":e})


#TABLA HORARIO
@app.route('/obtenertodohorario', methods=['GET'])
def obtenertodohorario():
    try:
        cur = mysql.connection.cursor()
        cur.execute('SELECT * FROM horario')
        rv = cur.fetchall()
        cur.close()
        payload = []
        content = {}
        for result in rv:
            content = {'id_horario': result[0], 'id_docente': result[1], 'horaentrada': result[2], 'horasalida': result[3], 'dia': result[4]}
            payload.append(content)
            content = {}
        return jsonify(payload)
    except Exception as e:
        print(e)
        return jsonify({"Mensaje":e})


@app.route('/obtenerporidhorario/<id_horario>',methods=['GET'])
def obtenerporidhorario(id_horario):
    try:
        cur = mysql.connection.cursor()
        cur.execute('SELECT * FROM horario WHERE id_horario = %s', (id_horario))
        rv = cur.fetchall()
        cur.close()
        payload = []
        content = {}
        for result in rv:
            content = {'id_horario': result[0], 'id_docente': result[1], 'horaentrada': result[2], 'horasalida': result[3], 'dia': result[4]}
            payload.append(content)
            content = {}
        return jsonify(payload)
    except Exception as e:
        print(e)
        return jsonify({"Mensaje":e})
    


@app.route('/agregarhorario', methods=['POST'])
def agregarhorario():
    try:
        if request.method == 'POST':
            id_docente = request.json['id_docente'] 
            horaentrada = request.json['horaentrada']  
            horasalida = request.json['horasalida']  
            dia = request.json['dia']  
            cur = mysql.connection.cursor()
            cur.execute("INSERT INTO horario (id_docente, horaentrada, horasalida, dia) VALUES (%s,%s,%s,%s,%s,%s)", (id_docente, horaentrada, horasalida, dia))
            mysql.connection.commit()
            return jsonify({"Mensaje":"Registro realizado"})
        
    except Exception as e:
        print(e)
        return jsonify({"Mensaje":e})



@app.route('/actualizar_horario/<id_horario>', methods=['PUT'])
def actualizar_horario(id_horario):
    try:
        id_docente = request.json['id_docente'] 
        horaentrada = request.json['horaentrada']  
        horasalida = request.json['horasalida']  
        dia = request.json['dia']  
        cur = mysql.connection.cursor()
        cur.execute("""
        UPDATE horario
        SET id_docente = %s,
            horaentrada = %s,
            horasalida = %s,
            dia = %s
        WHERE id_horario = %s
        """, (id_docente, horaentrada, horasalida, dia))
        mysql.connection.commit()
        return jsonify({"Mensaje":"Registro actualizado correctamente"})
    except Exception as e:
        print(e)
        return jsonify({"Mensaje":e})



@app.route('/borrar_horario/<id_horario>', methods = ['DELETE'])
def borrar_horario(id_horario):
    try:
        cur = mysql.connection.cursor()
        cur.execute('DELETE FROM horario WHERE id_horario = %s', (id_horario))
        mysql.connection.commit()
        return jsonify({"Mensaje":"Registro eliminado"}) 
    except Exception as e:
        print(e)
        return jsonify({"Mensaje":e})


#TABLA USERS
@app.route('/obtenertodousers', methods=['GET'])
def obtenertodousers():
    try:
        cur = mysql.connection.cursor()
        cur.execute('SELECT * FROM users')
        rv = cur.fetchall()
        cur.close()
        payload = []
        content = {}
        for result in rv:
            content = {'id_user': result[0], 'correo': result[1], 'contraseña': result[2], 'd_identidad': result[3]}
            payload.append(content)
            content = {}
        return jsonify(payload)
    except Exception as e:
        print(e)
        return jsonify({"Mensaje":e})


@app.route('/obtenerporidusers/<id_user>',methods=['GET'])
def obtenerporidusers(id_user):
    try:
        cur = mysql.connection.cursor()
        cur.execute('SELECT * FROM users WHERE id_user = %s', (id_user))
        rv = cur.fetchall()
        cur.close()
        payload = []
        content = {}
        for result in rv:
            content = {'id_user': result[0], 'correo': result[1], 'contraseña': result[2], 'd_identidad': result[3]}
            payload.append(content)
            content = {}
        return jsonify(payload)
    except Exception as e:
        print(e)
        return jsonify({"Mensaje":e})
    


@app.route('/agregarusers', methods=['POST'])
def agregarusers():
    try:
        if request.method == 'POST':
            correo = request.json['correo'] 
            contrasena = request.json['contrasena']  
            d_identidad = request.json['d_identidad']    
            cur = mysql.connection.cursor()
            cur.execute("INSERT INTO users (correo, contrasena, d_identidad) VALUES (%s,%s,%s,%s,%s,%s)", (correo, contrasena, d_identidad))
            mysql.connection.commit()
            return jsonify({"Mensaje":"Registro realizado"})
        
    except Exception as e:
        print(e)
        return jsonify({"Mensaje":e})



@app.route('/actualizar_users/<id_user>', methods=['PUT'])
def actualizar_users(id_user):
    try:
        correo = request.json['correo'] 
        contrasena = request.json['contrasena']  
        d_identidad = request.json['d_identidad'] 
        cur = mysql.connection.cursor()
        cur.execute("""
        UPDATE users
        SET correo = %s,
            contrasena = %s,
            d_identidad = %s
        WHERE id_user = %s
        """, (correo, contrasena, d_identidad))
        mysql.connection.commit()
        return jsonify({"Mensaje":"Registro actualizado correctamente"})
    except Exception as e:
        print(e)
        return jsonify({"Mensaje":e})



@app.route('/borrar_users/<id_user>', methods = ['DELETE'])
def borrar_users(id_user):
    try:
        cur = mysql.connection.cursor()
        cur.execute('DELETE FROM users WHERE id_user = %s', (id_user))
        mysql.connection.commit()
        return jsonify({"Mensaje":"Registro eliminado"}) 
    except Exception as e:
        print(e)
        return jsonify({"Mensaje":e})