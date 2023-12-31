const connection = require('../SQL_CONECTION');
const { v4: uuidv4 } = require('uuid');

function generarTokenID() {
  return uuidv4();
}


//Agregar paciente nuevo
async function AgregarPaciente(req, res, data, uid) {
  const PID = generarTokenID();
  //agregar en tabla de pacientes
  const script = 'INSERT INTO "paciente" ("pid", "uid", "nombre", "apellidop", "apellidom", "genero", "direccion", "telefono", "fechaingreso", "fechanacimiento") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)';
  try {
    const result = await connection.query(script,
      [
        PID,
        uid,
        data.Nombre,
        data.ApellidoP,
        data.ApellidoM,
        data.Genero,
        data.Direccion,
        data.telefono,
        data.FechaIngreso,
        data.FechaNacimiento
      ]);
    //console.log('Se agregó un nuevo paciente');
    //agregar en tabla de info social
    const scriptSocial = 'INSERT INTO "infosocial" ("pid", "niveleducativo", "profesion", "estadocivil" ) VALUES ($1, $2, $3, $4)';
    try {
      const result = await connection.query(scriptSocial,
        [
          PID,
          data.NivelEducativo,
          data.Profesion,
          data.EstadoCivil
        ]);
      //console.log('Se agregó un nuevo social');
      //agregar en tabla de info social
      const scriptMedica = 'INSERT INTO "infomedica" ("pid", "enfermedades", "alergias", "antecedentes", "medicamentos") VALUES ($1, $2, $3, $4, $5)';
      try {
        const result = await connection.query(scriptMedica,
          [
            PID,
            data.Enfermedades,
            data.Alergias,
            data.Antecedentes,
            data.Medicamentos
          ]);
        console.log('(201) Se agregó un nuevo paciente: ' + PID);
        res.status(201).json({ mensaje: 'Paciente agregado' });
      }
      catch (error) {
        console.error('Error de servidor', error);
        res.status(500).json({ error: 'Ocurrió un error' });
      }
    }
    catch (error) {
      console.error('Error de servidor', error);
      res.status(500).json({ error: 'Ocurrió un error' });
    }
  }
  catch (error) {
    console.error('Error de servidor', error);
    res.status(500).json({ error: 'Ocurrió un error' });
  }

}

//Editar paciente nuevo

//Eliminar paciente 
async function EliminarPaciente(req, res, id) {
  const script = 'DELETE FROM "paciente" WHERE "pid" = $1';
  try {
    const result = await connection.query(script, [id]);
    if (result.rowCount > 0) {
      console.log('Se eliminó un paciente');
      res.status(200).json({ mensaje: 'Paciente eliminado' });
    } else {
      console.log('No se encontró el paciente con el PID especificado');
      res.status(404).json({ mensaje: 'Paciente no encontrado' });
    }
  } catch (error) {
    console.error('Error de servidor', error);
    res.status(500).json({ error: 'Ocurrió un error' });
  }
}


//Obtener pacientes
async function GetTablePacientes(req, res, uid) {
  
  try {
    // Modifica la consulta SQL para filtrar por el valor de uid
    const result = await connection.query('SELECT * FROM paciente WHERE uid = $1', [uid]);
    res.json(result.rows); // Devuelve los datos de la tabla como un JSON
  } catch (error) {
    console.error('Error al obtener la tabla de pacientes:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
}


module.exports = {
  AgregarPaciente, GetTablePacientes, EliminarPaciente
};
