enum KeyCode {
    "UP" = 38,
    "DOWN" = 40,
    "LEFT" = 37,
    "RIGHT" = 39
}

class Game {
    private numberArr: any;
    private readonly rows: number = 4;
    private readonly cols: number = 4;
    private readonly cellWidth: number = 100;
    private readonly cellHeight: number = 100;
    private readonly gap: number = 20;
    private domArr: any;
    private randomNumberArr: number[] = [2, 4];
    private score: number = 0;
    private readonly gameOverDom: HTMLDivElement = document.querySelector('.gameOver');
    private readonly scoreDom: HTMLSpanElement = document.querySelector('.score');
    private readonly container: HTMLDivElement = document.querySelector(".grid-container");

    constructor() {
        this.initGameBoard();
        this.createOneRandomNumber();
        this.createOneRandomNumber();
        this.regEvent();
    }

    /**
     * 能否向上移动：只有不为0的才能移动，而且上面的为0或上面的与自己相同大小
     */
    private canMoveUp(): boolean {
        for (let i = 1; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.numberArr[i][j] !== 0) {
                    // 能移动的格子必须是不等于0的
                    // 并且上边的格子等于0或与自己相等，自己才可以移动
                    if (this.numberArr[i - 1][j] === 0 || this.numberArr[i - i][j] === this.numberArr[i][j]) {
                        return true
                    }
                }
            }
        }
        return false
    }
    /**
     * 能否向右移动：只有不为0的才能移动，而且右边的为0或右边的与自己相同大小
     */
    private canMoveRight() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.numberArr[i][j] !== 0) {
                    if (this.numberArr[i][j + 1] === 0 || this.numberArr[i][j + 1] === this.numberArr[i][j]) {
                        return true
                    }
                }
            }
        }
        return false
    }
    /**
     * 能否向左移动：只有不为0的才能移动，而且左边的为0或左边的与自己相同大小
     */
    private canMoveLeft() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.numberArr[i][j] !== 0) {
                    if (this.numberArr[i][j - 1] === 0 || this.numberArr[i][j - 1] === this.numberArr[i][j]) {
                        return true
                    }
                }
            }
        }
        return false
    }
    /**
     * 能否向下移动：只有不为0的才能移动，而且下面的为0或下面的与自己相同大小
     */
    private canMoveDown() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 1; j < this.cols; j++) {
                if (this.numberArr[i][j] !== 0) {
                    if (this.numberArr[i + 1][j] === 0 || this.numberArr[i + 1][j] === this.numberArr[i][j]) {
                        return true
                    }
                }
            }
        }
        return false
    }

    /**
     * 向右移动
     */
    private moveRight() {
        if (!this.canMoveRight()) {
            return false
        }
        let flag: boolean = false;
        for (let i = 0; i < this.rows; i++) {
            for (let j = this.rows - 1; j >= 0; j--) {
                if (this.numberArr[i][j] !== 0) {
                    for (let k = this.rows; k > j; k--) {
                        if (this.numberArr[i][k] === 0 && this.noVerticalBlock(k, i, j)) {
                            this.numberArr[i][k] = this.numberArr[i][j];
                            this.numberArr[i][j] = 0;
                            this.removeNumber(i, j)
                        } else if (this.numberArr[i][j] === this.numberArr[i][k] && this.noVerticalBlock(k, i, j)) {
                            this.numberArr[i][k] += this.numberArr[i][j];
                            this.numberArr[i][j] = 0;
                            flag = true;
                            this.removeNumber(i, j)
                        }
                    }
                }
            }
        }
        if (flag) {
            this.getMaxScore();
        }
        setTimeout(() => this.updateBoardView(), 0);
        return true
    }

    /**
     * 向左移动
     */
    private moveLeft() {
        if (!this.canMoveLeft()) {
            return false
        }
        let flag: boolean = false;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 1; j < this.rows; j++) {
                if (this.numberArr[i][j] !== 0) {
                    for (let k = 0; k < j; k++) {
                        if (this.numberArr[i][k] === 0 && this.noVerticalBlock(k, i, j)) {
                            this.numberArr[i][k] = this.numberArr[i][j];
                            this.numberArr[i][j] = 0;
                            this.removeNumber(i, j)
                        } else if (this.numberArr[i][j] === this.numberArr[i][k] && this.noVerticalBlock(k, i, j)) {
                            this.numberArr[i][k] += this.numberArr[i][j];
                            this.numberArr[i][j] = 0;
                            flag = true;
                            this.removeNumber(i, j)
                        }
                    }
                }
            }
        }
        if (flag) {
            this.getMaxScore();
        }
        setTimeout(() => this.updateBoardView(), 0);
        return true
    }

    /**
     * 向上移动
     */
    private moveUp(): boolean {
        if (!this.canMoveUp()) {
            // 能否向上移动
            return false
        }
        let flag: boolean = false;
        // 向上移动
        for (let j = 0; j < this.cols; j++) {
            for (let i = 1; i < this.rows; i++) {
                // 只有有数字的才能移动
                if (this.numberArr[i][j] !== 0) {
                    // 向上 k 是慢慢+才变大去比较
                    for (let k = 0; k < i; k++) {
                        // 上面的为0并且中间不能有其他cell才能移动到哪里去
                        if (this.numberArr[k][j] === 0 && this.noVerticalBlock(k, i, j)) {
                            this.numberArr[k][j] = this.numberArr[i][j];
                            this.numberArr[i][j] = 0;
                            this.removeNumber(i, j)
                            // 上面不为0，中间没有阻碍（不然的话如果两边的数字相同的话就会直接越过其他的格子进行合并），
                            // 且与自己相同，那么就合并
                        } else if (this.numberArr[i][j] === this.numberArr[k][j] && this.noVerticalBlock(k, i, j)) {
                            this.numberArr[k][j] += this.numberArr[i][j];
                            this.numberArr[i][j] = 0;
                            flag = true;
                            this.removeNumber(i, j)
                        }
                    }
                }
            }
        }
        if (flag) {
            this.getMaxScore();
        }
        setTimeout(() => this.updateBoardView(), 0);
        return true
    }

    /**
     * 向下移动
     */
    private moveDown() {
        if (!this.canMoveDown()) {
            return false
        }
        let flag: boolean = false;
        for (let j = 0; j < this.cols; j++) {
            for (let i = this.rows - 1; i >= 0; i--) {
                // 只有有数字的才能移动
                if (this.numberArr[i][j] !== 0) {
                    for (let k = i; k > 0; k--) {
                        // 上面的为0并且中间不能有其他cell,才能移动到哪里去
                        if (this.numberArr[k][j] === 0 && this.noVerticalBlock(k, i, j)) {
                            this.numberArr[k][j] = this.numberArr[i][j];
                            this.numberArr[i][j] = 0;
                            this.removeNumber(i, j)
                            // 上面不为0，中间没有阻碍，且与自己相同，那么就合并
                        } else if (this.numberArr[i][j] === this.numberArr[k][j] && this.noVerticalBlock(k, i, j)) {
                            this.numberArr[k][j] += this.numberArr[i][j];
                            this.numberArr[i][j] = 0;
                            flag = true;
                            this.removeNumber(i, j)
                        }
                    }
                }
            }
        }
        if (flag) {
            this.getMaxScore();
        }
        setTimeout(() => this.updateBoardView(), 0);
        return true
    }

    /**
     * 删除指定行和列dom的number
     * @param i
     * @param j
     */
    private removeNumber(i: number, j: number) {
        let dom: HTMLDivElement = this.domArr[i][j];
        dom.innerHTML = '';
        dom.style.backgroundColor = '#ccc0b3';
        dom.style.color = '#000'
    }

    /**
     * 更新视图
     */
    private updateBoardView() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                let number: number = this.numberArr[i][j];
                if (number !== 0) {
                    this.showNumber(i, j, number)
                } else {

                }
            }
        }
    }

    /**
     * 判断竖直方向上是否有阻碍
     * @param nextRow 下一行
     * @param curRow 当前行
     * @param curCol 当前列
     */
    private noVerticalBlock(nextRow: number, curRow: number, curCol: number) {
        for (let i = nextRow + 1; i < curRow; i++) {
            if (this.numberArr[i][curCol] !== 0) {
                return false
            }
        }
        return true
    }

    /**
     * 注册事件
     */
    private regEvent() {
        document.onkeydown = (e: KeyboardEvent) => {
            console.log(this.numberArr);
            switch (e.which) {
                case KeyCode.UP:
                    if (this.moveUp()) {
                        this.workOutScore();
                        this.createOneRandomNumber();
                        this.isGameOver();
                    }
                    break;
                case KeyCode.DOWN:
                    if (this.moveDown()) {
                        this.workOutScore();
                        this.createOneRandomNumber();
                        this.isGameOver();
                    }
                    break;
                case KeyCode.RIGHT:
                    if (this.moveRight()) {
                        this.workOutScore();
                        this.createOneRandomNumber();
                        this.isGameOver();
                    }
                    break;
                case KeyCode.LEFT:
                    if (this.moveLeft()) {
                        this.workOutScore();
                        this.createOneRandomNumber();
                        this.isGameOver();
                        break;
                    }
            }
        }
    }

    private noSpace(): boolean{
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.numberArr === 0) {
                    return false
                }
            }
        }
        return true
    }

    private noMove(): boolean{
        return !(this.canMoveDown() || this.canMoveLeft() || this.canMoveRight() || this.canMoveUp());

    }

    private gameOver(){
        this.gameOverDom.style.display = 'block';
        this.gameOverDom.style.opacity = '1';
        this.gameOverDom.style.transition = 'all .2s ease-in-out'
    }

    private isGameOver(){
        if(this.noSpace() && this.noMove())
            this.gameOver();
    }

    /**
     * 每次移动取得当前的最大值并更新分数
     */
    private getMaxScore() {
        let max: number = 0;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.numberArr[i][j] > max) {
                    max = this.numberArr[i][j]
                }
            }
        }
        this.score = max;
    }

    /**
     * 渲染分数
     */
    private workOutScore() {
        this.scoreDom.innerHTML = this.score + '';
    }

    /**
     * 是否还可以生成number
     */
    private canGenerateNumber(): boolean {
        let flag: boolean = true;
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                if (this.numberArr[i][j] === 0) {
                    flag = true;
                    return flag
                }
            }
        }
        return flag
    }

    /**
     * 生成一个number并显示在页面上
     */
    private createOneRandomNumber(): void {
        if (!this.canGenerateNumber()) {
            return
        }
        let randX: number = Math.floor(Math.random() * this.rows);
        let randY: number = Math.floor(Math.random() * this.cols);
        // 选到numberArr该位置为0的位置
        while (true) {
            if (this.numberArr[randX][randY] === 0) {
                break;
            }
            randX = Math.floor(Math.random() * this.rows);
            randY = Math.floor(Math.random() * this.cols);
        }
        let randIndex: number = Math.floor(Math.random() * 2);
        let number: number = this.randomNumberArr[randIndex];
        // 修改numberArr对应位置的数字
        this.numberArr[randX][randY] = number;
        // 显示number
        this.showNumber(randX, randY, number)
    }

    /**
     * 显示number
     * @param i 行
     * @param j 列
     * @param num 数字
     */
    private showNumber(i: number, j: number, num: number): void {
        let dom: HTMLDivElement = this.domArr[i][j];
        dom.style.backgroundColor = Game.getNumberBackgroundColor(num);
        dom.style.color = Game.getNumberColor(num);
        dom.innerHTML = num + '';
    }

    /**
     * 获取对应number的颜色
     * @param number 数字
     */
    private static getNumberColor(number: number) {
        if (number <= 4) {
            return "#776e65";
        }
        return "white";
    }

    /**
     * 对应数字的背景颜色
     * @param number 数字
     */
    private static getNumberBackgroundColor(number: number) {
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
    }

    /**
     * 初始化数字棋盘、dom棋盘、dom
     */
    private initGameBoard() {
        this.scoreDom.innerHTML = this.score + '';
        let fragment: DocumentFragment = document.createDocumentFragment();
        this.numberArr = new Array(this.rows);
        this.domArr = new Array(this.rows);
        for (let i = 0; i < this.rows; i++) {
            this.domArr[i] = new Array(this.cols);
            this.numberArr[i] = new Array(this.cols);
            this.numberArr[i].fill(0);
            for (let j = 0; j < this.cols; j++) {
                let gridCell: HTMLDivElement = document.createElement('div');
                gridCell.className = 'grid-cell';
                gridCell.classList.add(`grid-cell-${i}-${j}`);
                gridCell.style.top = this.getTop(i) + 'px';
                gridCell.style.left = this.getLeft(j) + 'px';
                this.domArr[i][j] = gridCell;
                fragment.append(gridCell)
            }
        }
        this.container.append(fragment)
    }

    /**
     * 获得block距离上边的距离
     * @param row
     */
    private getTop(row: number): number {
        return this.gap + row * (this.cellHeight + this.gap)
    }

    /**
     * 获得block距离左边的距离
     * @param col
     */
    private getLeft(col: number): number {
        // 因为padding-left是20，所以这里要加上gap，每个block之间的gap也为20
        return this.gap + col * (this.cellWidth + this.gap)
    }
}

new Game();
