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
    static css = `
    div{
      line-height: 1.5;
      margin: .6rem;
    }
    div span{
      display:inline-block;
      margin-right:.2rem;
      width:10rem;
    }
    button{
      padding:.5rem;
      margin:.3rem;
    }
    `;
    data = {
      name: "lv-saharan",
      gender: "male",
      likes: ["tv", "music", "reading"],
      get likesCount() {
        return this.likes.length;
      },

      some: {
        prop1: 123,
        prop2: true,
      },
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
          <div>
            <span>name:</span>
            <input o-model="name" style="width:50rem;" input-pattern="^\D+$"></input>
          </div>
          <div>
            <span>gender:</span>
            <input
              o-model="gender"
              type="radio"
              value="male"
              name="gender"
            ></input>
            male
            <input
              o-model="gender"
              type="radio"
              value="female"
              name="gender"
            ></input>
            female
          </div>
          <div>
            <span>likes:</span>

            {["tv", "game", "reading", "music", "others"].map((l) => (
              <label>
                <input
                  o-model="likes"
                  type="checkbox"
                  value={l}
                  onChange={(evt) => {
                    updateBindings();
                  }}
                ></input>
                {l}
              </label>
            ))}
          </div>
          <div>
            <span>likes count</span>
            <select o-model="likesCount" disabled>
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5</option>
            </select>
          </div>
          <div>
            <span>some</span>
            prop1:<input type="number" o-model="some.prop1"></input>  prop2:
            <input type="checkbox" o-model="some.prop2"></input>
            prop3:  <input type="checkbox" o-model="some.prop3" o-true-value="Y" o-false-value="N"></input>
          </div>
          <button
            onClick={(evt) => {
              this.data.name = "sa";
              this.updateBindings();
            }}
          >
            set name to sa and updateBindings
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
