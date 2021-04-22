import App from "App";
import { render } from "preact";
import "preact/debug";
import "styles/style.scss";

const el = document.createElement("div");
document.body.appendChild(el);
render(<App />, el);
