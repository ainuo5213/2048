var KeyCode;
(function (KeyCode) {
    KeyCode[KeyCode["UP"] = 38] = "UP";
    KeyCode[KeyCode["DOWN"] = 40] = "DOWN";
    KeyCode[KeyCode["LEFT"] = 37] = "LEFT";
    KeyCode[KeyCode["RIGHT"] = 39] = "RIGHT";
})(KeyCode || (KeyCode = {}));
var Game = /** @class */ (function () {
    function Game() {
        this.rows = 4;
        this.cols = 4;
        this.cellWidth = 100;
        this.cellHeight = 100;
        this.gap = 20;
        this.randomNumberArr = [2, 4];
        this.score = 0;
        this.gameOverDom = document.querySelector('.gameOver');
        this.scoreDom = document.querySelector('.score');
        this.container = document.querySelector(".grid-container");
        this.initGameBoard();
        this.createOneRandomNumber();
        this.createOneRandomNumber();
        this.regEvent();
    }
    /**
     * 能否向上移动：只有不为0的才能移动，而且上面的为0或上面的与自己相同大小
     */
    Game.prototype.canMoveUp = function () {
        for (var i = 1; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                if (this.numberArr[i][j] !== 0) {
                    // 能移动的格子必须是不等于0的
                    // 并且上边的格子等于0或与自己相等，自己才可以移动
                    if (this.numberArr[i - 1][j] === 0 || this.numberArr[i - i][j] === this.numberArr[i][j]) {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    /**
     * 能否向右移动：只有不为0的才能移动，而且右边的为0或右边的与自己相同大小
     */
    Game.prototype.canMoveRight = function () {
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                if (this.numberArr[i][j] !== 0) {
                    if (this.numberArr[i][j + 1] === 0 || this.numberArr[i][j + 1] === this.numberArr[i][j]) {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    /**
     * 能否向左移动：只有不为0的才能移动，而且左边的为0或左边的与自己相同大小
     */
    Game.prototype.canMoveLeft = function () {
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                if (this.numberArr[i][j] !== 0) {
                    if (this.numberArr[i][j - 1] === 0 || this.numberArr[i][j - 1] === this.numberArr[i][j]) {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    /**
     * 能否向下移动：只有不为0的才能移动，而且下面的为0或下面的与自己相同大小
     */
    Game.prototype.canMoveDown = function () {
        for (var i = 0; i < this.rows; i++) {
            for (var j = 1; j < this.cols; j++) {
                if (this.numberArr[i][j] !== 0) {
                    if (this.numberArr[i + 1][j] === 0 || this.numberArr[i + 1][j] === this.numberArr[i][j]) {
                        return true;
                    }
                }
            }
        }
        return false;
    };
    /**
     * 向右移动
     */
    Game.prototype.moveRight = function () {
        var _this = this;
        if (!this.canMoveRight()) {
            return false;
        }
        var flag = false;
        for (var i = 0; i < this.rows; i++) {
            for (var j = this.rows - 1; j >= 0; j--) {
                if (this.numberArr[i][j] !== 0) {
                    for (var k = this.rows; k > j; k--) {
                        if (this.numberArr[i][k] === 0 && this.noVerticalBlock(k, i, j)) {
                            this.numberArr[i][k] = this.numberArr[i][j];
                            this.numberArr[i][j] = 0;
                            this.removeNumber(i, j);
                        }
                        else if (this.numberArr[i][j] === this.numberArr[i][k] && this.noVerticalBlock(k, i, j)) {
                            this.numberArr[i][k] += this.numberArr[i][j];
                            this.numberArr[i][j] = 0;
                            flag = true;
                            this.removeNumber(i, j);
                        }
                    }
                }
            }
        }
        if (flag) {
            this.getMaxScore();
        }
        setTimeout(function () { return _this.updateBoardView(); }, 0);
        return true;
    };
    /**
     * 向左移动
     */
    Game.prototype.moveLeft = function () {
        var _this = this;
        if (!this.canMoveLeft()) {
            return false;
        }
        var flag = false;
        for (var i = 0; i < this.rows; i++) {
            for (var j = 1; j < this.rows; j++) {
                if (this.numberArr[i][j] !== 0) {
                    for (var k = 0; k < j; k++) {
                        if (this.numberArr[i][k] === 0 && this.noVerticalBlock(k, i, j)) {
                            this.numberArr[i][k] = this.numberArr[i][j];
                            this.numberArr[i][j] = 0;
                            this.removeNumber(i, j);
                        }
                        else if (this.numberArr[i][j] === this.numberArr[i][k] && this.noVerticalBlock(k, i, j)) {
                            this.numberArr[i][k] += this.numberArr[i][j];
                            this.numberArr[i][j] = 0;
                            flag = true;
                            this.removeNumber(i, j);
                        }
                    }
                }
            }
        }
        if (flag) {
            this.getMaxScore();
        }
        setTimeout(function () { return _this.updateBoardView(); }, 0);
        return true;
    };
    /**
     * 向上移动
     */
    Game.prototype.moveUp = function () {
        var _this = this;
        if (!this.canMoveUp()) {
            // 能否向上移动
            return false;
        }
        var flag = false;
        // 向上移动
        for (var j = 0; j < this.cols; j++) {
            for (var i = 1; i < this.rows; i++) {
                // 只有有数字的才能移动
                if (this.numberArr[i][j] !== 0) {
                    // 向上 k 是慢慢+才变大去比较
                    for (var k = 0; k < i; k++) {
                        // 上面的为0并且中间不能有其他cell才能移动到哪里去
                        if (this.numberArr[k][j] === 0 && this.noVerticalBlock(k, i, j)) {
                            this.numberArr[k][j] = this.numberArr[i][j];
                            this.numberArr[i][j] = 0;
                            this.removeNumber(i, j);
                            // 上面不为0，中间没有阻碍（不然的话如果两边的数字相同的话就会直接越过其他的格子进行合并），
                            // 且与自己相同，那么就合并
                        }
                        else if (this.numberArr[i][j] === this.numberArr[k][j] && this.noVerticalBlock(k, i, j)) {
                            this.numberArr[k][j] += this.numberArr[i][j];
                            this.numberArr[i][j] = 0;
                            flag = true;
                            this.removeNumber(i, j);
                        }
                    }
                }
            }
        }
        if (flag) {
            this.getMaxScore();
        }
        setTimeout(function () { return _this.updateBoardView(); }, 0);
        return true;
    };
    /**
     * 向下移动
     */
    Game.prototype.moveDown = function () {
        var _this = this;
        if (!this.canMoveDown()) {
            return false;
        }
        var flag = false;
        for (var j = 0; j < this.cols; j++) {
            for (var i = this.rows - 1; i >= 0; i--) {
                // 只有有数字的才能移动
                if (this.numberArr[i][j] !== 0) {
                    for (var k = i; k > 0; k--) {
                        // 上面的为0并且中间不能有其他cell,才能移动到哪里去
                        if (this.numberArr[k][j] === 0 && this.noVerticalBlock(k, i, j)) {
                            this.numberArr[k][j] = this.numberArr[i][j];
                            this.numberArr[i][j] = 0;
                            this.removeNumber(i, j);
                            // 上面不为0，中间没有阻碍，且与自己相同，那么就合并
                        }
                        else if (this.numberArr[i][j] === this.numberArr[k][j] && this.noVerticalBlock(k, i, j)) {
                            this.numberArr[k][j] += this.numberArr[i][j];
                            this.numberArr[i][j] = 0;
                            flag = true;
                            this.removeNumber(i, j);
                        }
                    }
                }
            }
        }
        if (flag) {
            this.getMaxScore();
        }
        setTimeout(function () { return _this.updateBoardView(); }, 0);
        return true;
    };
    /**
     * 删除指定行和列dom的number
     * @param i
     * @param j
     */
    Game.prototype.removeNumber = function (i, j) {
        var dom = this.domArr[i][j];
        dom.innerHTML = '';
        dom.style.backgroundColor = '#ccc0b3';
        dom.style.color = '#000';
    };
    /**
     * 更新视图
     */
    Game.prototype.updateBoardView = function () {
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                var number = this.numberArr[i][j];
                if (number !== 0) {
                    this.showNumber(i, j, number);
                }
                else {
                }
            }
        }
    };
    /**
     * 判断竖直方向上是否有阻碍
     * @param nextRow 下一行
     * @param curRow 当前行
     * @param curCol 当前列
     */
    Game.prototype.noVerticalBlock = function (nextRow, curRow, curCol) {
        for (var i = nextRow + 1; i < curRow; i++) {
            if (this.numberArr[i][curCol] !== 0) {
                return false;
            }
        }
        return true;
    };
    /**
     * 注册事件
     */
    Game.prototype.regEvent = function () {
        var _this = this;
        document.onkeydown = function (e) {
            console.log(_this.numberArr);
            switch (e.which) {
                case KeyCode.UP:
                    if (_this.moveUp()) {
                        _this.workOutScore();
                        _this.createOneRandomNumber();
                        _this.isGameOver();
                    }
                    break;
                case KeyCode.DOWN:
                    if (_this.moveDown()) {
                        _this.workOutScore();
                        _this.createOneRandomNumber();
                        _this.isGameOver();
                    }
                    break;
                case KeyCode.RIGHT:
                    if (_this.moveRight()) {
                        _this.workOutScore();
                        _this.createOneRandomNumber();
                        _this.isGameOver();
                    }
                    break;
                case KeyCode.LEFT:
                    if (_this.moveLeft()) {
                        _this.workOutScore();
                        _this.createOneRandomNumber();
                        _this.isGameOver();
                        break;
                    }
            }
        };
    };
    Game.prototype.noSpace = function () {
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                if (this.numberArr === 0) {
                    return false;
                }
            }
        }
        return true;
    };
    Game.prototype.noMove = function () {
        return !(this.canMoveDown() || this.canMoveLeft() || this.canMoveRight() || this.canMoveUp());
    };
    Game.prototype.gameOver = function () {
        this.gameOverDom.style.display = 'block';
        this.gameOverDom.style.opacity = '1';
        this.gameOverDom.style.transition = 'all .2s ease-in-out';
    };
    Game.prototype.isGameOver = function () {
        if (this.noSpace() && this.noMove())
            this.gameOver();
    };
    /**
     * 每次移动取得当前的最大值并更新分数
     */
    Game.prototype.getMaxScore = function () {
        var max = 0;
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                if (this.numberArr[i][j] > max) {
                    max = this.numberArr[i][j];
                }
            }
        }
        this.score = max;
    };
    /**
     * 渲染分数
     */
    Game.prototype.workOutScore = function () {
        this.scoreDom.innerHTML = this.score + '';
    };
    /**
     * 是否还可以生成number
     */
    Game.prototype.canGenerateNumber = function () {
        var flag = true;
        for (var i = 0; i < this.rows; i++) {
            for (var j = 0; j < this.cols; j++) {
                if (this.numberArr[i][j] === 0) {
                    flag = true;
                    return flag;
                }
            }
        }
        return flag;
    };
    /**
     * 生成一个number并显示在页面上
     */
    Game.prototype.createOneRandomNumber = function () {
        if (!this.canGenerateNumber()) {
            return;
        }
        var randX = Math.floor(Math.random() * this.rows);
        var randY = Math.floor(Math.random() * this.cols);
        // 选到numberArr该位置为0的位置
        while (true) {
            if (this.numberArr[randX][randY] === 0) {
                break;
            }
            randX = Math.floor(Math.random() * this.rows);
            randY = Math.floor(Math.random() * this.cols);
        }
        var randIndex = Math.floor(Math.random() * 2);
        var number = this.randomNumberArr[randIndex];
        // 修改numberArr对应位置的数字
        this.numberArr[randX][randY] = number;
        // 显示number
        this.showNumber(randX, randY, number);
    };
    /**
     * 显示number
     * @param i 行
     * @param j 列
     * @param num 数字
     */
    Game.prototype.showNumber = function (i, j, num) {
        var dom = this.domArr[i][j];
        dom.style.backgroundColor = Game.getNumberBackgroundColor(num);
        dom.style.color = Game.getNumberColor(num);
        dom.innerHTML = num + '';
    };
    /**
     * 获取对应number的颜色
     * @param number 数字
     */
    Game.getNumberColor = function (number) {
        if (number <= 4) {
            return "#776e65";
        }
        return "white";
    };
    /**
     * 对应数字的背景颜色
     * @param number 数字
     */
    Game.getNumberBackgroundColor = function (number) {
        switch (number) {
            case 2:
                return "#eee4da";
            case 4:
                return "#eee4da";
            case 8:
                return "#f26179";
            case 16:
                return "#f59563";
            case 32:
                return "#f67c5f";
            case 64:
                return "#f65e36";
            case 128:
                return "#edcf72";
            case 256:
                return "#edcc61";
            case 512:
                return "#9c0";
            case 1024:
                return "#3365a5";
            case 2048:
                return "#09c";
            case 4096:
                return "#a6bc";
            case 8192:
                return "#93c";
        }
        return "black";
    };
    /**
     * 初始化数字棋盘、dom棋盘、dom
     */
    Game.prototype.initGameBoard = function () {
        this.scoreDom.innerHTML = this.score + '';
        var fragment = document.createDocumentFragment();
        this.numberArr = new Array(this.rows);
        this.domArr = new Array(this.rows);
        for (var i = 0; i < this.rows; i++) {
            this.domArr[i] = new Array(this.cols);
            this.numberArr[i] = new Array(this.cols);
            this.numberArr[i].fill(0);
            for (var j = 0; j < this.cols; j++) {
                var gridCell = document.createElement('div');
                gridCell.className = 'grid-cell';
                gridCell.classList.add("grid-cell-" + i + "-" + j);
                gridCell.style.top = this.getTop(i) + 'px';
                gridCell.style.left = this.getLeft(j) + 'px';
                this.domArr[i][j] = gridCell;
                fragment.append(gridCell);
            }
        }
        this.container.append(fragment);
    };
    /**
     * 获得block距离上边的距离
     * @param row
     */
    Game.prototype.getTop = function (row) {
        return this.gap + row * (this.cellHeight + this.gap);
    };
    /**
     * 获得block距离左边的距离
     * @param col
     */
    Game.prototype.getLeft = function (col) {
        // 因为padding-left是20，所以这里要加上gap，每个block之间的gap也为20
        return this.gap + col * (this.cellWidth + this.gap);
    };
    return Game;
}());
new Game();
