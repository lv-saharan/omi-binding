# omi-binding
a omi binding module

## install
```bash
npm i omi-binding
```

## usage

```jsx
import 'omi-binding'
//binding to window
<input o-model="location.href" style="width:50rem;"></input>
```

```jsx
import { render, h, define, Component } from "omi/src/omi";
import "omi-binding";

define(
  "app-main",
  class extends Component {
    data = {
      name: "lv-saharan",
      likes: ["tv", "music", "reading"],
    };
    //指定绑定的范围
    //不指定时绑定范围是当前组件
    //可以通过updateBindings更新绑定
    get bindingScope() {
      return this.data;
    }
    showLikes = true;
    render() {
      return (
        <fieldset>
          <legend>form binding</legend>
          <ul>
            <li>
              name:
              <input o-model="name" />
            </li>
            {this.showLikes ? (
              <li>
                likes:
                {["tv", "game", "reading", "music", "others"].map((l) => (
                  <label>
                    <input o-model="likes" type="checkbox" value={l}></input>
                    {l}
                  </label>
                ))}
              </li>
            ) : null}
          </ul>
          <button
            onClick={(evt) => {
              this.data.name = "sa";
              this.updateBindings();
            }}
          >
            set name to sa
          </button>
          <button
            onClick={(evt) => {
              this.showLikes = !this.showLikes;
              this.update();
            }}
          >
            toggle likes
          </button>
          <button
            onClick={(evt) => {
              alert(JSON.stringify(this.data));
            }}
          >
            show data
          </button>
        </fieldset>
      );
    }
  }
);
render(<app-main />, "body");

```
## use esbuild to run the examples

not just use esbuild and live server | nginx ....
```bash
npm start
```
and then use live server to view examples/index.html

//esbuild.js
```js
let [mode] = process.argv.splice(2);
const examples = "./examples"

let options = {
    jsxFactory: 'h',
    jsxFragment: 'h.f',
    entryPoints: [`${examples}/index.jsx`],
    outdir: examples,
    format: "esm",
    bundle: true,
    sourcemap: true
}
const esbuild = require('esbuild')

esbuild.build({
    ...options,
    watch: {
        onRebuild(error, result) {
            if (error) console.error('watch build failed:', error)
            else console.log('watch build succeeded:', result)
        },
    }
})
```
esbuild + nginx 可能是目前最简洁，高效的开发模式

