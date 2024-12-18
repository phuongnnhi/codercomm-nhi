import Link from "./Link";
import Card from "./Card";
import Tab from "./Tab";

function customizeComponents(theme) {
    return {...Link(theme), ...Card(theme), ...Tab(theme)}
}

export default customizeComponents;