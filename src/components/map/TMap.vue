<script setup>
import { ref, computed, watch, onMounted } from "vue";

const emit = defineEmits(["mapInitEvent", "mapClickEvent"]);
const props = defineProps({
  width: String,
  height: String,
  searchResults: Object,
  selectedResults: Array,
  center: Object,
});

const map = ref();
const markers = ref([]);
const results = computed(() => props.searchResults);
const accs = computed(() => props.selectedResults);
const mapCenter = ref();

onMounted(() => {
  map.value = new Tmapv3.Map("map", {
    center: new Tmapv3.LatLng(37.566481622437934, 126.98502302169841), // 지도 초기 좌표
    width: props.width ? props.width : "75vw",
    height: props.height ? props.height : "75vh",
    zoom: 12,
  });

  navigator.geolocation.getCurrentPosition(({ coords }) => {
    mapCenter.value = new Tmapv3.LatLng(coords.latitude, coords.longitude);
    map.value.setCenter(mapCenter.value);
  });

  emit("mapInitEvent", map.value);
});

const putAllMarkers = (target) => {
  target.value.forEach(putMarker);
};

const removeAllMarkers = () => {
  markers.value.forEach(removeMarker);
  markers.value.length = 0;
};

const putMarker = (result) => {
  const marker = new Tmapv3.Marker({
    position: new Tmapv3.LatLng(result.frontLat, result.frontLon),
    map: map.value,
  });

  marker.on("click", () => {
    console.log(result);
  });

  markers.value.push(marker);
};

const removeMarker = (marker) => {
  marker.setMap(null);
};

watch(results, () => {
  removeAllMarkers();
  putAllMarkers(results);
  putAllMarkers(accs)
});

watch(accs, () => {
  putAllMarkers(accs)
})

watch(props.center, () => {
  map.value.setCenter(new Tmapv3.LatLng(props.center.lat, props.center.lng));
  map.value.setZoom(15);
});
</script>

<template>
  <div class="overflow-auto">
    <div id="map" @click="$emit('mapClickEvent')"></div>
  </div>
</template>

<style scoped></style>
