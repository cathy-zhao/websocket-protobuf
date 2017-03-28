var TFloat = function (aFloat, isRealInt32) {
    this.inialValue = aFloat;
    if (isRealInt32) {
        this.iValue = aFloat;
        this.iUnits = 0;
        this.iDigit = 0;
    }
    else {
        this.iUnits = (aFloat & 0x00000003);
        this.iDigit = ((aFloat & 0x0000000C) >> 2);
        this.iValue = (aFloat >> 4);
        //int value = (iValue << 4);
    }
}

/**
 * 设置TFloat基本值
 * @param {[number]} aValue [值]
 * @param {[number]} aDigit [小数点位数]
 * @param {[number]} aUnits [单位]
 */
TFloat.prototype.set = function(aValue, aDigit, aUnits){
	this.iValue = aValue;
	this.iDigit = aDigit;
	this.iUnits = aUnits;
}

/**
 * 将TFloat数据转换为float数据
 * @return {[float]} [转换结果]
 */
TFloat.prototype.toFloat = function () {
    if(!this){
        return 0;
    }

	return this.iValue * Math.pow(10, - this.iDigit + (this.iUnits << 2));
}

/**
 * 将tfloat数值转换成TFloat对象，并最终转换成float值
 * @param  {[number]} tfloat [TFLoat数值]
 * @return {[float]}        [基本数值]
 */
TFloat.convert = function(tfloat) {
    if(!tfloat){
        return 0;
    }

	var tresult = new TFloat(tfloat);

	return tresult.toFloat();
}

Number.prototype.convertTFloat = function(){
	var tresult = new TFloat(this);

	return tresult.toFloat();
}

module.exports = TFloat;