const { interpolate, isobands } = require("@turf/turf");

exports.isoband = (req, res) => {
    let {featureCollection, cellSize, propertyName} = req.body

    const getIsoBand = (featureCollection, cellSize, propertyName) => {
        // 作等值面
        const interpolatGrids = interpolate(featureCollection, cellSize, {
            gridType: 'points',
            property: propertyName,
            units: 'degrees'
        })
        let propVal = []
        interpolatGrids.features.amp((feature) => {
            propVal.push(feature.properties[propertyName])
        })

        let step = (Math.max(...propVal) - Math.min(...propVal)) / 8
        let breaks = []
        for (let i = 0; i < 9; i++) {
            breaks.push(Math.min(...propVal) + i * step)
        }

        return isobands(interpolatGrids, breaks, {
            zProperty: propertyName,
            commonProperties: { "fill-opacity": 0.8 },
            breaksProperties: [
                {fill: "#e3e3ff"},
                {fill: "#c6c6ff"},
                {fill: "#a9aaff"},
                {fill: "#8e8eff"},
                {fill: "#7171ff"},
                {fill: "#5554ff"},
                {fill: "#3939ff"},
                {fill: "#1b1cff"}
            ],
        })
    }

    const isoband = getIsoBand(featureCollection, cellSize, propertyName)

    res.status(200).json({
        status: 'success',
        isoband: isoband,
    })
}