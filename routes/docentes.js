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

  models.docente
    .findAll({
      attributes: ["id", "nombre","id_materia"],
      include:[{as:'Materia-Relacionada', model:models.materia, attributes:["id", "nombre"]}],
      offset: (paginaActual - 1 ) * cantidadAVer,
      limit: cantidadAVer 
    })
    .then(docente => res.send(docente))
    .catch(error => {return next(error)});
});

router.post("/", (req, res) => {
    // nico user 1234
    const token = req.headers.authorization;
    if (token !== "Basic bmljbzoxMjM0") {
        res.status(400).send({message:"Token invalido"}) 
    }
  models.docente
    .create({ nombre: req.body.nombre , id_materia: req.body.id_materia })
    .then(docente => res.status(201).send({ id: docente.id }))
    .catch(error => {
      if (error == "SequelizeUniqueConstraintError: Validation error") {
        res.status(400).send('Bad request: existe otra docente con el mismo nombre')
      }
      else {
        console.log(`Error al intentar insertar en la base de datos: ${error}`)
        res.sendStatus(500)
      }
    });
});

const findDocente = (id, { onSuccess, onNotFound, onError }) => {
  models.docente
    .findOne({
      attributes: ["id", "nombre"],
      where: { id }
    })
    .then(docente => (docente ? onSuccess(docente) : onNotFound()))
    .catch(() => onError());
};

router.get("/:id", (req, res) => {
    // nico user 1234
    const token = req.headers.authorization;
    if (token !== "Basic bmljbzoxMjM0") {
        res.status(400).send({message:"Token invalido"}) 
    }
  findDocente(req.params.id, {
        onSuccess: docente => res.send(docente),
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

  const onSuccess = docente =>
  docente
      .update({ nombre: req.body.nombre, id_materia: req.body.id_materia }, { fields: ["nombre", "id_materia"] })
      .then(() => res.sendStatus(200))
      .catch(error => {
        if (error == "SequelizeUniqueConstraintError: Validation error") {
          res.status(400).send('Bad request: existe otra docente con el mismo nombre')
        }
        else {
          console.log(`Error al intentar actualizar la base de datos: ${error}`)
          res.sendStatus(500)
        }
      });
    findDocente(req.params.id, {
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
  const onSuccess = docente =>
  docente
      .destroy()
      .then(() => res.sendStatus(200))
      .catch(() => res.sendStatus(500));
    findDocente(req.params.id, {
    onSuccess,
    onNotFound: () => res.sendStatus(404),
    onError: () => res.sendStatus(500)
  });
});

module.exports = router;