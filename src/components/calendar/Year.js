import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import * as d3 from 'd3';
import ReactTooltip from 'react-tooltip';

import Month from './Month';

class Year extends React.PureComponent {
  getChunk = (target, size) =>
    target.reduce((memo, value, index) => {
      if (index % (target.length / size) === 0 && index !== 0) memo.push([]);
      memo[memo.length - 1].push(value);
      return memo
    }, [[]]);

  componentDidUpdate() {
    ReactTooltip.rebuild();
  }

  render() {
    const props = this.props;
    const minDate = props.minDate.format('YYYY-MM-DD');
    const maxDate = props.maxDate.format('YYYY-MM-DD');

    const months = d3.timeMonth.range(new Date(parseInt(`${minDate.split('-')[0]}`), 0, 1),
      new Date(parseInt(`${maxDate.split('-')[0]}`), 11, 31));

    const monthsArr = this.getChunk(months, months.length / 12);

    return (
      <div className='year-wrapper' ref='brush' onClick={ev => ev.stopPropagation()}>
        {
          monthsArr.map((months, i) =>
            <g className={classNames('year', {'hidden': i !== props.yearIndex})} key={i}>
              {
                months.map((month, i) =>
                  <Month
                    key={i}
                    month={month}
                  />
                )
              }
            </g>
          )
        }
        <ReactTooltip id='svgTooltip' multiline class='tooltip'/>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  data: state.app.data,
  minDate: state.app.minDate,
  maxDate: state.app.maxDate,
  yearIndex: state.calendar.yearIndex
});

export default connect(mapStateToProps)(Year);
