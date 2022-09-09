var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};

// node_modules/omi/src/options.js
function getGlobal() {
  if (typeof global !== "object" || !global || global.Math !== Math || global.Array !== Array) {
    return self || window || global || function() {
      return this;
    }();
  }
  return global;
}
var options_default = {
  store: null,
  root: getGlobal(),
  mapping: {}
};

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
function cssToDom(css) {
  const node = document.createElement("style");
  node.textContent = css;
  return node;
}
function camelCase(str) {
  return str.replace(/-(\w)/g, ($2, $1) => {
    return $1.toUpperCase();
  });
}
function Fragment(props) {
  return props.children;
}
function extend(obj, props) {
  for (let i in props)
    obj[i] = props[i];
  return obj;
}
function applyRef(ref, value) {
  if (ref != null) {
    if (typeof ref == "function")
      ref(value);
    else
      ref.current = value;
  }
}
var defer = typeof Promise == "function" ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;
function isArray(obj) {
  return Object.prototype.toString.call(obj) === "[object Array]";
}
function pathToArr(path) {
  if (typeof path !== "string" || !path)
    return [];
  return path.replace(/]/g, "").replace(/\[/g, ".").split(".");
}
var hyphenateRE = /\B([A-Z])/g;
function hyphenate(str) {
  return str.replace(hyphenateRE, "-$1").toLowerCase();
}
function capitalize(name) {
  return name.replace(/\-(\w)/g, function(all, letter) {
    return letter.toUpperCase();
  }).replace(/^\S/, (s) => s.toUpperCase());
}
function getValByPath(path, current) {
  const arr = pathToArr(path);
  arr.forEach((prop) => {
    current = current[prop];
  });
  return current;
}

// node_modules/omi/src/h.js
var stack = [];
function h(nodeName, attributes) {
  let children = [], lastSimple, child, simple, i;
  for (i = arguments.length; i-- > 2; ) {
    stack.push(arguments[i]);
  }
  if (attributes && attributes.children != null) {
    if (!stack.length)
      stack.push(attributes.children);
    delete attributes.children;
  }
  while (stack.length) {
    if ((child = stack.pop()) && child.pop !== void 0) {
      for (i = child.length; i--; )
        stack.push(child[i]);
    } else {
      if (typeof child === "boolean")
        child = null;
      if (simple = typeof nodeName !== "function") {
        if (child == null)
          child = "";
        else if (typeof child === "number")
          child = String(child);
        else if (typeof child !== "string")
          simple = false;
      }
      if (simple && lastSimple) {
        children[children.length - 1] += child;
      } else if (children.length === 0) {
        children = [child];
      } else {
        children.push(child);
      }
      lastSimple = simple;
    }
  }
  if (nodeName === Fragment) {
    return children;
  }
  const p = {
    nodeName,
    children,
    attributes: attributes == null ? void 0 : attributes,
    key: attributes == null ? void 0 : attributes.key
  };
  if (options_default.vnode !== void 0)
    options_default.vnode(p);
  return p;
}

// node_modules/omi/src/constants.js
var ATTR_KEY = "prevProps";
var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

// node_modules/omi/src/vdom/index.js
function isSameNodeType(node, vnode, hydrating2) {
  if (typeof vnode === "string" || typeof vnode === "number") {
    return node.splitText !== void 0;
  }
  if (typeof vnode.nodeName === "string") {
    return !node._componentConstructor && isNamedNode(node, vnode.nodeName);
  } else if (typeof vnode.nodeName === "function") {
    return options_default.mapping[node.nodeName.toLowerCase()] === vnode.nodeName;
  }
  return hydrating2 || node._componentConstructor === vnode.nodeName;
}
function isNamedNode(node, nodeName) {
  return node.normalizedNodeName === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();
}

