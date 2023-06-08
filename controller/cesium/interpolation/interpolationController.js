const CesiumInterpolation = require('./CesiumInterpolation')
const {JulianDate} = require("cesium");

exports.cesiumInterp = (req, res) => {
    let {timeArray, propValArray, interpolationAlgorithm, currentTime} = req.body
    const julianDateTimeArray = CesiumInterpolation.getSampleTime(timeArray)

    const interp = new CesiumInterpolation(propValArray, julianDateTimeArray, interpolationAlgorithm);
    const currentTimeJ = JulianDate.fromIso8601(currentTime)
    const value = interp.getValue(currentTimeJ)

    res.status(200).json({
        status: 'success',
        currentPropValArr: value,
    })
}