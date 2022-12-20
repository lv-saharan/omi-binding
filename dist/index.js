// node_modules/omi/src/util.js
(function() {
  if (window.Reflect === void 0 || window.customElements === void 0 || window.customElements.hasOwnProperty("polyfillWrapFlushCallback")) {
    return;
  }
  const BuiltInHTMLElement = HTMLElement;
  window.HTMLElement = function HTMLElement2() {
    return Reflect.construct(BuiltInHTMLElement, [], this.constructor);
  };
  HTMLElement.prototype = BuiltInHTMLElement.prototype;
  HTMLElement.prototype.constructor = HTMLElement;
  Object.setPrototypeOf(HTMLElement, BuiltInHTMLElement);
})();
var defer = typeof Promise == "function" ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;
function pathToArr(path) {
  if (typeof path !== "string" || !path)
    return [];
  return path.replace(/]/g, "").replace(/\[/g, ".").split(".");
}

// node_modules/omi/src/extend.js
var extension = {};
function extend(name, handler) {
  extension["o-" + name] = handler;
}
function set(origin, path, value) {
  const arr = pathToArr(path);
  let current = origin;
  for (let i = 0, len = arr.length; i < len; i++) {
    if (i === len - 1) {
      current[arr[i]] = value;
    } else {
      current = current[arr[i]];
    }
  }
}
function get(origin, path) {
  const arr = pathToArr(path);
  let current = origin;
  for (let i = 0, len = arr.length; i < len; i++) {
    current = current[arr[i]];
  }
  return current;
}

// src/index.js
function eventProxy(e) {
  return this._bindingListeners[e.type](e);
}
function bind(el, type, handler) {
  el._bindingListeners = el._bindingListeners || {};
  el._bindingListeners[type] = handler;
  el.addEventListener(type, eventProxy);
}
function unbind(el, type) {
  el.removeEventListener(type, eventProxy);
}
var BINDING_HANDLERS = [];
var addBindingHandler = (handler) => {
  BINDING_HANDLERS.push(handler);
};
var updateSelect = (el, path, scope) => {
  let val = get(scope, path);
  if (val instanceof Array && el.multiple) {
    Array.from(el.options).forEach((option) => {
      if (val.some((v) => v == option.value)) {
        option.selected = true;
      } else {
        option.selected = false;
      }
    });
    return;
  }
  if (val === false || val === null || val === void 0) {
    val = "";
  }
  el.value = val;
};
addBindingHandler((el, path, scope) => {
  if (el.nodeName === "SELECT") {
    unbind(el, "change");
    bind(el, "change", () => {
      const value = get(scope, path);
      if (value instanceof Array) {
        value.splice(0, value.length, ...Array.from(el.selectedOptions).filter((option) => option.value != "").map((option) => option.value));
      } else {
        set(scope, path, el.value);
      }
    });
    return updateSelect;
  }
});
var updateRadio = (el, path, scope) => {
  let val = get(scope, path);
  if (val instanceof Array) {
    el.checked = val.some((v) => v == el.value);
    return;
  }
  el.checked = get(scope, path) == el.value;
};
addBindingHandler((el, path, scope) => {
  if (el.type === "radio" && el.nodeName == "INPUT") {
    unbind(el, "change");
    bind(el, "change", () => {
      const value = get(scope, path);
      if (value instanceof Array) {
        value.splice(0, value.length, el.value);
      } else {
        set(scope, path, el.value);
      }
    });
    return updateRadio;
  }
});
var updateCheckbox = (el, path, scope) => {
  const tureVal = (el.prevProps && el.prevProps["o-true-value"]) ?? el.getAttribute("o-true-value") ?? true;
  let value = get(scope, path);
  if (value instanceof Array) {
    el.checked = value.some((v) => v == el.value);
  } else {
    el.checked = value == tureVal;
  }
};
addBindingHandler((el, path, scope) => {
  if (el.type === "checkbox" && el.nodeName == "INPUT") {
    const tureVal = (el.prevProps && el.prevProps["o-true-value"]) ?? el.getAttribute("o-true-value") ?? true;
    const falseVal = (el.prevProps && el.prevProps["o-false-value"]) ?? el.getAttribute("o-false-value") ?? false;
    unbind(el, "change");
    bind(el, "change", () => {
      let value = get(scope, path);
      if (value instanceof Array) {
        let valSet = new Set(value);
        if (el.checked) {
          valSet.add(el.value);
        } else {
          valSet.delete(el.value);
        }
        value.splice(0, value.length, ...valSet);
      } else {
        set(scope, path, el.checked ? tureVal : falseVal);
      }
    });
    return updateCheckbox;
  }
});
var updateInput = (el, path, scope) => {
  el.value = get(scope, path) ?? "";
};
addBindingHandler((el, path, scope) => {
  if (el.nodeName == "INPUT") {
    let pattern = el.getAttribute("pattern");
    if (pattern) {
      let reg = new RegExp(pattern);
      unbind(el, "keypress");
      bind(el, "keypress", (evt) => {
        if (evt.keyCode >= 48 && evt.keyCode <= 90 && !reg.test(`${el.value}${evt.key}`)) {
          evt.preventDefault();
        }
      });
    }
    unbind(el, "input");
    bind(el, "input", (evt) => {
      set(scope, path, el.value);
    });
    return updateInput;
  }
});
var updateComponent = (el, path, scope) => {
  el.value = get(scope, path) ?? null;
};
addBindingHandler((el, path, scope) => {
  if (Reflect.has(el, "value")) {
    unbind(el, "change");
    bind(el, "change", () => {
      const value = get(scope, path);
      if (value instanceof Array) {
        value.splice(0, value.length, el.value);
      } else {
        set(scope, path, el.value);
      }
    });
    return updateComponent;
  }
});
extend("model", (el, path, scope) => {
  let raw = scope;
  scope = scope.bindingScope ?? scope.props?.bindingScope ?? scope;
  if (scope === false) {
    raw = scope = window;
  }
  let bindings = raw.__bindings ?? (raw.__bindings = []);
  Promise.resolve().then(() => {
    for (let handler of BINDING_HANDLERS) {
      let updateFunction = handler(el, path, scope);
      if (typeof updateFunction === "function") {
        bindings.push({
          element: el,
          path,
          updateFunction
        });
        updateFunction(el, path, scope);
        break;
      }
    }
  });
  if (!raw.hasOwnProperty("updateBindings")) {
    raw.updateBindings = () => {
      for (let binding of bindings) {
        binding.updateFunction(binding.element, binding.path, scope);
      }
    };
  }
});
/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
//# sourceMappingURL=index.js.map
