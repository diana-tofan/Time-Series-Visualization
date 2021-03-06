import React from 'react';
import * as d3 from "d3";

class XAxis extends React.PureComponent {
  componentDidMount() {
    this.renderAxis();
  }

  componentDidUpdate() {
    this.renderAxis();
  }

  renderAxis = () => {
    const xAxis = d3.axisBottom(this.props.xScale)
      .ticks(24)
      .tickFormat(d3.timeFormat('%H'));
    d3.select(this.refs.xAxis)
      .transition()
      .call(xAxis);
  };

  render() {
    return (
      <g className='axis axis-x'
         transform={this.props.transform}
         ref='xAxis'
         fill='none'
         fontSize={10}
         textAnchor='middle'
      >
        <text x={this.props.width - 70}
              y={35}
              textAnchor='middle'
              fill='#000'
              fontSize={12}>
          Hour of the day
        </text>
      </g>
    )
  }
}

export default XAxis;
