'use strict';

var React = require('react/addons');
//var ReactTransitionGroup = React.addons.TransitionGroup;

// CSS
require('normalize.css');
require('../../styles/main.scss');

//获取图片相关的数组
var imageDatas = require("../../data/imageDatas.json");

//var imageURL = require('../../images/yeoman.png');
//利用自执行函数，将图片名信息转成图片URL路径信息
imageDatas = (function genImageUrl(imageDataArr) {
	for (var i = 0, j = imageDataArr.length; i < j; i++) {
		var singleImageData = imageDataArr[i];
		singleImageData.imageURL = require("../../images/" + singleImageData.fileName);

		imageDataArr[i] = singleImageData;
	}

	return imageDataArr;
})(imageDatas);

/*
 *	获取区间内的一个随机数
 */
function getRangeRandom(low, high) {

	return Math.ceil(Math.random() * (high - low) + low);
};

var ImgFigure = React.createClass({
	
	render: function() {

		var styleObj = {};

		//如果props属性中指定了这张图片的位置，则使用
		if (this.props.arrange.pos) {
			styleObj = this.props.arrange.pos;
		}

		return (
			<figure className="img-figure" style={styleObj}>
				<img src={this.props.data.imageURL} alt={this.props.data.title} />
				<figcaption>
					<h2 className="img-title">{this.props.data.title}</h2>
				</figcaption>
			</figure>
		);
	}
});

var ReactSelf1App = React.createClass({
	
	Constant: {
		centerPos: {
			left: 0,
			right: 0
		},
		hPosRange: {	//水平方向取值范围
			leftSecX: [0,0],
			rightSecX: [0,0],
			y: [0,0]
		},
		vPosRange: {	//垂直方向取值范围
			x: [0,0],
			topY: [0,0]
		}
	},

	//重新布局所有图片  @centerIndex 指定居中图片
	rearrange: function(centerIndex) {
		var imgsArrangeArr = this.state.imgsArrangeArr,
			Constant = this.Constant,
			centerPos = Constant.centerPos,
			hPosRange = Constant.hPosRange,
			vPosRange = Constant.vPosRange,
			hPosRangeLeftSecX = hPosRange.leftSecX,
			hPosRangeRightSecX = hPosRange.rightSecX,
			hPosRangeY = hPosRange.y,
			vPosRangeTopY = vPosRange.topY,
			vPosRangeX = vPosRange.x,

			imgsArrangeTopArr = [],
			topImgNum = Math.ceil(Math.random() * 2),//取一个或不取
			topImgSpliceIndex = 0,

			imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

			//居中 centerIndex 的图片
			imgsArrangeCenterArr[0].pos = centerPos;

			//取出要布局上侧的图片状态信息
			topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
			imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

			//布局位于上侧的图片
			imgsArrangeTopArr.forEach(function(value, index) {
				imgsArrangeTopArr[index].pos = {
					top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
					left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
				}
			})

			//布局左右两侧的图片
			for(var i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
				var hPosRangeLORX = null;

				//前半部分布局左边，后半部分布局右边
				if (i < k) {
					hPosRangeLORX = hPosRangeLeftSecX;
				} else {
					hPosRangeLORX = hPosRangeRightSecX;
				}

				imgsArrangeArr[i].pos = {
					top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
					left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
				};
			}

			if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
				imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
			}

			imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

			this.setState({
				imgsArrangeArr: imgsArrangeArr
			});
	},

	getInitialState: function() {
		return {
			imgsArrangeArr:[
				/*{
					pos: {
						left: '0',
						top: '0'
					}
				}*/
			]
		};
	},

	//组件加载后，为每张图片计算其位置的范围
	componentDidMount: function() {
		//拿到舞台的大小
		var stageDOM = this.refs.stage.getDOMNode(),
			stageW = stageDOM.scrollWidth,
			stageH = stageDOM.scrollHeight,
			halfStageW = Math.ceil(stageW / 2),
			halfStageH = Math.ceil(stageH / 2);

		//拿到一个imageFigure的大小
		var imgFigureDOM = this.refs.imgFigure0.getDOMNode(),
			imgFigureW = imgFigureDOM.scrollWidth,
			imgFigureH = imgFigureDOM.scrollHeight,
			halfImgFigureW = Math.ceil(imgFigureW / 2),
			halfImgFigureH = Math.ceil(imgFigureH / 2);

		//计算中心图片的位置点
		this.Constant.centerPos = {
			left: halfStageW - halfImgFigureW,
			top: halfStageH - halfImgFigureH
		};

		//计算左侧，右侧区域图片排布位置的取值范围
		this.Constant.hPosRange.leftSecX[0] = -halfImgFigureW;
		this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgFigureW * 3;
		this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgFigureW;
		this.Constant.hPosRange.rightSecX[1] = stageW - halfImgFigureW;
		this.Constant.hPosRange.y[0] = -halfImgFigureH;
		this.Constant.hPosRange.y[1] = stageH - halfImgFigureH;

		//计算上侧区域图片排布位置的取值范围
		this.Constant.vPosRange.topY[0] = -halfImgFigureH;
		this.Constant.vPosRange.topY[1] = halfStageH - halfImgFigureH * 3;
		this.Constant.vPosRange.x[0] = halfStageW - imgFigureW;
		this.Constant.vPosRange.x[1] = halfStageW;


		this.rearrange(0);
	},

  render: function() {
	var controllerUnits = [];
	var imgFigures = [];
	imageDatas.forEach(function(value, index) {

		if(!this.state.imgsArrangeArr[index]) {
			this.state.imgsArrangeArr[index] = {
				pos: {
					left: 0,
					top: 0
				}
			};
		}

		imgFigures.push(<ImgFigure data={value} ref={'imgFigure' + index} arrange={this.state.imgsArrangeArr[index]} />);
	}.bind(this));

    return (
      <section className="stage" ref="stage">
      	<section className="img-sec">
			{imgFigures}
      	</section>
      	<nav className="controller-nav">
			{controllerUnits}
      	</nav>
      </section>
    );
  }
});
React.render(<ReactSelf1App />, document.getElementById('content')); // jshint ignore:line

module.exports = ReactSelf1App;
