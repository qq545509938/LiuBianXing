import ccclass = cc._decorator.ccclass;
import property = cc._decorator.property;
import Board from "./Board";
import {Tiles} from "./Config";

const getRandomInt = function (min, max) {
    let ratio = Math.random();
    return min + Math.floor((max - min) * ratio);
};
@ccclass
export default class Shape extends cc.Component {

    @property(cc.Integer)
    tileH = 122; // 方块六边形高度
    @property(cc.Float)
    tileScale = 0.7; // 方块默认缩放值，用于点击后放大效果
    @property(Board)
    board: Board = null;// 获取棋盘节点访问

    // 以下为各方块类型图片
    @property(cc.SpriteFrame)
    type1: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    type2: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    type3: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    type4: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    type5: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    type6: cc.SpriteFrame = null;

    boardTiles: cc.Node[];
    fillTiles: cc.Node[];

    // LIFE-CYCLE CALLBACKS:

    start() {
        this.setTile();
        this.addTouchEvent();
    }

    setTile() {
        const hexData = this.random();

        let hexPx = hexData.list.map(hexArr => {
            return this.hex2pixel(hexArr, this.tileH);
        });

        this.setSpriteFrame(hexPx, this[`type${hexData.type}`]);
        this.node.scale = this.tileScale;
        this.node.ox = this.node.x;
        this.node.oy = this.node.y;
    }

    random() {
        const shape = Tiles[getRandomInt(0, Tiles.length)];
        const list = shape.list[getRandomInt(0, shape.list.length)];
        return {
            type: shape.type,
            list: list
        };
    }

    hex2pixel(hexArr, h) {
        let size = h / 2;
        let x = size * Math.sqrt(3) * (hexArr[0] + hexArr[1] / 2);
        let y = ((size * 3) / 2) * hexArr[1];
        return cc.v2(x, y);
    }

    setSpriteFrame(hexes, tilePic) {
        for (let index = 0; index < hexes.length; index++) {
            let node = new cc.Node('frame');
            let sprite = node.addComponent(cc.Sprite);
            sprite.spriteFrame = tilePic;
            node.x = hexes[index].x;
            node.y = hexes[index].y;
            node.parent = this.node;
        }
    }

    addTouchEvent() {
        this.node.on('touchstart', event => {
            this.node.children.forEach(child => {
                child.setScale(this.tileScale);
            });
            this.boardTiles = [];
            this.fillTiles = [];
        });
        this.node.on('touchmove', event => {
            const {x, y} = event.touch.getDelta();

            this.node.x += x;
            this.node.y += y;
            // 方块与棋盘的触碰检测，并返回重合的部分。
            this.checkCollision(event);

            if (this.checkCanDrop()) {
                this.dropPrompt(true);
            } else {
                this.dropPrompt(false);
            }
        });
        this.node.on('touchend', () => {
            this.tileDrop();
        });
        this.node.on('touchcancel', () => {
            this.tileDrop();
        });
    }

    tileDrop() {
        this.resetBoardFrames();
        if (this.checkCanDrop()) {
            const boardTiles = this.boardTiles;
            const fillTiles = this.fillTiles;
            const fillTilesLength = fillTiles.length;

            for (let i = 0; i < fillTilesLength; i++) {
                const boardTile = boardTiles[i];
                const fillTile = fillTiles[i];
                const fillNode = boardTile.getChildByName('fillNode');
                const spriteFrame = fillTile.getComponent(cc.Sprite).spriteFrame;

                // 棋盘存在方块的标识设置
                boardTile.isFulled = true;
                fillNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
                // 落子成功后重置方块
                this.resetTile();
            }

            // 这里棋盘需要访问当前方块的六边形总数
            this.board.curTileLength = fillTiles.length;
            // 触发落入成功的事件
            this.board.node.emit('dropSuccess');
        } else {
            this.backSourcePos();
        }
        this.board.checkLose();
    }

