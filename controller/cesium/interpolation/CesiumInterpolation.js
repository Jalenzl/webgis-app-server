const {SampledProperty, LagrangePolynomialApproximation, HermitePolynomialApproximation, JulianDate} = require('cesium')
const {propEach} = require('@turf/turf')

/**
 * @class
 * @desc cesium自带的时间插值方法进行属性值在时间方向上的插值 目前只支持属性值样本为二维数组
 * @param {Array<Array>} propValArray: 样本属性值数组
 * @param {Array<JulianDate>} timeArray: 样本时间数组
 * @param {String} interpolationAlgorithm: 插值算法：'LAGRANGE' or 'HERMITE' or 'LINEAR', 默认为'LAGRANGE'
 */
class CesiumInterpolation {
    constructor(propValArray, timeArray, interpolationAlgorithm) {
        this._propValArray = propValArray;
        this._timeArray = timeArray;
        this._interpolationAlgorithm = interpolationAlgorithm || 'LAGRANGE';
    }

    get interpolationAlgorithm() {
        return this._interpolationAlgorithm;
    }

    set interpolationAlgorithm(value) {
        this._interpolationAlgorithm = value;
    }

    get propValArray() {
        return this._propValArray;
    }

    set propValArray(value) {
        this._propValArray = value;
    }

    get timeArray() {
        return this._timeArray;
    }

    set timeArray(value) {
        this._timeArray = value;
    }

    /**
     * @func
     * @desc 获取插值后对应时间的属性值
     * @param {JulianDate} time: 希望获取的属性值对应的时间
     * @returns {Array} valArrQueried: 插值后的属性值数组
     */
    getValue(time) {
        let sampledProperty = new SampledProperty(Number);
        let num = this.propValArray[0].length;
        console.log(num)
        let valArrQueried = [];
        if (this.interpolationAlgorithm.toUpperCase() === 'LAGRANGE') {
            sampledProperty.setInterpolationOptions({
                interpolationAlgorithm: LagrangePolynomialApproximation,
                interpolationDegree: 3
            })
        }

        if (this.interpolationAlgorithm.toUpperCase() === 'HERMITE') {
            sampledProperty.setInterpolationOptions({
                interpolationAlgorithm: HermitePolynomialApproximation,
                interpolationDegree: 3
            })
        }

        if (this.interpolationAlgorithm.toUpperCase() === 'LINEAR') {
            sampledProperty.setInterpolationOptions({
                interpolationAlgorithm: LagrangePolynomialApproximation,
                interpolationDegree: 3
            })
        }


        for (let i = 0; i < num; i++) {
            for (let j = 0; j < this.propValArray.length; j++) {
                sampledProperty.addSample(this.timeArray[j], this.propValArray[j][i]);
            }
            const value = sampledProperty.getValue(time);
            console.log(value)
            valArrQueried.push(value);
        }

        return valArrQueried;
    }


    /**
     * @func
     * @desc 将带有属性值的geojson转换为属性值样本数组
     * @param {featureCollection} propGeoJson
     * @returns {Array<Array>} propValArray: 样本属性值数组
     */
    static getSampleProperty(...propGeoJson) {
        let propArrList = []
        const getPropValArray = (propGeoJson) => {
            let pressureValueArray = []
            propEach(propGeoJson, function (currentProperties) {
                pressureValueArray.push(currentProperties.pressure)
            })
            return pressureValueArray
        }
        for (const item of propGeoJson) {
            propArrList.push(getPropValArray(item))
        }

        return propArrList
    }

    /**
     * @func
     * @desc 将iso8601字符串转换为时间样本数组
     * @param {iso8601String} isoTime
     * @returns {Array<JulianDate>} julianDateTimeArray: 样本时间数组
     */
    static getSampleTime(...isoTime) {
        let julianDateTimeArray = []
        for (const item of isoTime[0]) {
            julianDateTimeArray.push(JulianDate.fromIso8601(item))
        }
        return julianDateTimeArray
    }
}

module.exports = CesiumInterpolation