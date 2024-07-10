import axios from "axios";
import { defineStore } from "pinia";
import { ref } from "vue";

/*
  {
    areaDepth: "L",
    districtName: "서울",
    largeCd: "11",
    middleCd: "000",
    smallCd: "000",
  };
*/
export const useAreaCodeStore = defineStore("areaCode", () => {
  const areaCodes = ref([]);
  const LLAreas = ref([]);
  const LMAreas = ref([]);
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
    .then((codes) => {
      areaCodes.value = codes;
      LLAreas.value = areaCodes.value.filter((code) => code.areaDepth === "L");
      LMAreas.value = areaCodes.value.filter((code) => code.areaDepth === "M");
    })
    .then(() => console.log("AreaCodes loaded successful!"));

  return { areaCodes, LLAreas, LMAreas };
});
