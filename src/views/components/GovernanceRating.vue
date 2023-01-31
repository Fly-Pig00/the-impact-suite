<template>
  <div class="d-flex">
    <div
      class="charity-rating"
      data-type="purpose"
      :data-status="rating.purpose ? 1 : 0"
    >
      <span class="marker"></span><br />
      <label>PURPOSE</label>
    </div>

    <div
      class="charity-rating"
      data-type="people"
      :data-status="rating.people ? 1 : 0"
    >
      <span class="marker"></span><br />
      <label>PEOPLE</label>
    </div>

    <div
      class="charity-rating"
      data-type="process"
      :data-status="rating.process ? 1 : 0"
    >
      <span class="marker"></span><br />
      <label>PROCESS</label>
    </div>
    <div
      class="charity-rating"
      data-type="impact"
      :data-status="rating.impact ? 1 : 0"
    >
      <span class="marker"></span><br />
      <label>IMPACT</label>
    </div>

    <div
      class="charity-rating"
      data-type="review"
      :data-status="rating.review ? 1 : 0"
    >
      <span class="marker"></span><br />
      <label>REVIEW</label>
    </div>
  </div>
</template>

<script>
export default {
  name: "GovernanceRating",
  props: {
    rating: {
      type: Object,
      required: true
    }
  }
};
</script>
