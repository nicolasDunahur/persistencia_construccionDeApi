'use strict';
module.exports = (sequelize, DataTypes) => {
  const carrera = sequelize.define('carrera', {
    nombre: DataTypes.STRING
  }, {});
  carrera.associate = function(models) {
    carrera.hasMany(models.materias, { 
      as:"materia", 
      primaryKey: "id"
    })
    carrera.hasMany(models.alumno, { 
      as:"alumno", 
      primaryKey:"id"
    })
  };

  return carrera;
};
