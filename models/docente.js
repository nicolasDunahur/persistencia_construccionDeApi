'use strict';
module.exports = (sequelize, DataTypes) => {
  const docente = sequelize.define('docente', {
    nombre: DataTypes.STRING,
    id_materia: DataTypes.INTEGER
  }, {});
  docente.associate = function(models) {
      docente.belongsTo(models.materias
        ,{ 
          as: 'Materia-Relacionada',
          foreignKey:'id_materia'
        })
  };
  return docente;
};