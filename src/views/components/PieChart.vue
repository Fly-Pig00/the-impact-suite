<template>
  <div ref="chart" :style="{ height: height }"></div>
</template>

<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4theme from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4theme);

export default {
  name: "PieChart",
  props: {
    height: {
      type: [Number, String],
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    moneyValue: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      chart: null
    };
  },
  mounted() {
    this.drawChart();
  },
  methods: {
    drawChart() {
      this.chart = am4core.createFromConfig(
        {
          data: this.data,
          series: [
            {
              type: "PieSeries",
              dataFields: {
                value: "value",
                category: "category"
              },
              labels: {
                template: {
                  text: "{value}",
                  fontSize: 12
                }
              },
              slices: {
                tooltipText: "{category} {value}",
                // stroke: "#ffffff",
                // strokeWidth: 1,
                strokeOpacity: 0,
                adapter: {}
              },
              hiddenState: {
                properties: {
                  startAngle: -90,
                  endAngle: 270
                }
              },
              tooltip: {
                fontSize: 12
              },
              colors: {
                step: 4
              }
            }
          ],
          innerRadius: "40%",
          legend: {
            valueLabels: {
              template: {
                text: ""
              }
            },
            labels: {
              template: {
                fontSize: 12,
                maxWidth: 60
              }
            },
            markers: {
              children: [
                {
                  cornerRadiusTopLeft: 2,
                  cornerRadiusTopRight: 2,
                  cornerRadiusBottomRight: 2,
                  cornerRadiusBottomLeft: 2,
                  strokeWidth: 0,
                  strokeOpacity: 1,
                  height: 3,
                  dy: 9
                }
              ]
            }
          },
          numberFormatter: {
            numberFormat: this.moneyValue ? "$#.#a" : "#",
            bigNumberPrefixes: [
              { number: 1e3, suffix: "K" },
              { number: 1e6, suffix: "M" }
            ]
          }
        },
        this.$refs.chart,
        am4charts.PieChart
      );
    }
  },
  watch: {
    data() {
      if (this.chart) {
        this.chart.dispose();
        this.chart = null;
      }

      this.drawChart();
    }
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  }
};
</script>
