import { render, h, define, Component } from "omi/src/omi";
import "../src/index.js";

render(
  <fieldset>
    <legend>binding location</legend>
    <input o-model="location.href" style="width:50rem;"></input>
  </fieldset>,
  "body"
);

define(
  "app-main",
  class extends Component {
    data = {
      name: "lv-saharan",
      likes: ["tv", "music", "reading"],
    };
    //指定绑定的范围
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
