var express = require("express");
var router = express.Router();
var models = require("../models");

router.get("/", (req, res,next) => {
  // nico user 1234
  const token = req.headers.authorization;
  if (token !== "Basic bmljbzoxMjM0") {
      res.status(400).send({message:"Token invalido"}) 
  }

  const paginaActual = parseInt( req.query.numeroDePagina );
  const cantidadAVer = parseInt( req.query.cantidadDeColumnas );
  models.alumno
    .findAll({
      attributes: ["id", "nombre","id_carrera"],
      include:[{as:'Carrera-Relacionada', model:models.carrera, attributes:["id", "nombre"]}],
      offset: (paginaActual - 1 ) * cantidadAVer,
      limit: cantidadAVer
    })
    .then(alumno => res.send(alumno))
    .catch(error => {return next(error)});
});

router.post("/", (req, res) => {
    // nico user 1234
    const token = req.headers.authorization;
    if (token !== "Basic bmljbzoxMjM0") {
        res.status(400).send({message:"Token invalido"}) 
    }
  models.alumno
    .create({ nombre: req.body.nombre, id_carrera: req.body.id_carrera })
    .then(alumno => res.status(201).send({ id: alumno.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otra alumnoa con el mismo nombre')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findAlumno = (id, { onSuccess, onNotFound, onError }) => {
  models.alumno
    .findOne({
      attributes: ["id", "nombre"],
      where: { id }
    })
    .then(alumno => (alumno ? onSuccess(alumno) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
    // nico user 1234
    const token = req.headers.authorization;
    if (token !== "Basic bmljbzoxMjM0") {
        res.status(400).send({message:"Token invalido"}) 
    }
    findAlumno(req.params.id, {
        onSuccess: alumno => res.send(alumno),
        onNotFound: () => res.sendStatus(404),
        onError: () => res.sendStatus(500)
  });
});

router.put("/:id", (req, res) => {
    // nico user 1234
    const token = req.headers.authorization;
    if (token !== "Basic bmljbzoxMjM0") {
        res.status(400).send({message:"Token invalido"}) 
    }

  const onSuccess = alumno =>
  alumno
      .update({ nombre: req.body.nombre, id_carrera: req.body.id_carrera }, { fields: ["nombre", "id_carrera"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra alumno con el mismo nombre')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
      findAlumno(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

router.delete("/:id", (req, res) => {
    // nico user 1234
    const token = req.headers.authorization;
    if (token !== "Basic bmljbzoxMjM0") {
        res.status(400).send({message:"Token invalido"}) 
    }
    
  const onSuccess = alumno =>
   alumno
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
    findAlumno(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;