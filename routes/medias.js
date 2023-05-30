const { Router } = require("express");
const Post = require("../models/post");
const Media = require("../models/media");
const hasRole = require("../middleware/hasRole");
const { schemaMedia, schemaMediaPut } = require("../utils/validate/schemas");


const router = Router();


//POST
router.post("/medias", hasRole(["superAdmin", "admin", "organizador", "participante"]),schemaMedia, async (req, res) => {
    const { link, postId } = req.body;

    try {
        const post = Post.findByPk(postId)
        if (post) {
            const media = await Media.create({ link, postId });
            return res.status(201).json(media)

        } else {
            return res.status(404).json({ message: "Link não encontrado." })
        }
    } catch (error) {
        return res.status(500).json({ message: "Um erro aconteceu." })
    }

});

//GET - de um e de todos
router.get("/medias", hasRole(["superAdmin", "admin", "organizador", "participante"]), async (req, res) => {
    const { id } = req.query;
    try {
        if (id) {
            const media = await Media.findByPk(id);
            if (media) {
                return res.status(200).json(media);
            } else {
                return res.status(404).json({ message: "Link não encontrado." });
            }
        }
        const medias = await Media.findAll();
        return res.status(200).json(medias);
    } catch (error) {
        return res.status(500).json({ message: "Um erro aconteceu." })
    }
});

//PUT
router.put("/medias/:id", hasRole(["superAdmin", "admin", "organizador", "participante"]), schemaMediaPut, async (req, res) => {
    try {
        const { link } = req.body;
        const media = await Media.findByPk(req.params.id);
        if (media) {
            await media.update({ link });
            return res.status(200).json({ message: "Link alterado." });
        } else {
            return res.status(400).json({ message: "Link não encontrado" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Um erro aconteceu." })
    }
});

//DELETE
router.delete("/medias/:id", hasRole(["superAdmin", "admin", "organizador", "participante"]), async (req, res) => {
    const media = await Media.findOne({ where: { id: req.params.id } });
    try {
        if (media) {
            await Media.destroy({ where: { id: req.params.id } });
            return res.json({ message: "Link deletado com sucesso." })
        }
    } catch (error) {
        return res.status(500).json({ message: "Um erro aconteceu." })
    }
});



module.exports = router;