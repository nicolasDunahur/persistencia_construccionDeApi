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
  models.materias
    .findAll({
      attributes: ["id", "nombre","id_carrera"],
      include:[{as:'Carrera-Relacionada', model:models.carrera, attributes:["id", "nombre"]}],
      offset: (paginaActual - 1 ) * cantidadAVer,
      limit: cantidadAVer
    })
    .then(materias => res.send(materias))
    .catch(error => {return next(error)});
});

router.post("/", (req, res) => {
    // nico user 1234
    const token = req.headers.authorization;
    if (token !== "Basic bmljbzoxMjM0") {
        res.status(400).send({message:"Token invalido"}) 
    }
  models.materias
    .create({ nombre: req.body.nombre, id_carrera: req.body.id_carrera })
    .then(materias => res.status(201).send({ id: materias.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otra materias con el mismo nombre')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findMaterias = (id, { onSuccess, onNotFound, onError }) => {
  models.materias
    .findOne({
      attributes: ["id", "nombre"],
      where: { id }
    })
    .then(materias => (materias ? onSuccess(materias) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
    // nico user 1234
    const token = req.headers.authorization;
    if (token !== "Basic bmljbzoxMjM0") {
        res.status(400).send({message:"Token invalido"}) 
    }
    findMaterias(req.params.id, {
        onSuccess: materias => res.send(materias),
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
  const onSuccess = materias =>
  materias
      .update({ nombre: req.body.nombre, id_carrera: req.body.id_carrera }, { fields: ["nombre", "id_carrera"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra materias con el mismo nombre')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
    findMaterias(req.params.id, {
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
  const onSuccess = materias =>
    materias
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
  findMaterias(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;