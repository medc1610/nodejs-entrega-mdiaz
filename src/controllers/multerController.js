

export const insertImg = async (req, res) => {
    try {
        console.log(req.file)
        res.logger.info(`Imagen cargada correctamente: ${req.file.filename} - ${new Date().toLocaleDateString()}`)
        res.status(200).send("Imagen cargada correctamente")
    } catch (e) {
        res.logger.error(`Error al cargar imagen ${e} - ${new Date().toLocaleDateString()}`)
        res.status(500).send("Error al cargar imagen")
    }
}