    checkLose() {
        let canDropCount = 0;
        const tiles = this.node.children;
        const tilesLength = tiles.length;
        const boardFrameList = this.board.boardFrameList;
        const boardFrameListLength = boardFrameList.length;

        // TODO: 存在无效检测的情况，可优化
        for (let i = 0; i < boardFrameListLength; i++) {
            const boardNode = boardFrameList[i];
            let srcPos = cc.v2(boardNode.x, boardNode.y);
            let count = 0;
            if (!boardNode.isFulled) {
                // 过滤出未填充的棋盘格子
                for (let j = 0; j < tilesLength; j++) {
                    let len = 27; // 设定重合判定最小间距

                    // 将方块移到未填充的棋盘格子原点，并获取当前各方块坐标值
                    let tilePos = srcPos.add(cc.v2(tiles[j].x, tiles[j].y));

                    // 遍历棋盘格子，判断方块中各六边形是否可以放入
                    for (let k = 0; k < boardFrameListLength; k++) {
                        const boardNode = boardFrameList[k];
                        let dis = cc.v2(boardNode.x, boardNode.y).sub(tilePos).mag();
                        if (dis <= len && !boardNode.isFulled) {
                            count++;
                        }
                    }
                }

                if (count === tilesLength) {
                    canDropCount++;
                }
            }
        }

        if (canDropCount === 0) {
            return true;
        } else {
            return false;
        }
    }

    resetTile() {
        this.node.removeAllChildren();
        this.node.x = this.node.ox;
        this.node.y = this.node.oy;
        this.setTile();
    }

    backSourcePos() {
        this.node.scale = this.tileScale;
        this.node.x = this.node.ox;
        this.node.y = this.node.oy;
        this.node.children.forEach(child => {
            child.setScale(1);
        });
    }

    checkCollision(event) {
        const tiles = this.node.children;
        this.boardTiles = []; // 保存棋盘与方块重合部分。
        this.fillTiles = []; // 保存方块当前重合的部分。
        for (let i = 0; i < tiles.length; i++) {
            const tile = tiles[i];
            const pos = this.node.position.add(tile.position);
            const boardTile = this.checkDistance(pos);
            if (boardTile && this.boardTiles.indexOf(boardTile) < 0) {
                this.fillTiles.push(tile);
                this.boardTiles.push(boardTile);
            }
        }
    }

    checkDistance(pos) {
        const distance = this.tileH / 2;
        const boardFrameList = this.board.boardFrameList;
        for (let i = 0; i < boardFrameList.length; i++) {
            const frameNode = boardFrameList[i];
            const nodeDistance = frameNode.position.sub(pos).mag();
            if (nodeDistance <= distance) {
                return frameNode;
            }
        }
    }

    checkCanDrop() {
        const boardTiles = this.boardTiles; // 当前棋盘与方块重合部分。
        const fillTiles = this.node.children; // 当前拖拽的方块总数。
        const boardTilesLength = boardTiles.length;
        const fillTilesLength = fillTiles.length;

        // 如果当前棋盘与方块重合部分为零以及与方块数目不一致，则判定为不能落子。
        if (boardTilesLength === 0 || boardTilesLength != fillTilesLength) {
            return false;
        }

        // 如果方块内以及存在方块，则判定为不能落子。
        for (let i = 0; i < boardTilesLength; i++) {
            if (boardTiles[i].isFulled) {
                return false;
            }
        }

        return true;
    }

    resetBoardFrames() {
        const boardFrameList = this.board.boardFrameList;

        for (let i = 0; i < boardFrameList.length; i++) {
            const shadowNode = boardFrameList[i].getChildByName('shadowNode');
            shadowNode.opacity = 0;
        }
    }

    dropPrompt(canDrop) {
        const boardTiles = this.boardTiles;
        const boardTilesLength = boardTiles.length;
        const fillTiles = this.fillTiles;

        this.resetBoardFrames();
        if (canDrop) {
            for (let i = 0; i < boardTilesLength; i++) {
                const shadowNode = boardTiles[i].getChildByName('shadowNode');
                shadowNode.opacity = 100;
                const spriteFrame = fillTiles[i].getComponent(cc.Sprite).spriteFrame;
                shadowNode.getComponent(cc.Sprite).spriteFrame = spriteFrame;
            }
        }
    }

    // update (dt) {},
}
