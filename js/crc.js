//var value="1010";
var carry=16;//进制
var poly="100110001";//CRC:x8+x5+x4+1=100110001,反100011001
var width=8;
var refin=true;
var refout=true;

//获取文件名称
function getFileName(value){
	value=value.substr(2*3,(parseInt(value.substr(2*1,2),16)-1));
	var fileName="";
	for(var i=0;i<value.length;i=i+2){
		fileName+=String.fromCharCode(parseInt(value.substr(i,2),16));
	}
	return fileName;
}

//文件名称转换为CRC
function sendFileName(fileName){
	fileName=fileName+".x3g";
	//获取长度
	var result="D5"+getFormatNum(fileName.length+2,2,16)+"10";
	//文件名UTF-8编码十六进制
	result+="";
	result+="00";
	return getTheCRC(commond.substr(4));
}

//var CRC=getUniCRC(value,carry,width,poly,refin,refout);
function getTheCRC(value){
	var result=getUniCRC(value,carry,width,poly,refin,refout);
	return result.toUpperCase();
}

//此算法适用于INIT，XOROUT为0的CRC
//value:待计算进制字符串
//carry:进制
//width：CRC宽度
//poly:CRC二项式二进制字符串
function getUniCRC(value,carry,width,poly,refin,refout){
	var m=getZero(width);
	if(value.length<2){
		value='0'+value;
	}
	var cx2Str=parseInt(value,carry).toString(2)+m;
	cx2Str=getRevert(value,carry,refin)+m;
	var resouce=getCRC8(cx2Str,poly);
	var CRC=parseInt(resouce,2).toString(16);
	if(refout){
		CRC=parseInt(resouce.split("").reverse().join(""),2).toString(16);
	}
	return CRC;
}

//获取比特数
function getZero(num){
	var result='';
	for(var i=0;i<num;i++){
		result+='0';
	}
	return result;
}

//CRC校验
function getCRC8(cx2Str,gx2Str){
	//模二除法
	var result=parseInt(cx2Str,2).toString(2);
	
	if(result.length<gx2Str.length){
		return result;
	}else{
		var temp=result.substr(0,gx2Str.length);
		result=getMo2(temp,gx2Str)+result.substr(gx2Str.length);		
		result=getCRC8(result,gx2Str);
	}
	
	result=zfill(parseInt(result,2),8);
	return result;
}

//RefIn,两位一组
function getRevert(init2,carry,refin){
	var result="";
	if(refin){
		for(var i=0;i<init2.length;){
			var temp=zfill(parseInt(init2.substr(i,2),carry).toString(2),8);
			result+=zfill(parseInt(init2.substr(i,2),carry).toString(2),8).split("").reverse().join("");
			i+=2;
		}
	}else{
		result=zfill(parseInt(init2,carry).toString(2),init2.length*4);
	}
	return zfill(parseInt(result,2),init2.length*4);
}

//规范数字格式
function zfill(num, size) {
	 return getFormatNum(num,size,2);
}
/**
* 规范格式
* num: 十进制数值
* size: 截取长度
* carray: 进制
* @return: 返回进制字符串
*/
function getFormatNum(num,size,carry){
	var num2str=num.toString(carry);
    var s = "00000000000000000000000000000000000" + num2str;
    return s.substr(s.length-size);
}

//模二运算
function getMo2(str1,str2){
	var result='';
	for(var i=0;i<str1.length;i++){
		var s1=str1[i];
		var s2=str2[i];
		if((s1=='0' || s1=='1') && (s2=='0' || s2=='1')){
			if(s1==s2){
				result += '0';
			}else{
				result += '1';
			}
		}
	}
	return result;
}