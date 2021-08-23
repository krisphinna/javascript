
const width = 800;
const height = 400;
const barWidth = width / 275;

const tooltip = d3
  .select('.holder')
  .append('div')
  .attr('id', 'tooltip')
  .style('opacity', 0);

const overlay = d3
  .select('.holder')
  .append('div')
  .attr('class', 'overlay')
  .style('opacity', 0);

const svg = d3
  .select('.holder')
  .append('svg')
  .attr('width', 900)
  .attr('height', 450);

d3.json(
  'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json',
  (error, data) => {
    if (error) {
      throw error;
    }
    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('x', -250)
      .attr('y', 15)
      .text('Gross Domestic Product');

    svg
      .append('text')
      .attr('x', 250)
      .attr('y', 440)
      .text('More Information: http://www.bea.gov/national/pdf/nipaguid.pdf')
      .attr('class', 'info');

    const years = data.data.map(item => {
    let quarter;
    const temp = item[0].substring(5, 7);

      if (temp === '01') {
        quarter = 'Q1';
      } else if (temp === '04') {
        quarter = 'Q2';
      } else if (temp === '07') {
        quarter = 'Q3';
      } else if (temp === '10') {
        quarter = 'Q4';
      }

      return item[0].substring(0, 4) + ' ' + quarter;
    });

    const yearsDate = data.data.map(item => {
      return new Date(item[0]);
    });

    const xMax = new Date(d3.max(yearsDate));
    xMax.setMonth(xMax.getMonth() + 3);
    const xScale = d3
      .scaleTime()
      .domain([d3.min(yearsDate), xMax])
      .range([0, width]);

    const xAxis = d3.axisBottom().scale(xScale);

    svg
      .append('g')
      .call(xAxis)
      .attr('id', 'x-axis')
      .attr('transform', 'translate(60, 405)');

    const GDP = data.data.map(item => {
      return item[1];
    });

    let scaledGDP = [];

    let gdpMax = d3.max(GDP);

    let linearScale = d3.scaleLinear()
    .domain([0, gdpMax])
    .range([0, height]);

    scaledGDP = GDP.map(item => {
      return linearScale(item);
    });

    const yAxisScale = d3.scaleLinear()
    .domain([0, gdpMax])
    .range([height, 0]);

    const yAxis = d3.axisLeft(yAxisScale);

    svg
      .append('g')
      .call(yAxis)
      .attr('id', 'y-axis')
      .attr('transform', 'translate(60, 5)');

    d3.select('svg')
      .selectAll('rect')
      .data(scaledGDP)
      .enter()
      .append('rect')
      .attr('data-date', (d, i) => {
        return data.data[i][0];
      })
      .attr('data-gdp', (d, i) => {
        return data.data[i][1];
      })
      .attr('class', 'bar')
      .attr('x', (d, i) => {
        return xScale(yearsDate[i]);
      })
      .attr('y', (d) => {
        return height - d;
      })
      .attr('width', barWidth)
      .attr('height', (d) => {
        return d;
      })
      .style('fill', '#33ad11')
      .attr('transform', 'translate(62, 4)')
      .on('mouseover', (d, i) => {
        overlay
          .transition()
          .duration(200)
          .style('height', d + 'px')
          .style('width', barWidth + 'px')
          .style('opacity', 0.7)
          .style('left', i * barWidth + 0 + 'px')
          .style('top', height - d + 'px')
          .style('transform', 'translateX(70px)');
        tooltip.transition().duration(200).style('opacity', 0.7);
        tooltip
          .html(
            years[i] +
              '<br>' +
              '$' +
              GDP[i].toFixed(1).replace(/(\d)(?=(\d{3})+\.)/g, '$1,') + ' Billion'
          )
          .attr('data-date', data.data[i][0])
          .style('left', i * barWidth + 30 + 'px')
          .style('top', height - 100 + 'px')
          .style('transform', 'translateX(60px)');
      })
      .on('mouseout', () => {
        tooltip.transition().duration(200).style('opacity', 0);
        overlay.transition().duration(200).style('opacity', 0);
      });
  }
);
