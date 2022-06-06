import { createChart, ColorType } from 'lightweight-charts';
import React, { useEffect, useRef } from 'react';

function TVLChart ({data}) {
	
	const chartContainerRef = useRef();
  const colors = {
    backgroundColor: 'transparent',
    lineColor: '#F59E0B',
    textColor: 'black',
    areaTopColor: '#F59E0B',
    areaBottomColor: 'rgba(41, 98, 255, 0.28)'
  };

  var darkTheme = {
    chart: {
      layout: {
        backgroundColor: 'transparent',
        lineColor: '#F59E0B',
        textColor: '#D9D9D9',
      },
      watermark: {
        color: 'rgba(0, 0, 0, 0)',
      },
      crosshair: {
        color: '#758696',
      },
      grid: {
        vertLines: {
          visible: false,
        },
        horzLines: {
          visible: false,
        },
      },
      rightPriceScale: {
        visible: true,
      },
    },
    series: {
      areaStyle: {
        topColor: '#F59E0B',
        bottomColor: 'rgba(254, 158, 11, 0.04)',
        lineColor: '#F59E0B',
      },
    },
  };

	useEffect(
		() => {
			const handleResize = () => {
				chart.applyOptions({ width: chartContainerRef.current.clientWidth });
			};

			const chart = createChart(chartContainerRef.current, {
				width: chartContainerRef.current.clientWidth,
				height: 300,
			});
			
			const newSeries = chart.addAreaSeries();
      chart.applyOptions(darkTheme.chart);
	    newSeries.applyOptions(darkTheme.series.areaStyle);
			newSeries.setData(data);
      chart.timeScale().fitContent();

			window.addEventListener('resize', handleResize);

			return () => {
				window.removeEventListener('resize', handleResize);

				chart.remove();
			};
		},
  );

	return (
		<div
			ref={chartContainerRef}
		/>
	);
};

export default TVLChart