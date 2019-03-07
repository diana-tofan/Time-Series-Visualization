import React from 'react';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';

import DayLabels from './DayLabels';
import YearLabel from './YearLabel';
import Year from './Year';
import Card from '../widget/Card';

import '../Spinner.scss';
import { showSpinner } from '../../reducers/app';
import { onScreenResize } from '../../reducers/calendar';

class Heatmap extends React.PureComponent {
  constructor(props) {
    super(props);
    window.addEventListener('resize', () => {
      props.onScreenResize(window.innerWidth);
    });
  }

  componentDidMount() {
    this.props.showSpinner(false);
  }

  render () {
    return (
      <Card>
        <DayLabels />
        <YearLabel />
        <div className='months'>
          <Year />
        </div>
        <ReactTooltip id='svgTooltip' multiline class='tooltipx'/>
      </Card>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  showSpinner: val => dispatch(showSpinner(val)),
  onScreenResize: val => dispatch(onScreenResize(val))
});

export default connect(null, mapDispatchToProps)(Heatmap);