// node_modules/omi/src/extend.js
var extension = {};
function extend2(name, handler) {
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
function eventProxy(e) {
  return this._listeners[e.type](e);
}
function bind(el, type, handler) {
  el._listeners = el._listeners || {};
  el._listeners[type] = handler;
  el.addEventListener(type, eventProxy);
}
function unbind(el, type) {
  el.removeEventListener(type, eventProxy);
}

// node_modules/omi/src/dom/index.js
function createNode(nodeName, isSvg, options) {
  let node = isSvg ? document.createElementNS("http://www.w3.org/2000/svg", nodeName) : document.createElement(nodeName, options);
  node.normalizedNodeName = nodeName;
  return node;
}
function removeNode(node) {
  let parentNode = node.parentNode;
  if (parentNode)
    parentNode.removeChild(node);
}
function setAccessor(node, name, old, value, isSvg, component) {
  if (name === "className")
    name = "class";
  if (name[0] == "o" && name[1] == "-") {
    if (extension[name]) {
      extension[name](node, value, component);
    }
  } else if (name === "key") {
  } else if (name === "ref") {
    applyRef(old, null);
    applyRef(value, node);
  } else if (name === "class" && !isSvg) {
    node.className = value || "";
  } else if (name === "style") {
    if (!value || typeof value === "string" || typeof old === "string") {
      node.style.cssText = value || "";
    }
    if (value && typeof value === "object") {
      if (typeof old !== "string") {
        for (let i in old)
          if (!(i in value))
            node.style[i] = "";
      }
      for (let i in value) {
        node.style[i] = typeof value[i] === "number" && IS_NON_DIMENSIONAL.test(i) === false ? value[i] + "px" : value[i];
      }
    }
  } else if (name === "unsafeHTML") {
    if (value)
      node.innerHTML = value || "";
  } else if (name === "dangerouslySetInnerHTML") {
    if (value)
      node.innerHTML = value.__html || "";
  } else if (name[0] == "o" && name[1] == "n") {
    bindEvent(node, name, value, old);
  } else if (node.nodeName === "INPUT" && name === "value") {
    node[name] = value == null ? "" : value;
  } else if (name !== "list" && name !== "type" && name !== "css" && !isSvg && name in node && value !== "") {
    try {
      node[name] = value == null ? "" : value;
    } catch (e) {
    }
    if ((value == null || value === false) && name != "spellcheck")
      node.pureRemoveAttribute ? node.pureRemoveAttribute(name) : node.removeAttribute(name);
  } else {
    let ns = isSvg && name !== (name = name.replace(/^xlink:?/, ""));
    if (value == null || value === false) {
      if (ns)
        node.removeAttributeNS(
          "http://www.w3.org/1999/xlink",
          name.toLowerCase()
        );
      else
        node.pureRemoveAttribute ? node.pureRemoveAttribute(name) : node.removeAttribute(name);
    } else if (typeof value !== "function") {
      if (ns) {
        node.setAttributeNS(
          "http://www.w3.org/1999/xlink",
          name.toLowerCase(),
          value
        );
      } else {
        node.pureSetAttribute ? node.pureSetAttribute(name, value) : node.setAttribute(name, value);
      }
    }
  }
}
function eventProxy2(e) {
  return this._listeners[e.type](options_default.event && options_default.event(e) || e);
}
function bindEvent(node, name, value, old) {
  let useCapture = name !== (name = name.replace(/Capture$/, ""));
  let nameLower = name.toLowerCase();
  name = (nameLower in node ? nameLower : name).slice(2);
  if (value) {
    if (!old) {
      node.addEventListener(name, eventProxy2, useCapture);
    }
  } else {
    node.removeEventListener(name, eventProxy2, useCapture);
  }
  ;
  (node._listeners || (node._listeners = {}))[name] = value;
}

// node_modules/omi/src/vdom/diff.js
var diffLevel = 0;
var isSvgMode = false;
var hydrating = false;
var purgeVNode = (vnode, args) => {
  if (typeof vnode === "function") {
    args.vnode = vnode;
    args.update = (updateSelf) => {
      return diff(
        args.dom,
        args.vnode,
        args.dom && args.dom.parentNode,
        args.component,
        updateSelf
      );
    };
    vnode = args.vnode(args);
    if (vnode instanceof Array) {
      vnode = {
        nodeName: "output",
        children: vnode
      };
    }
    if (!vnode || typeof vnode == "string" || typeof vnode == "number" || typeof vnode == "boolean" || typeof vnode == "bigint") {
      vnode = {
        nodeName: "output",
        children: [vnode]
      };
    }
    vnode.setDom = (dom) => {
      if (dom) {
        args.dom = dom;
        Promise.resolve().then(() => {
          dom.dispatchEvent(
            new CustomEvent("updated", {
              detail: args,
              cancelable: true,
              bubbles: true
            })
          );
        });
        if (!dom.update)
          dom.update = args.update;
      }
    };
  }
  return vnode;
};
function diff(dom, vnode, parent, component, updateSelf) {
  if (!dom && !vnode)
    return;
  let ret;
  if (!diffLevel++) {
    isSvgMode = parent != null && parent.ownerSVGElement !== void 0;
    hydrating = dom != null && !(ATTR_KEY in dom);
  }
  vnode = purgeVNode(vnode, { component });
  if (vnode && vnode.nodeName === Fragment) {
    vnode = vnode.children;
  }
  if (isArray(vnode)) {
    vnode = vnode.map((child) => purgeVNode(child, { component }));
    if (parent) {
      innerDiffNode(parent, vnode, hydrating, component, updateSelf);
    } else {
      ret = [];
      vnode.forEach((item, index) => {
        let ele = idiff(index === 0 ? dom : null, item, component, updateSelf);
        ret.push(ele);
      });
    }
  } else {
    if (isArray(dom)) {
      dom.forEach((one, index) => {
        if (index === 0) {
          ret = idiff(one, vnode, component, updateSelf);
        } else {
          recollectNodeTree(one, false);
        }
      });
    } else {
      ret = idiff(dom, vnode, component, updateSelf);
    }
    if (parent && ret.parentNode !== parent)
      parent.appendChild(ret);
  }
  if (!--diffLevel) {
    hydrating = false;
  }
  return ret;
}
function idiff(dom, vnode, component, updateSelf) {
  if (dom && vnode && dom.props) {
    dom.props.children = vnode.children;
  }
  let out = dom, prevSvgMode = isSvgMode;
  if (vnode == null || typeof vnode === "boolean")
    vnode = "";
  if (typeof vnode === "string" || typeof vnode === "number") {
    if (dom && dom.splitText !== void 0 && dom.parentNode && (!dom._component || component)) {
      if (dom.nodeValue != vnode) {
        dom.nodeValue = vnode;
      }
    } else {
      out = document.createTextNode(vnode);
      if (dom) {
        if (dom.parentNode)
          dom.parentNode.replaceChild(out, dom);
        recollectNodeTree(dom, true);
      }
    }
    out[ATTR_KEY] = true;
    vnode.setDom && vnode.setDom(out);
    return out;
  }
  let vnodeName = vnode.nodeName;
  if (typeof vnodeName === "function") {
    for (let key in options_default.mapping) {
      if (options_default.mapping[key] === vnodeName) {
        vnodeName = key;
        vnode.nodeName = key;
        break;
      }
    }
  }
  isSvgMode = vnodeName === "svg" ? true : vnodeName === "foreignObject" ? false : isSvgMode;
  vnodeName = String(vnodeName);
  if (!dom || !isNamedNode(dom, vnodeName)) {
    out = createNode(
      vnodeName,
      isSvgMode,
      vnode.attributes && vnode.attributes.is && { is: vnode.attributes.is }
    );
    if (dom) {
      while (dom.firstChild)
        out.appendChild(dom.firstChild);
      if (dom.parentNode)
        dom.parentNode.replaceChild(out, dom);
      recollectNodeTree(dom, true);
    }
  }
  let fc = out.firstChild, props = out[ATTR_KEY], vchildren = vnode.children;
  vchildren = vnode.children.map((child) => purgeVNode(child, { component }));
  if (props == null) {
    props = out[ATTR_KEY] = {};
    for (let a = out.attributes, i = a.length; i--; )
      props[a[i].name] = a[i].value;
  }
  if (!hydrating && vchildren && vchildren.length === 1 && typeof vchildren[0] === "string" && fc != null && fc.splitText !== void 0 && fc.nextSibling == null) {
    if (fc.nodeValue != vchildren[0]) {
      fc.nodeValue = vchildren[0];
    }
  } else if (vchildren && vchildren.length || fc != null) {
    if (!(out.constructor.is == "WeElement" && out.constructor.noSlot)) {
      innerDiffNode(
        out,
        vchildren,
        hydrating || props.dangerouslySetInnerHTML != null,
        component,
        updateSelf
      );
    }
  }
  diffAttributes(out, vnode.attributes, props, component, updateSelf);
  if (out.props) {
    out.props.children = vnode.children;
  }
  isSvgMode = prevSvgMode;
  vnode.setDom && vnode.setDom(out);
  return out;
}
function innerDiffNode(dom, vchildren, isHydrating, component, updateSelf) {
  let originalChildren = dom.childNodes, children = [], keyed = {}, keyedLen = 0, min = 0, len = originalChildren.length, childrenLen = 0, vlen = vchildren ? vchildren.length : 0, j, c, f, vchild, child;
  if (len !== 0) {
    for (let i = 0; i < len; i++) {
      let child2 = originalChildren[i], props = child2[ATTR_KEY], key = vlen && props ? child2._component ? child2._component.__key : props.key : null;
      if (key != null) {
        keyedLen++;
        keyed[key] = child2;
      } else if (props || (child2.splitText !== void 0 ? isHydrating ? child2.nodeValue.trim() : true : isHydrating)) {
        children[childrenLen++] = child2;
      }
    }
  }
  if (vlen !== 0) {
    for (let i = 0; i < vlen; i++) {
      vchild = vchildren[i];
      child = null;
      if (vchild) {
        let key = vchild.key;
        if (key != null) {
          if (keyedLen && keyed[key] !== void 0) {
            child = keyed[key];
            keyed[key] = void 0;
            keyedLen--;
          }
        } else if (!child && min < childrenLen) {
          for (j = min; j < childrenLen; j++) {
            if (children[j] !== void 0 && isSameNodeType(c = children[j], vchild, isHydrating)) {
              child = c;
              children[j] = void 0;
              if (j === childrenLen - 1)
                childrenLen--;
              if (j === min)
                min++;
              break;
            }
          }
        }
      }
      child = idiff(child, vchild, component, updateSelf);
      f = originalChildren[i];
      if (child && child !== dom && child !== f) {
        if (f == null) {
          dom.appendChild(child);
        } else if (child === f.nextSibling) {
          removeNode(f);
        } else {
          dom.insertBefore(child, f);
        }
      }
    }
  }
  if (keyedLen) {
    for (let i in keyed)
      if (keyed[i] !== void 0)
        recollectNodeTree(keyed[i], false);
  }
  while (min <= childrenLen) {
    if ((child = children[childrenLen--]) !== void 0)
      recollectNodeTree(child, false);
  }
}
function recollectNodeTree(node, unmountOnly) {
  if (node[ATTR_KEY] != null && node[ATTR_KEY].ref) {
    if (typeof node[ATTR_KEY].ref === "function") {
      node[ATTR_KEY].ref(null);
    } else if (node[ATTR_KEY].ref.current) {
      node[ATTR_KEY].ref.current = null;
    }
  }
  if (unmountOnly === false || node[ATTR_KEY] == null) {
    removeNode(node);
  }
  removeChildren(node);
}
function removeChildren(node) {
  node = node.lastChild;
  while (node) {
    let next = node.previousSibling;
    recollectNodeTree(node, true);
    node = next;
  }
}
function diffAttributes(dom, attrs, old, component, updateSelf) {
  let name;
  let isWeElement = dom.update;
  let oldClone;
  if (dom.receiveProps) {
    oldClone = Object.assign({}, old);
  }
  for (name in old) {
    if (!(attrs && attrs[name] != null) && old[name] != null) {
      setAccessor(
        dom,
        name,
        old[name],
        old[name] = void 0,
        isSvgMode,
        component
      );
      if (isWeElement) {
        delete dom.props[name];
      }
    }
  }
  for (name in attrs) {
    if (isWeElement && typeof attrs[name] === "object" && name !== "ref") {
      if (name === "style") {
        setAccessor(
          dom,
          name,
          old[name],
          old[name] = attrs[name],
          isSvgMode,
          component
        );
      }
      let ccName = camelCase(name);
      dom.props[ccName] = old[ccName] = attrs[name];
    } else if (name !== "children" && (!(name in old) || attrs[name] !== (name === "value" || name === "checked" ? dom[name] : old[name]))) {
      setAccessor(dom, name, old[name], attrs[name], isSvgMode, component);
      if (dom.nodeName.indexOf("-") !== -1) {
        dom.props = dom.props || {};
        let ccName = camelCase(name);
        dom.props[ccName] = old[ccName] = attrs[name];
      } else {
        old[name] = attrs[name];
      }
    }
  }
  if (isWeElement && !updateSelf && dom.parentNode && dom.receiveProps) {
    if (dom.receiveProps(dom.props, oldClone) !== false) {
      dom.update();
    }
  }
}

// node_modules/omi/src/we-element.js
var id = 0;
var adoptedStyleSheetsMap = /* @__PURE__ */ new Map();
var WeElement = class extends HTMLElement {
  constructor() {
    super();
    this.props = Object.assign({}, this.constructor.defaultProps, this.props);
    this.elementId = id++;
    this.computed = {};
    this.isInstalled = false;
  }
  connectedCallback() {
    let p = this.parentNode;
    while (p && !this.store) {
      this.store = p.store;
      p = p.parentNode || p.host;
    }
    if (this.inject) {
      this.injection = {};
      p = this.parentNode;
      let provide;
      while (p && !provide) {
        provide = p.provide;
        p = p.parentNode || p.host;
      }
      if (provide) {
        this.inject.forEach((injectKey) => {
          this.injection[injectKey] = provide[injectKey];
        });
      } else {
        throw "The provide prop was not found on the parent node or the provide type is incorrect.";
      }
    }
    this.attrsToProps();
    this.beforeInstall();
    this.install();
    this.afterInstall();
    let shadowRoot;
    if (this.constructor.isLightDom) {
      shadowRoot = this;
    } else {
      if (!this.shadowRoot) {
        shadowRoot = this.attachShadow({
          mode: "open"
        });
      } else {
        shadowRoot = this.shadowRoot;
        let fc;
        while (fc = shadowRoot.firstChild) {
          shadowRoot.removeChild(fc);
        }
      }
    }
    if (adoptedStyleSheetsMap.has(this.constructor.css)) {
      shadowRoot.adoptedStyleSheets = adoptedStyleSheetsMap.get(
        this.constructor.css
      );
    } else {
      const css = this.constructor.css;
      if (css) {
        if (typeof css === "string") {
          const styleSheet = new CSSStyleSheet();
          styleSheet.replaceSync(css);
          shadowRoot.adoptedStyleSheets = [styleSheet];
        } else if (Object.prototype.toString.call(css) === "[object Array]") {
          const styleSheets = [];
          css.forEach((styleSheet) => {
            if (typeof styleSheet === "string") {
              const adoptedStyleSheet = new CSSStyleSheet();
              adoptedStyleSheet.replaceSync(styleSheet);
              styleSheets.push(adoptedStyleSheet);
            } else {
              styleSheets.push(styleSheet);
            }
            shadowRoot.adoptedStyleSheets = styleSheets;
          });
        } else if (css.default && typeof css.default === "string") {
          const styleSheet = new CSSStyleSheet();
          styleSheet.replaceSync(css.default);
          shadowRoot.adoptedStyleSheets = [styleSheet];
        } else {
          shadowRoot.adoptedStyleSheets = [css];
        }
        adoptedStyleSheetsMap.set(
          this.constructor.css,
          shadowRoot.adoptedStyleSheets
        );
      }
    }
    this.beforeRender();
    options_default.afterInstall && options_default.afterInstall(this);
    const rendered = this.render(this.props, this.store);
    this.rootNode = diff(null, rendered, null, this);
    this.rendered();
    if (this.css) {
      shadowRoot.appendChild(
        cssToDom(typeof this.css === "function" ? this.css() : this.css)
      );
    }
    if (this.props.css) {
      this._customStyleElement = cssToDom(this.props.css);
      this._customStyleContent = this.props.css;
      shadowRoot.appendChild(this._customStyleElement);
    }
    if (isArray(this.rootNode)) {
      this.rootNode.forEach(function(item) {
        shadowRoot.appendChild(item);
      });
    } else {
      this.rootNode && shadowRoot.appendChild(this.rootNode);
    }
    this.installed();
    this.isInstalled = true;
  }
  disconnectedCallback() {
    this.uninstall();
    this.isInstalled = false;
  }
  update(ignoreAttrs, updateSelf) {
    this._willUpdate = true;
    this.beforeUpdate();
    this.beforeRender();
    if (this._customStyleContent != this.props.css) {
      this._customStyleContent = this.props.css;
      if (this._customStyleElement) {
        this._customStyleElement.textContent = this._customStyleContent;
      } else {
        this._customStyleElement = cssToDom(this.props.css);
        this.shadowRoot.appendChild(this._customStyleElement);
      }
    }
    this.attrsToProps(ignoreAttrs);
    const rendered = this.render(this.props, this.store);
    this.rendered();
    this.rootNode = diff(
      this.rootNode,
      rendered,
      this.constructor.isLightDom ? this : this.shadowRoot,
      this,
      updateSelf
    );
    this._willUpdate = false;
    this.updated();
  }
  forceUpdate() {
    this.update(true);
  }
  updateProps(obj) {
    Object.keys(obj).forEach((key) => {
      this.props[key] = obj[key];
      if (this.prevProps) {
        this.prevProps[key] = obj[key];
      }
    });
    this.forceUpdate();
  }
  updateSelf(ignoreAttrs) {
    this.update(ignoreAttrs, true);
  }
  removeAttribute(key) {
    super.removeAttribute(key);
    this.isInstalled && this.update();
  }
  setAttribute(key, val) {
    if (val && typeof val === "object") {
      super.setAttribute(key, JSON.stringify(val));
    } else {
      super.setAttribute(key, val);
    }
    this.isInstalled && this.update();
  }
  pureRemoveAttribute(key) {
    super.removeAttribute(key);
  }
  pureSetAttribute(key, val) {
    super.setAttribute(key, val);
  }
  attrsToProps(ignoreAttrs) {
    if (ignoreAttrs || this.store && this.store.ignoreAttrs || this.props.ignoreAttrs)
      return;
    const ele = this;
    ele.props["css"] = ele.getAttribute("css");
    const attrs = this.constructor.propTypes;
    if (!attrs)
      return;
    Object.keys(attrs).forEach((key) => {
      const type = attrs[key];
      const val = ele.getAttribute(hyphenate(key));
      if (val !== null) {
        switch (type) {
          case String:
            ele.props[key] = val;
            break;
          case Number:
            ele.props[key] = Number(val);
            break;
          case Boolean:
            if (val === "false" || val === "0") {
              ele.props[key] = false;
            } else {
              ele.props[key] = true;
            }
            break;
          case Array:
          case Object:
            if (val[0] === ":") {
              ele.props[key] = getValByPath(val.substr(1), Omi.$);
            } else {
              ele.props[key] = JSON.parse(
                val.replace(/(['"])?([a-zA-Z0-9_-]+)(['"])?:([^\/])/g, '"$2":$4').replace(/'([\s\S]*?)'/g, '"$1"').replace(/,(\s*})/g, "$1")
              );
            }
            break;
        }
      } else {
        if (ele.constructor.defaultProps && ele.constructor.defaultProps.hasOwnProperty(key)) {
          ele.props[key] = ele.constructor.defaultProps[key];
        } else {
          ele.props[key] = null;
        }
      }
    });
  }
  fire(name, data) {
    const handler = this.props[`on${capitalize(name)}`];
    if (handler) {
      handler(
        new CustomEvent(name, {
          detail: data
        })
      );
    } else {
      this.dispatchEvent(
        new CustomEvent(name, {
          detail: data
        })
      );
    }
  }
  beforeInstall() {
  }
  install() {
  }
  afterInstall() {
  }
  installed() {
  }
  uninstall() {
  }
  beforeUpdate() {
  }
  updated() {
  }
  beforeRender() {
  }
  rendered() {
  }
  receiveProps() {
  }
};
__publicField(WeElement, "is", "WeElement");

// node_modules/omi/src/render.js
function render(vnode, parent, store) {
  parent = typeof parent === "string" ? document.querySelector(parent) : parent;
  if (store) {
    parent.store = store;
  }
  return diff(null, vnode, parent, false);
}

// node_modules/omi/src/define.js
var storeHelpers = ["use", "useSelf"];
function define(name, ctor, config) {
  if (customElements.get(name)) {
    return;
  }
  if (options_default.mapping[name]) {
    return;
  }
  if (ctor.is === "WeElement") {
    customElements.define(name, ctor);
    options_default.mapping[name] = ctor;
  } else {
    if (typeof config === "string") {
      config = { css: config };
    } else {
      config = config || {};
    }
    class Ele extends WeElement {
      static css = config.css;
      static propTypes = config.propTypes;
      static defaultProps = config.defaultProps;
      static isLightDom = config.isLightDom;
      compute = config.compute;
      render() {
        return ctor.call(this, this);
      }
    }
    for (let key in config) {
      if (typeof config[key] === "function") {
        Ele.prototype[key] = function() {
          return config[key].apply(this, arguments);
        };
      }
    }
    storeHelpers.forEach((func) => {
      if (config[func] && config[func] !== "function") {
        Ele.prototype[func] = function() {
          return config[func];
        };
      }
    });
    customElements.define(name, Ele);
    options_default.mapping[name] = Ele;
  }
}

// node_modules/omi/src/tag.js
function tag(name) {
  return function(target) {
    define(name, target);
  };
}

// node_modules/omi/src/clone-element.js
function cloneElement(vnode, props) {
  return h(
    vnode.nodeName,
    extend(extend({}, vnode.attributes), props),
    arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.children
  );
}

// node_modules/omi/src/get-host.js
function getHost(ele) {
  let root = ele.getRootNode();
  return root && root.host;
}

// node_modules/omi/src/rpx.js
function rpx(css) {
  return css.replace(/([1-9]\d*|0)(\.\d*)*rpx/g, (a, b) => {
    return window.innerWidth * Number(b) / 750 + "px";
  });
}

// node_modules/omi/src/class.js
var hasOwn = {}.hasOwnProperty;
function classNames() {
  var classes = [];
  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i];
    if (!arg)
      continue;
    var argType = typeof arg;
    if (argType === "string" || argType === "number") {
      classes.push(arg);
    } else if (Array.isArray(arg) && arg.length) {
      var inner = classNames.apply(null, arg);
      if (inner) {
        classes.push(inner);
      }
    } else if (argType === "object") {
      for (var key in arg) {
        if (hasOwn.call(arg, key) && arg[key]) {
          classes.push(key);
        }
      }
    }
  }
  return classes.join(" ");
}
function extractClass() {
  const [props, ...args] = Array.prototype.slice.call(arguments, 0);
  if (props.class) {
    args.unshift(props.class);
    delete props.class;
  } else if (props.className) {
    args.unshift(props.className);
    delete props.className;
  }
  if (args.length > 0) {
    return { class: classNames.apply(null, args) };
  }
}

// node_modules/omi/src/o.js
function o(obj) {
  return JSON.stringify(obj);
}

// node_modules/construct-style-sheets-polyfill/dist/adoptedStyleSheets.js
(function() {
  "use strict";
  if (typeof document === "undefined" || "adoptedStyleSheets" in document) {
    return;
  }
  var hasShadyCss = "ShadyCSS" in window && !ShadyCSS.nativeShadow;
  var bootstrapper = document.implementation.createHTMLDocument("boot");
  var closedShadowRootRegistry = /* @__PURE__ */ new WeakMap();
  var _DOMException = typeof DOMException === "object" ? Error : DOMException;
  var defineProperty = Object.defineProperty;
  var forEach = Array.prototype.forEach;
  var importPattern = /@import.+?;?$/gm;
  function rejectImports(contents) {
    var _contents = contents.replace(importPattern, "");
    if (_contents !== contents) {
      console.warn("@import rules are not allowed here. See https://github.com/WICG/construct-stylesheets/issues/119#issuecomment-588352418");
    }
    return _contents.trim();
  }
  function clearRules(sheet) {
    for (var i = 0; i < sheet.cssRules.length; i++) {
      sheet.deleteRule(0);
    }
  }
  function insertAllRules(from, to) {
    forEach.call(from.cssRules, function(rule, i) {
      to.insertRule(rule.cssText, i);
    });
  }
  function isElementConnected(element) {
    return "isConnected" in element ? element.isConnected : document.contains(element);
  }
  function unique(arr) {
    return arr.filter(function(value, index) {
      return arr.indexOf(value) === index;
    });
  }
  function diff2(arr1, arr2) {
    return arr1.filter(function(value) {
      return arr2.indexOf(value) === -1;
    });
  }
  function removeNode2(node) {
    node.parentNode.removeChild(node);
  }
  function getShadowRoot(element) {
    return element.shadowRoot || closedShadowRootRegistry.get(element);
  }
  var cssStyleSheetMethods = [
    "addImport",
    "addPageRule",
    "addRule",
    "deleteRule",
    "insertRule",
    "removeImport",
    "removeRule"
  ];
  var NonConstructedStyleSheet = CSSStyleSheet;
  var nonConstructedProto = NonConstructedStyleSheet.prototype;
  nonConstructedProto.replace = function() {
    return Promise.reject(new _DOMException("Can't call replace on non-constructed CSSStyleSheets."));
  };
  nonConstructedProto.replaceSync = function() {
    throw new _DOMException("Failed to execute 'replaceSync' on 'CSSStyleSheet': Can't call replaceSync on non-constructed CSSStyleSheets.");
  };
  function isCSSStyleSheetInstance(instance) {
    return typeof instance === "object" ? proto$2.isPrototypeOf(instance) || nonConstructedProto.isPrototypeOf(instance) : false;
  }
  function isNonConstructedStyleSheetInstance(instance) {
    return typeof instance === "object" ? nonConstructedProto.isPrototypeOf(instance) : false;
  }
  var $basicStyleSheet = /* @__PURE__ */ new WeakMap();
  var $locations = /* @__PURE__ */ new WeakMap();
  var $adoptersByLocation = /* @__PURE__ */ new WeakMap();
  function addAdopterLocation(sheet, location) {
    var adopter = document.createElement("style");
    $adoptersByLocation.get(sheet).set(location, adopter);
    $locations.get(sheet).push(location);
    return adopter;
  }
  function getAdopterByLocation(sheet, location) {
    return $adoptersByLocation.get(sheet).get(location);
  }
  function removeAdopterLocation(sheet, location) {
    $adoptersByLocation.get(sheet).delete(location);
    $locations.set(sheet, $locations.get(sheet).filter(function(_location) {
      return _location !== location;
    }));
  }
  function restyleAdopter(sheet, adopter) {
    requestAnimationFrame(function() {
      clearRules(adopter.sheet);
      insertAllRules($basicStyleSheet.get(sheet), adopter.sheet);
    });
  }
  function checkInvocationCorrectness(self2) {
    if (!$basicStyleSheet.has(self2)) {
      throw new TypeError("Illegal invocation");
    }
  }
  function ConstructedStyleSheet() {
    var self2 = this;
    var style = document.createElement("style");
    bootstrapper.body.appendChild(style);
    $basicStyleSheet.set(self2, style.sheet);
    $locations.set(self2, []);
    $adoptersByLocation.set(self2, /* @__PURE__ */ new WeakMap());
  }
  var proto$2 = ConstructedStyleSheet.prototype;
  proto$2.replace = function replace(contents) {
    try {
      this.replaceSync(contents);
      return Promise.resolve(this);
    } catch (e) {
      return Promise.reject(e);
    }
  };
  proto$2.replaceSync = function replaceSync(contents) {
    checkInvocationCorrectness(this);
    if (typeof contents === "string") {
      var self_1 = this;
      var style = $basicStyleSheet.get(self_1).ownerNode;
      style.textContent = rejectImports(contents);
      $basicStyleSheet.set(self_1, style.sheet);
      $locations.get(self_1).forEach(function(location) {
        if (location.isConnected()) {
          restyleAdopter(self_1, getAdopterByLocation(self_1, location));
        }
      });
    }
  };
  defineProperty(proto$2, "cssRules", {
    configurable: true,
    enumerable: true,
    get: function cssRules() {
      checkInvocationCorrectness(this);
      return $basicStyleSheet.get(this).cssRules;
    }
  });
  cssStyleSheetMethods.forEach(function(method) {
    proto$2[method] = function() {
      var self2 = this;
      checkInvocationCorrectness(self2);
      var args = arguments;
      var basic = $basicStyleSheet.get(self2);
      var locations2 = $locations.get(self2);
      var result = basic[method].apply(basic, args);
      locations2.forEach(function(location) {
        if (location.isConnected()) {
          var sheet = getAdopterByLocation(self2, location).sheet;
          sheet[method].apply(sheet, args);
        }
      });
      return result;
    };
  });
  defineProperty(ConstructedStyleSheet, Symbol.hasInstance, {
    configurable: true,
    value: isCSSStyleSheetInstance
  });
  var defaultObserverOptions = {
    childList: true,
    subtree: true
  };
  var locations = /* @__PURE__ */ new WeakMap();
  function getAssociatedLocation(element) {
    var location = locations.get(element);
    if (!location) {
      location = new Location(element);
      locations.set(element, location);
    }
    return location;
  }
  function attachAdoptedStyleSheetProperty(constructor) {
    defineProperty(constructor.prototype, "adoptedStyleSheets", {
      configurable: true,
      enumerable: true,
      get: function() {
        return getAssociatedLocation(this).sheets;
      },
      set: function(sheets) {
        getAssociatedLocation(this).update(sheets);
      }
    });
  }
  function traverseWebComponents(node, callback) {
    var iter = document.createNodeIterator(
      node,
      NodeFilter.SHOW_ELEMENT,
      function(foundNode) {
        return getShadowRoot(foundNode) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      },
      null,
      false
    );
    for (var next = void 0; next = iter.nextNode(); ) {
      callback(getShadowRoot(next));
    }
  }
  var $element = /* @__PURE__ */ new WeakMap();
  var $uniqueSheets = /* @__PURE__ */ new WeakMap();
  var $observer = /* @__PURE__ */ new WeakMap();
  function isExistingAdopter(self2, element) {
    return element instanceof HTMLStyleElement && $uniqueSheets.get(self2).some(function(sheet) {
      return getAdopterByLocation(sheet, self2);
    });
  }
  function getAdopterContainer(self2) {
    var element = $element.get(self2);
    return element instanceof Document ? element.body : element;
  }
  function adopt(self2) {
    var styleList = document.createDocumentFragment();
    var sheets = $uniqueSheets.get(self2);
    var observer = $observer.get(self2);
    var container = getAdopterContainer(self2);
    observer.disconnect();
    sheets.forEach(function(sheet) {
      styleList.appendChild(getAdopterByLocation(sheet, self2) || addAdopterLocation(sheet, self2));
    });
    container.insertBefore(styleList, null);
    observer.observe(container, defaultObserverOptions);
    sheets.forEach(function(sheet) {
      restyleAdopter(sheet, getAdopterByLocation(sheet, self2));
    });
  }
  function Location(element) {
    var self2 = this;
    self2.sheets = [];
    $element.set(self2, element);
    $uniqueSheets.set(self2, []);
    $observer.set(self2, new MutationObserver(function(mutations, observer) {
      if (!document) {
        observer.disconnect();
        return;
      }
      mutations.forEach(function(mutation) {
        if (!hasShadyCss) {
          forEach.call(mutation.addedNodes, function(node) {
            if (!(node instanceof Element)) {
              return;
            }
            traverseWebComponents(node, function(root) {
              getAssociatedLocation(root).connect();
            });
          });
        }
        forEach.call(mutation.removedNodes, function(node) {
          if (!(node instanceof Element)) {
            return;
          }
          if (isExistingAdopter(self2, node)) {
            adopt(self2);
          }
          if (!hasShadyCss) {
            traverseWebComponents(node, function(root) {
              getAssociatedLocation(root).disconnect();
            });
          }
        });
      });
    }));
  }
  var proto$1 = Location.prototype;
  proto$1.isConnected = function isConnected() {
    var element = $element.get(this);
    return element instanceof Document ? element.readyState !== "loading" : isElementConnected(element.host);
  };
  proto$1.connect = function connect() {
    var container = getAdopterContainer(this);
    $observer.get(this).observe(container, defaultObserverOptions);
    if ($uniqueSheets.get(this).length > 0) {
      adopt(this);
    }
    traverseWebComponents(container, function(root) {
      getAssociatedLocation(root).connect();
    });
  };
  proto$1.disconnect = function disconnect() {
    $observer.get(this).disconnect();
  };
  proto$1.update = function update(sheets) {
    var self2 = this;
    var locationType = $element.get(self2) === document ? "Document" : "ShadowRoot";
    if (!Array.isArray(sheets)) {
      throw new TypeError("Failed to set the 'adoptedStyleSheets' property on " + locationType + ": Iterator getter is not callable.");
    }
    if (!sheets.every(isCSSStyleSheetInstance)) {
      throw new TypeError("Failed to set the 'adoptedStyleSheets' property on " + locationType + ": Failed to convert value to 'CSSStyleSheet'");
    }
    if (sheets.some(isNonConstructedStyleSheetInstance)) {
      throw new TypeError("Failed to set the 'adoptedStyleSheets' property on " + locationType + ": Can't adopt non-constructed stylesheets");
    }
    self2.sheets = sheets;
    var oldUniqueSheets = $uniqueSheets.get(self2);
    var uniqueSheets = unique(sheets);
    var removedSheets = diff2(oldUniqueSheets, uniqueSheets);
    removedSheets.forEach(function(sheet) {
      removeNode2(getAdopterByLocation(sheet, self2));
      removeAdopterLocation(sheet, self2);
    });
    $uniqueSheets.set(self2, uniqueSheets);
    if (self2.isConnected() && uniqueSheets.length > 0) {
      adopt(self2);
    }
  };
  window.CSSStyleSheet = ConstructedStyleSheet;
  attachAdoptedStyleSheetProperty(Document);
  if ("ShadowRoot" in window) {
    attachAdoptedStyleSheetProperty(ShadowRoot);
    var proto = Element.prototype;
    var attach_1 = proto.attachShadow;
    proto.attachShadow = function attachShadow(init) {
      var root = attach_1.call(this, init);
      if (init.mode === "closed") {
        closedShadowRootRegistry.set(this, root);
      }
      return root;
    };
  }
  var documentLocation = getAssociatedLocation(document);
  if (documentLocation.isConnected()) {
    documentLocation.connect();
  } else {
    document.addEventListener("DOMContentLoaded", documentLocation.connect.bind(documentLocation));
  }
})();

// node_modules/omi/src/omi.js
h.f = Fragment;
function createRef() {
  return {};
}
var $ = {};
var Component = WeElement;
var defineElement = define;
var elements = options_default.mapping;
var omi = {
  tag,
  WeElement,
  Component,
  render,
  h,
  createElement: h,
  options: options_default,
  define,
  cloneElement,
  getHost,
  rpx,
  defineElement,
  classNames,
  extractClass,
  createRef,
  o,
  elements,
  $,
  extend: extend2,
  get,
  set,
  bind,
  unbind
};
options_default.root.Omi = omi;
options_default.root.omi = omi;
options_default.root.Omi.version = "6.25.8";

// src/index.js
var BINDING_HANDLERS = [];
var addBindingHandler = (handler) => {
  BINDING_HANDLERS.push(handler);
};
var updateSelect = (el, path, scope) => {
  let val = get(scope, path);
  if (val === false || val === null || val === void 0) {
    val = "";
  }
  el.value = val.toString();
};
addBindingHandler((el, path, scope) => {
  if (el.nodeName === "SELECT") {
    unbind(el, "change");
    bind(el, "change", () => {
      set(scope, path, el.value);
    });
    return updateSelect;
  }
});
var updateRadio = (el, path, scope) => {
  el.checked = get(scope, path) === el.value;
};
addBindingHandler((el, path, scope) => {
  if (el.type === "radio" && el.nodeName == "INPUT") {
    unbind(el, "change");
    bind(el, "change", () => {
      set(scope, path, el.value);
    });
    return updateRadio;
  }
});
var updateCheckbox = (el, path, scope) => {
  const tureVal = el.getAttribute("o-true-value") || true;
  let value = get(scope, path);
  if (value instanceof Array) {
    el.checked = value.includes(el.value);
  } else {
    el.checked = value === tureVal;
  }
};
addBindingHandler((el, path, scope) => {
  if (el.type === "checkbox" && el.nodeName == "INPUT") {
    const tureVal = el.getAttribute("o-true-value") || true;
    const falseVal = el.getAttribute("o-false-value") || false;
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
  el.value = get(scope, path) || "";
};
addBindingHandler((el, path, scope) => {
  if (el.nodeName == "INPUT") {
    let filter = el.getAttribute("filter");
    if (filter) {
      let reg = new RegExp(filter);
      unbind(el, "keypress");
      bind(el, "keypress", (evt) => {
        if (!reg.test(evt.key)) {
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
extend2("model", (el, path, scope) => {
  console.log("model", el, path, scope);
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

// examples/index.jsx
render(
  /* @__PURE__ */ h("fieldset", null, /* @__PURE__ */ h("legend", null, "binding test,binding location"), /* @__PURE__ */ h("input", {
    "o-model": "location.href",
    style: "width:50rem;"
  })),
  "body"
);
define(
  "app-main",
  class extends Component {
    data = {
      name: "lv-saharan",
      likes: ["tv", "music", "reading"]
    };
    get bindingScope() {
      return this.data;
    }
    showLikes = true;
    render() {
      return /* @__PURE__ */ h("fieldset", null, /* @__PURE__ */ h("legend", null, "form binding"), /* @__PURE__ */ h("ul", null, /* @__PURE__ */ h("li", null, "name:", /* @__PURE__ */ h("input", {
        "o-model": "name"
      })), this.showLikes ? /* @__PURE__ */ h("li", null, "likes:", ["tv", "game", "reading", "music", "others"].map((l) => /* @__PURE__ */ h("label", null, /* @__PURE__ */ h("input", {
        "o-model": "likes",
        type: "checkbox",
        value: l
      }), l))) : null), /* @__PURE__ */ h("button", {
        onClick: (evt) => {
          this.data.name = "sa";
          this.updateBindings();
        }
      }, "set name to sa"), /* @__PURE__ */ h("button", {
        onClick: (evt) => {
          this.showLikes = !this.showLikes;
          this.update();
        }
      }, "toggle likes"), /* @__PURE__ */ h("button", {
        onClick: (evt) => {
          alert(JSON.stringify(this.data));
        }
      }, "show data"));
    }
  }
);
render(/* @__PURE__ */ h("app-main", null), "body");
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
