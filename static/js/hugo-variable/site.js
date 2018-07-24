/**
 * Vue.jsによる変数対応
 */
var vue;
function init_vue(variables, computed, delimiters) {
  vue = new Vue({
    delimiters: delimiters,
    el: '#content',
    data: variables,
    computed: computed
  });
}

function get_fence_variables(className) {
  var elements = document.getElementsByClassName(className);

  if (elements.length > 0) {
    var element = elements.item(0);
    element.setAttribute('v-pre', '');
    var yaml = jsyaml.safeLoad(element.innerText);

    var vue_variables = get_variables(yaml['variables']);
    var vue_computed = get_computed(yaml['computed']);
    var vue_delimiters = get_delimiters(yaml['delimiters']);
    return [vue_variables, vue_computed, vue_delimiters];
  } else {
    return null;
  }
}

function get_variables(yaml) {
  if (yaml === undefined) {
    return new Object();
  }

  var ret = {};
  Object.keys(yaml).forEach(function(key) {
    var value = yaml[key];
    if (value['function'] !== undefined) {
      var funcstr = value['function'];
      var func = eval(funcstr);
      ret[key] = func;
    } else if (value['value'] !== undefined) {
      ret[key] = value['value'];
    } else {
      console.log("変数" + key + "に'function'も'value'も定義されていません。");
    }
  });

  return ret;
}

function get_computed(yaml) {
  if (yaml === undefined) {
    return new Object();
  }

  var ret = {};
  Object.keys(yaml).forEach(function(key) {
    var value = yaml[key];
    if (value['value'] !== undefined) {
      var func = new Function(value['value']);
      ret[key] = func;
    } else {
      console.log("算出値" + key + "に'value'が定義されていません。");
    }
  });

  return ret;
}

function get_delimiters(yaml) {
  if (yaml !== undefined) {
    return yaml;
  } else {
    return ["{{", "}}"];
  }
}

var fence_variables = get_fence_variables("language-yaml:variables");
if (fence_variables != null) {
  init_vue(fence_variables[0], fence_variables[1], fence_variables[2]);
}
