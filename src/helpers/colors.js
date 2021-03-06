import moment from 'moment';
import * as d3 from 'd3';

const getDaysArrayByMonth = (month, year, data) => {
  let daysInMonth = moment(month, 'M').daysInMonth();
  const arrDays = [];

  while(daysInMonth) {
    const current = moment(month, 'M').date(daysInMonth).format(`${year}-MM-DD`);
    Object.keys(data).find(key => key === current) && arrDays.push(current);
    daysInMonth--;
  }
  return arrDays;
};

export const getAverageColor = props => {
  let rgb = {
    r: 0,
    g: 0,
    b: 0
  };
  let filteredColors = [];
  const insertMissingColors = daysArray => {
    daysArray.forEach(day => {
      if (!filteredColors.find(color => moment(color.day, 'DD-MM-YYYY').format('YYYY-MM-DD') === day)) {
        const value = d3.color(getColors(props.data).oranges(props.data[day]));
        filteredColors.push({
          day,
          value
        });
      }
    })
  };
  if (props.selectedWeek) {
    filteredColors = props.colors.filter(color => moment(color.day).isoWeek() === props.selectedWeek && color);
    const daysArray = Object.keys(props.allDays).filter(key => moment(key).isoWeek() === props.selectedWeek);
    insertMissingColors(daysArray);
  }

  if (props.selectedMonth) {
    filteredColors = props.colors.filter(color => moment(color.day, 'DD-MM-YYYY').format('M') === props.selectedMonth && color);
    const daysArray = getDaysArrayByMonth(props.selectedMonth, moment(props.minDate).format('YYYY'), props.data);
    insertMissingColors(daysArray);
  }

  if (props.selectedWeekday) {
    filteredColors = props.colors.filter(color => moment(color.day, 'DD-MM-YYYY').format('ddd') === props.selectedWeekday && color);
    const daysArray = Object.keys(props.allDays).filter(key => moment(key).isoWeekday() === moment(props.selectedWeekday, 'ddd').isoWeekday());
    insertMissingColors(daysArray);
  }

  filteredColors.forEach(color => {
    rgb.r += color.value.r;
    rgb.g += color.value.g;
    rgb.b += color.value.b;
  });

  return d3.rgb(rgb.r / filteredColors.length, rgb.g / filteredColors.length, rgb.b / filteredColors.length);
};

const contains = (arr, showOverview, item) => {
  if (arr && showOverview) {
    let i = arr.length;
    while (i--) {
      if (arr[i] === item) {
        return true;
      }
    }
    return false;
  }
};

export const getAdjacentDayColor = (props, day) => {
  const item = Object.keys(props.data).find(key => moment(key, 'YYYY-MM-DD').format('DD-MM-YYYY') === day);
  if (item) {
    return d3.color(getColors(props.data).oranges(props.data[item]));
  }
  return '#efefef';
};

export const getColors = data => {
  const min = d3.min(Object.values(data));
  const max = d3.max(Object.values(data));
  return {
    purples: purplePalette(min, max),
    oranges: orangePalette(min, max),
    blues: bluePalette(min, max)
  }
};

const purplePalette = (min, max) => {
  const d = (max-min)/20;
  return d3.scaleThreshold()
    .range(['#dadaeb','#d1d0e6','#c9c7e1','#c0bedc','#b7b5d7','#afacd2','#a6a3ce','#9e9ac9','#9591c4','#8c89c0','#8380bc','#7d76b7','#786db2','#7464ad','#6f5aa8','#6950a3','#64469e','#5f3d99','#5a3294','#54278f'])
    .domain([min+d,min+2*d,min+3*d,min+4*d,min+5*d,min+6*d,min+7*d,min+8*d,min+9*d,min+10*d,min+11*d,min+12*d,min+13*d,min+14*d,min+15*d,min+16*d,min+17*d,min+18*d,min+19*d,min+20*d]);
};

const orangePalette = (min, max) => {
  const d = (max-min)/10;
  return d3.scaleThreshold()
    .range(['#fdd0a2','#febb81','#fea763','#fd9243','#f67e30','#ea6c23','#dc5c18','#cb4d0e','#b94107','#a63603'])
    .domain([min+d,min+2*d,min+3*d,min+4*d,min+5*d,min+6*d,min+7*d,min+8*d,min+9*d,min+10*d]);
};

const bluePalette = (min, max) => {
  const d = (max-min)/10;
  return d3.scaleThreshold()
    .range(['#9ecae1','#86bbdb','#6faed5','#599fce','#4190c5','#3581bd','#2a72b3','#2063a9','#15549f','#084594'])
    .domain([min+d,min+2*d,min+3*d,min+4*d,min+5*d,min+6*d,min+7*d,min+8*d,min+9*d,min+10*d]);
};

export const getDayColor = (props, isCurrentDay) => {
  const item = Object.keys(props.data).find(key => new Date(key).setHours(0,0,0,0) === props.day.setHours(0,0,0,0));

  if (item) {
    const day = moment(props.day).format('DD-MM-YYYY');

    const isCurrentWeek = contains(props.currentWeek, props.showWeekOverview, day) ||
      (props.selectedWeek && props.selectedWeek === moment(props.day).isoWeek()) ||
      (!!props.shiftSelection.length && props.shiftSelection.indexOf(moment(props.day).isoWeek()) > -1);
    const isCurrentMonth = contains(props.currentMonth, props.showMonthOverview, day) ||
      (props.selectedMonth && props.selectedMonth === moment(props.day).format('M')) ||
      (!!props.shiftSelection.length && props.shiftSelection.indexOf(moment(props.day).format('MMMM')) > -1);
    const isCurrentWeekday = contains(props.currentWeekdays.daysArr, props.showWeekdayOverview, day) ||
      (props.selectedWeekday && props.selectedWeekday === moment(props.day).format('ddd')) ||
      (!!props.shiftSelection.length && props.shiftSelection.indexOf(moment(props.day).format('ddd')) > -1);
    const isHighlightedDay = props.highlightedWeekday && props.highlightedWeekday === moment(props.day).format('ddd');
    const isSelected = !!props.shiftSelection.length &&
      (props.shiftSelection.indexOf(moment(props.day).format('YYYY-MM-DD')) > -1 ||
        props.shiftSelection.indexOf('all') > -1);

    const colors = getColors(props.data);
    const interpolateColor = (isCurrentDay || isSelected || isCurrentWeek || isCurrentMonth || isCurrentWeekday || isHighlightedDay)
      ? (isHighlightedDay ? colors.blues(props.data[item]) : colors.oranges(props.data[item]))
      : colors.purples(props.data[item]);

    return {
      count: props.data[item],
      fillColor: interpolateColor
    }
  }

  return {
    fillColor: '#efefef',
    count: 0
  };
};
