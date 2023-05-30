const { Router } = require("express");
const Location = require("../models/location");
const { schemaLocation, schemaLocationPut } = require("../utils/validate/schemas");
const hasRole = require("../middleware/hasRole");
const router = Router();

router.get('/locations', hasRole(["superAdmin", "admin", "organizador", "participante"]), async (req, res) => {
    const { id } = req.query;

    try {
        if (id) {
            const location = await Location.findByPk(id);
            if (location) {
                return res.status(200).json(location);
            } else {
                return res.status(404).json({ message: "Local não encontrado." });
            }
        }
        const locations = await Location.findAll();
        res.status(200).json(locations);
    } catch (error) {
        res.status(500).json({ message: "Um erro aconteceu" })

    }
});

router.post("/locations", hasRole(["superAdmin", "admin", "organizador"]), schemaLocation, async (req, res) => {

    const { cep, uf, cidade, bairro, endereco, complemento, name } = req.body;

    try {
        const newLocation = await Location.create({ cep, uf, cidade, bairro, endereco, complemento, name })
        res.status(201).json(newLocation);

    } catch (error) {
        res.status(500).json({ message: "Um erro aconteceu" })

    }

});
router.put("/locations/:id", hasRole(["superAdmin", "admin", "organizador"]),schemaLocationPut, async (req, res) => {

    const { cep, uf, cidade, bairro, endereco, complemento, name } = req.body;
    const location = await Location.findByPk(req.params.id)

    try {
        if (location) {

            await Location.update(
                { cep, uf, cidade, bairro, endereco, complemento, name },
                { where: { id: req.params.id } }
            );

            return res.json({ message: "O local foi editado." });


        } else {
            return res.json({ message: "id invalido" });
        }

    } catch (error) {
        return res.status(500).json({ message: "Um erro aconteceu" })

    }

});
router.delete("/locations/:id", hasRole(["superAdmin", "admin", "organizador"]), async (req, res) => {

    const { id } = req.params;
    const location = await Location.findOne({ where: { id } });
    try {
        if (location) {
            location.destroy()
            return res.status(200).json({ message: "O local foi removido." });
        } else {
            return res.status(404).json({ message: "Local com o ID informado não foi encontrado " });
        }
    } catch (error) {
        return res.status(500).json({ message: "Um erro aconteceu" })
    }

})





module.exports = router;
