<script setup>
import axios from "axios";
import TMap from "@/components/map/TMap.vue";
import { ref, watch } from "vue";

const searchResults = ref([]);
const categories = ref([]);
const checkbox = ref({
  편의점: false,
  식당: false,
  술집: false,
  숙박: false,
});

const searchAround = () => {
  axios
    .get("https://apis.openapi.sk.com/tmap/pois/search/around", {
      params: {
        version: 1,
        // page: 1,
        count: 50,
        categories: categories.value,
        centerLon: 126.98502302169841,
        centerLat: 37.566481622437934,
        radius: 3,
        appKey: import.meta.env.VITE_TMAP_KEY,
      },
    })
    .then((response) => response.data.searchPoiInfo.pois.poi)
    .then((points) => {
      searchResults.value = [];
      for (let point of points) searchResults.value.push(point);
    })
    .catch((error) => console.error("Error occured in searchAround()", error));
};

watch(checkbox.value, () => {
  categories.value = Object.keys(checkbox.value)
    .filter((key) => checkbox.value[key])
    .join(";");

  if (!categories.value) {
    searchResults.value = [];
    return;
  }
  searchAround();
});
</script>

<template>
  <div>
    <div>
      <label for="편의점">편의점</label>
      <input type="checkbox" id="편의점" v-model="checkbox['편의점']" />
    </div>
    <div>
      <label for="식당">식당</label>
      <input type="checkbox" id="식당" v-model="checkbox['식당']" />
    </div>
    <div>
      <label for="숙박">숙박</label>
      <input type="checkbox" id="숙박" v-model="checkbox['숙박']" />
    </div>
    <div>
      <label for="술집">술집</label>
      <input type="checkbox" id="술집" v-model="checkbox['술집']" />
    </div>
    <TMap class="80vw" :search-results="searchResults" />
  </div>
</template>

<style scoped></style>
