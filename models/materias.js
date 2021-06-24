'use strict';
module.exports = (sequelize, DataTypes) => {
  const materias = sequelize.define('materias', {
    nombre: DataTypes.STRING,
    id_carrera: DataTypes.INTEGER
  }, {});
  materias.associate = function(models) {
    materias.belongsTo(models.carrera
      ,{ 
        as: 'Carrera-Relacionada',
        foreignKey:'id_carrera'
      })
    materias.hasMany(models.docente, { 
        as:"docente", 
        primaryKey:"id"
    })
  };
  return materias;
};

