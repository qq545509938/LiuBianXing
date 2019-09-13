import ccclass = cc._decorator.ccclass;
import property = cc._decorator.property;

@ccclass
export default class ControlNode extends cc.Component {

    @property(cc.Node)
    control: cc.Node = null;
    @property(cc.Boolean)
    active = false;

    onEnable() {
        this.node.on("click", this.onClick, this);
    }

    onDisable() {
        this.node.off("click", this.onClick, this);
    }

    onClick() {
        if (this.control) {
            this.control.active = this.active;
        }
    }
}