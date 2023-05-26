import { extend, get, set } from "omi/src/extend";

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

const BINDING_HANDLERS = [];

const addBindingHandler = (handler) => {
  BINDING_HANDLERS.push(handler);
};
const isChangeOnUpdate = (el) => {
  if (el.hasAttribute("change-on-update")) {
    let val = el.getAttribute("change-on-update");
    return val === true || val === "1" || val === "true";
  }
  return true;
};
const updateSelect = (el, path, scope) => {
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
  if (val === false || val === null || val === undefined) {
    val = "";
  }
  el.value = val;
};
/**
 * add select binding handler
 */
addBindingHandler((el, path, scope) => {
  if (el.nodeName === "SELECT") {
    unbind(el, "change");
    bind(el, "change", () => {
      const value = get(scope, path);
      if (value instanceof Array) {
        value.splice(
          0,
          value.length,
          ...Array.from(el.selectedOptions)
            .filter((option) => option.value != "")
            .map((option) => option.value)
        );
      } else {
        set(scope, path, el.value);
      }
    });
    return updateSelect;
  }
});

const updateRadio = (el, path, scope) => {
  let val = get(scope, path);
  if (val instanceof Array) {
    el.checked = val.some((v) => v == el.value);
    return;
  }
  el.checked = get(scope, path) == el.value;
};

/**
 * add radio binding handler
 */
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

const updateCheckbox = (el, path, scope) => {
  const tureVal =
    (el.prevProps && el.prevProps["o-true-value"]) ??
    el.getAttribute("o-true-value") ??
    true;
  let value = get(scope, path);
  if (value instanceof Array) {
    el.checked = value.some((v) => v == el.value);
  } else {
    el.checked = value == tureVal;
  }
};
/**
 * add checkbox binding handler
 */
addBindingHandler((el, path, scope) => {
  if (el.type === "checkbox" && el.nodeName == "INPUT") {
    const tureVal =
      (el.prevProps && el.prevProps["o-true-value"]) ??
      el.getAttribute("o-true-value") ??
      true;
    const falseVal =
      (el.prevProps && el.prevProps["o-false-value"]) ??
      el.getAttribute("o-false-value") ??
      false;
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
//input

const updateInput = (el, path, scope) => {
  el.value = get(scope, path) ?? "";
  // checkRequired(el)
};
/**
 * add input binding handler
 */
addBindingHandler((el, path, scope) => {
  if (el.nodeName == "INPUT") {
    let pattern = el.getAttribute("input-pattern");
    if (pattern) {
      let reg = new RegExp(pattern);
      unbind(el, "keypress");
      //过滤输入字符
      bind(el, "keypress", (evt) => {
        if (evt.key.length == 1 && !reg.test(`${el.value}${evt.key}`)) {
          evt.preventDefault();
        }
      });
    }

    unbind(el, "input");
    bind(el, "input", (evt) => {
      set(scope, path, el.value);
      // checkRequired(el)
    });

    return updateInput;
  }
});

//input

const updateComponent = (el, path, scope) => {
  el.value = get(scope, path) ?? "";
  // checkRequired(el)
};
/**
 * add customEl binding handler
 */
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

  //the o-model attr 顺序可以打乱
  Promise.resolve().then(() => {
    for (let handler of BINDING_HANDLERS) {
      let updateFunction = handler(el, path, scope);
      if (typeof updateFunction === "function") {
        bindings.push({
          element: el,
          path,
          updateFunction,
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
