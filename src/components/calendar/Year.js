import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import * as d3 from 'd3';

import Month from './Month';

const Year = props => {
  const minDate = props.minDate.format('YYYY-MM-DD'); // new Date(2016, 0, 1);
  const maxDate = props.maxDate.format('YYYY-MM-DD'); // new Date(2020, 11, 31);

  const months = d3.timeMonth.range(new Date(parseInt(`${minDate.split('-')[0]}`), 0, 1),
    new Date(parseInt(`${maxDate.split('-')[0]}`), 11, 31));
  const chunk = (target, size) => {
    return target.reduce((memo, value, index) => {
      if (index % (target.length / size) === 0 && index !== 0) memo.push([]);
      memo[memo.length - 1].push(value);
      return memo
    }, [[]])
  };
  const monthsArr = chunk(months, months.length / 12);

  return (
    <div>
      {
        monthsArr.map((months, i) =>
          <div className={classNames('year', {'hidden': i !== props.yearIndex})} key={i}>
            {
              months.map(month =>
                <Month
                  key={month}
                  month={month}
                />
              )
            }
          </div>
        )
      }
    </div>
  )
};

const mapStateToProps = state => ({
  minDate: state.app.minDate,
  maxDate: state.app.maxDate,
  yearIndex: state.calendar.yearIndex
});

export default connect(mapStateToProps)(Year);