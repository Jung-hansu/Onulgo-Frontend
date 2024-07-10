<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import MapList from "@/components/map/MapList.vue";
import ButtonA from "@/components/common/ButtonA.vue";
import ButtonBack from "@/components/common/ButtonBack.vue";
import axios from "axios";

const emit = defineEmits(["submitAcc"]);
const router = useRouter();

const plan = ref({});
const searchResults = ref([]);
const selectedAccs = ref(
  sessionStorage.getItem("accommodations")
    ? JSON.parse(sessionStorage.getItem("accommodations"))
    : []
);

const selectedLLArea = ref("00");
const selectedLMArea = ref("000");

const areaCodes = ref([]);
const LLAreas = computed(() => areaCodes.value.filter((code) => code.areaDepth === "L"));
const LMAreas = computed(() =>
  areaCodes.value.filter((code) => code.areaDepth === "M" && code.largeCd === selectedLLArea.value)
);

const center = ref({
  lat: 0,
  lng: 0,
});

const getCenter = (point) => {
  center.value.lat = point.noorLat;
  center.value.lng = point.noorLon;
};

const initCenter = (map) => {
  center.value.lat = map.getCenter().lat() + 0.00005;
  center.value.lng = map.getCenter().lng();
};

const save = (accommodations) => {
  emit("submitAcc", accommodations);
  router.replace({ name: "planModify" });
};

const searchAround = () => {
  axios
    .get("https://apis.openapi.sk.com/tmap/pois", {
      headers: {
        appKey: import.meta.env.VITE_TMAP_KEY,
      },
      params: {
        version: 1,
        searchKeyword: "숙박;호텔",
        areaLLCode: selectedLLArea.value,
        areaLMCode: selectedLMArea.value,
        searchtypCd: "R",
        centerLon: center.value.lng,
        centerLat: center.value.lat,
        radius: 30,
        page: 1,
        count: 100,
        poiGroupYn: "Y",
      },
    })
    .then((response) => (response.data.searchPoiInfo ? response.data.searchPoiInfo.pois.poi : null))
    .then((points) => {
      if (points) {
        searchResults.value = [];
        for (let point of points) searchResults.value.push(point);
        return;
      }
      alert("검색 결과가 없습니다");
    })
    .catch((error) => console.error("Searching error", error));
};

onMounted(() => {
  plan.value = JSON.parse(sessionStorage.getItem("plan"));
  if (sessionStorage.getItem("accommodations")) {
    selectedAccs.value = JSON.parse(sessionStorage.getItem("accommodations"));
  }
  axios
    .get("https://apis.openapi.sk.com/tmap/poi/areascode", {
      params: {
        version: 1,
        page: 1,
        count: 1000,
        middleCdFlag: "Y",
        smallCdFlag: "N",
        appKey: import.meta.env.VITE_TMAP_KEY,
      },
    })
    .then((response) => response.data.areaCodeInfo.poiAreaCodes)
    .then((codes) => (areaCodes.value = codes))
    .then(() => console.log("AreaCodes loaded successful!"));
});
</script>

<template>
  <div class="container">
    <div class="flex flex-col m-5">
      <h1 class="font-black mx-5">
        <ButtonBack class="w-[1.5rem]" />
        숙박 시설을 선택해주세요.
      </h1>
      <div class="flex flex-col items-center grid grid-cols-5 my-3">
        <div class="col-span-2 mx-1 border rounded-lg h-auto">
          <select
            class="w-full font-black text-md"
            name="LL-area"
            id="LL-area"
            v-model="selectedLLArea">
            <option value="00" selected disabled>지역</option>
            <template v-for="LLArea in LLAreas" :key="LLArea.districtName">
              <option :value="LLArea.largeCd" :label="LLArea.districtName"></option>
            </template>
          </select>
        </div>
        <div class="col-span-2 mx-1 border rounded-lg h-auto">
          <select
            class="w-full font-black text-md"
            name="LM-area"
            id="LM-area"
            v-model="selectedLMArea">
            <option value="000" selected disabled>시군구</option>
            <template v-for="LMArea in LMAreas" :key="LMArea.districtName">
              <option :value="LMArea.middleCd" :label="LMArea.districtName"></option>
            </template>
          </select>
        </div>
        <ButtonA value="검색" @click="searchAround" />
      </div>
      <MapList
        :search-results="searchResults"
        :selected-results="selectedAccs"
        :center="center"
        type="accommodation"
        @result-click="getCenter"
        @map-init="initCenter"
        @submit="save" />
    </div>
  </div>
</template>

<style scoped></style>
