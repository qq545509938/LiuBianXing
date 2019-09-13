import ccclass = cc._decorator.ccclass;
import property = cc._decorator.property;

@ccclass
export default class Alert extends cc.Component {
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    @property(cc.Label)
    curScore: cc.Label = null;
    @property(cc.Label)
    bestScore: cc.Label = null;

    onEnable() {
        if(this.curScore){
            this.curScore.string =  cc.sys.localStorage.getItem('lastScore') || 0;
        }
        if(this.bestScore){
            this.bestScore.string =  cc.sys.localStorage.getItem('bestScore') || 0;
        }
    }

    enterCB() {
        cc.director.loadScene('Game');
    }

    returnMain() {
        cc.director.loadScene('Main');
    }

    toggleSound() {
        let openSound = parseInt(cc.sys.localStorage.getItem('openSound') || 1);
        openSound = 1 - openSound;
        cc.sys.localStorage.setItem('openSound', openSound.toString());
    }

    // update (dt) {},
}
