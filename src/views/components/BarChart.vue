<template>
  <div ref="chart" :style="{ height: height }"></div>
</template>

<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4theme from "@amcharts/amcharts4/themes/animated";

am4core.useTheme(am4theme);

export default {
  name: "BarChart",
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
    },
    color: {
      type: String,
      default: null
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
      const singleColor = this.color;

      this.chart = am4core.createFromConfig(
        {
          data: this.data,
          xAxes: [
            {
              type: "CategoryAxis",
              dataFields: {
                category: "category"
              },
              renderer: {
                grid: {
                  disabled: true
                },
                labels: {
                  fontSize: 12
                },
                minGridDistance: 1
              }
            }
          ],

          yAxes: [
            {
              type: "ValueAxis",
              title: {},
              min: 0,
              renderer: {
                baseGrid: {},
                grid: {
                  strokeOpacity: 0.07
                },
                labels: {
                  fontSize: 12
                }
              }
            }
          ],

          series: [
            {
              type: "ColumnSeries",
              dataFields: {
                valueY: "value",
                categoryX: "category"
              },
              columns: {
                column: {
                  tooltipText: "{categoryX} {valueY}",
                  labels: {
                    fontSize: 12
                  }
                },
                strokeOpacity: 0,
                adapter: {
                  fill: function(fill, target) {
                    if (singleColor) {
                      return singleColor;
                    }

                    const chart = target.dataItem.component.chart;
                    const color = chart.colors.getIndex(
                      target.dataItem.index * 3
                    );
                    return color;
                  }
                }
              },
              tooltip: {
                fontSize: 12
              }
            }
          ],

          numberFormatter: {
            numberFormat: this.moneyValue ? "$#.#a" : "",
            bigNumberPrefixes: [
              { number: 1e3, suffix: "K" },
              { number: 1e6, suffix: "M" }
            ]
          }
        },
        this.$refs.chart,
        am4charts.XYChart
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
