import React from 'react'

const GradColor = ['#C0FCD0', '#B1F0A1', '#A2E572', '#92DA43'];

export function toArray(obj) {
  if (!obj) return []

  var arr = Object.keys(obj).map(function (key, index) { 
    var result  = clone(obj[key]);
    if(typeof(result)=='object'){
      result.key = key
    }
    return result; 
  });
  return arr
}
export function getMarks(obj, getkeys, values){
  var result = {};
  Object.keys(obj).map(function (key, index){
    var r_key=obj[key][getkeys].toFixed(2)
    var r_value=obj[key][values];
    if(result[r_key]!=null){
      r_value = result[r_key]['value']+' ,'+ r_value;
    }
    result[r_key] = '';
  })
  return result
}
export function retrieveData(obj, froms, tos){
  if(obj && froms && tos && froms.length==tos.length){
      var result = Object.keys(obj).map(function(key, index){
      var r = {};
      for(var i=0; i<froms.length; i++){
        r[tos[i]] = obj[key][froms[i]]
      }
      return r
    })
    return result
  } 
}
export function setCookie(cname,cvalue,exdays) {
          var d = new Date();
          d.setTime(d.getTime() + (exdays*24*60*60*1000));
          var expires = "expires=" + d.toGMTString();
          document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
      }
export function getCookie(cname) {
      var name = cname + "=";
      var ca = document.cookie.split(';');
      for(var i = 0; i <ca.length; i++) {
          var c = ca[i];
          while (c.charAt(0)==' ') {
              c = c.substring(1);
          }
          if (c.indexOf(name) == 0) {
              return c.substring(name.length,c.length);
          }
      }
      return "";
    }
export function getGradColor(scale){
  return GradColor[scale];
}
export function searchFromArrayObject(findkey, findvalue, myArray){
    for (var i=0; i < myArray.length; i++) {
        if (myArray[i][findkey] === findvalue) {
            return myArray[i].key;
        }
    }
    return '';
}
function clone(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}