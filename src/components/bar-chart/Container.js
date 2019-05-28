import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';

import Card from '../widget/Card';
import Section from '../widget/Section';

import DayLabel from './DayLabel';
import BarChart from './BarChart';

import './BarChart.scss';

const Container = props => {
  const showBarChart = !!props.dayInsights[props.selectedDay] ||
    !!props.weekInsights.length ||
    !!props.monthInsights.length ||
    !!props.weekdayInsights.length;

  const barChartProps = {
    plotData: props.data,
    margin: props.margin,
    height: props.height
  };

  return (
    <Section className='section-two-thirds'>
      <Card>
        <DayLabel selectedDay={props.selectedDay} />
        <div className='barChart'>
          {
            showBarChart
              ? <BarChart {...barChartProps} />
              : <div className='emptyString'>No data recorded</div>
          }
        </div>
      </Card>
    </Section>
  )
};

const mapStateToProps = state => ({
  dayInsights: state.app.dayInsights,
  weekInsights: state.app.weekInsights,
  monthInsights: state.app.monthInsights,
  weekdayInsights: state.app.weekdayInsights,
  selectedDay: moment(state.calendar.selectedDay).format('YYYY-MM-DD')
});

export default connect(mapStateToProps)(Container);