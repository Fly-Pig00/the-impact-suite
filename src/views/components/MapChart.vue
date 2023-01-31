<template>
  <div ref="chart" :style="{ height: height }"></div>
</template>

<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import auGeoData from "@amcharts/amcharts4-geodata/australiaHigh";

export default {
  name: "MapChart",
  props: {
    height: {
      type: [Number, String],
      required: true
    },
    states: {
      type: Array,
      required: true
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
    getStateId(state) {
      const stateObj = auGeoData.features
        .map(stateObj => {
          return { id: stateObj.id, name: stateObj.properties.name };
        })
        .find(
          stateObj =>
            stateObj.id.toLowerCase() === ("AU-" + state).toLowerCase() ||
            stateObj.name === state
        );

      return stateObj ? stateObj.id : null;
    },
    drawChart() {
      const data = [];
      for (const state of this.states) {
        const stateId = this.getStateId(state);
        if (stateId) {
          data.push({
            id: stateId,
            fill: am4core.color("#922790")
          });
        }
      }

      this.chart = am4core.createFromConfig(
        {
          geodata: auGeoData,
          projection: "Miller",
          series: [
            {
              type: "MapPolygonSeries",
              useGeodata: true,
              mapPolygons: {
                // tooltipText: "{name}",
                propertyFields: {
                  fill: "fill"
                }
                // fill: "#74B266",
                // states: {
                //   hover: {
                //     properties: {
                //       fill: "#367B25"
                //     }
                //   }
                // }
              },
              data: data
              // data: [
              //   {
              //     id: "AU-NSW",
              //     fill: am4core.color("#922790")
              //   },
              //   {
              //     id: "AU-VIC",
              //     fill: am4core.color("#FF1717")
              //   }
              // ]
            }
          ]
        },
        this.$refs.chart,
        am4maps.MapChart
      );
    }
  },
  watch: {
    states() {
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
