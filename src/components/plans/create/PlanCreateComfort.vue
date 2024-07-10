<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useAreaCodeStore } from "@/stores/areaCode";
import MapList from "@/components/map/MapList.vue";
import ButtonA from "@/components/common/ButtonA.vue";
import axios from "axios";

const store = useAreaCodeStore();
const route = useRoute();
const router = useRouter();

const planId = route.query.plan_id;
const plan = ref({});
const searchResults = ref([]);
const selectedAcc = ref([]);
const LLAreaCode = ref("000");
const LMAreaCode = ref("000");
const category = ref("");
const center = ref({
  lat: 0,
  lng: 0,
});

const setLLAreaCode = (LLArea) => {
  LLAreaCode.value = store.areaCodes.find((code) => code.districtName === LLArea).largeCd;
  LMAreaCode.value = "000";
  console.log(LLAreaCode.value);
};

const setLMAreaCode = (LMArea) => {
  LMAreaCode.value = store.areaCodes.find((code) => code.districtName === LMArea).middleCd;
  console.log(LMAreaCode.value);
};

const setCategory = (ctgr) => {
  category.value = ctgr;
  console.log(category.value);
};

const getCenter = (point) => {
  center.value.lat = point.noorLat;
  center.value.lng = point.noorLon;
};

const initCenter = (map) => {
  center.value.lat = map.getCenter().lat();
  center.value.lng = map.getCenter().lng();
};

const saveTmpAcc = () => {
  sessionStorage.setItem("accommodation", JSON.stringify(selectedAcc.value));
};

const save = async () => {
  saveTmpAcc();

  if (planId) {
    router.push({ name: "planDetail", params: { plan_id: planId } });
  } else {
    router.push({ name: "planCreate" });
  }
};

const searchAround = () => {
  console.log(center.value);
  axios
    .get("https://apis.openapi.sk.com/tmap/pois", {
      headers: {
        appKey: import.meta.env.VITE_TMAP_KEY,
      },
      params: {
        version: 1,
        searchKeyword: category.value,
        areaLLCode: LLAreaCode.value,
        areaLMCode: LMAreaCode.value,
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
      console.log("검색 결과 없음!");
    })
    .catch((error) => console.error("Searching error", error));
};

onMounted(() => {
  plan.value = JSON.parse(sessionStorage.getItem("plan"));
});
</script>

<template>
  <div class="container">
    <div class="flex flex-col m-5">
      <h1 class="font-black mx-5">근처 편의시설을 선택해주세요.</h1>
      <div class="grid grid-cols-7 my-3">
        <button @click="setLLAreaCode('서울')" class="col-span-2">지역</button>
        <button @click="setLMAreaCode('강남구')" class="col-span-2">시군구</button>
        <button @click="setCategory('편의점')" class="col-span-2">카테고리</button>
        <button @click="searchAround">검색</button>
      </div>
      <MapList
        :search-results="searchResults"
        :center="center"
        @result-click-event="getCenter"
        @map-init-event="initCenter" />
      <ButtonA class="w-[80vw] self-center" value="다음으로" @click="save" />
    </div>
  </div>
</template>

<style scoped></style>
