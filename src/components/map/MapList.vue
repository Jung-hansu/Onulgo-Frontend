<script setup>
import TMap from "@/components/map/TMap.vue";
import ButtonA from "@/components/common/ButtonA.vue";
import ButtonClose from "@/components/common/ButtonClose.vue";
import VCard from "@/components/common/VCard.vue";
import { ref, onMounted, computed } from "vue";

const emit = defineEmits(["resultClick", "mapInit", "submit"]);
const props = defineProps({
  type: String,
  searchResults: Array,
  selectedResults: Array,
  center: Object,
});

const plan = ref({});
const planDayRange = computed(
  () =>
    Math.ceil(
      (new Date(plan.value.end_date) - new Date(plan.value.start_date)) / (1000 * 60 * 60 * 24)
    ) + 1
);
const searchResults = computed(() => props.searchResults);
const selectedResults = ref(props.selectedResults ? props.selectedResults : []);

const removeItem = (item) => {
  const idx = selectedResults.value.indexOf(item);
  selectedResults.value.splice(idx, 1);
};

const select = (point) => {
  setCenter(point);
  if (props.type === "accommodation" && selectedResults.value.length == planDayRange.value) {
    alert(`최대 ${planDayRange.value}일 까지 설정할 수 있습니다.`);
    return;
  }
  selectedResults.value.push(point);
};

const setCenter = (point) => {
  emit("resultClick", point);
};

const informMap = (map) => {
  emit("mapInit", map);
};

const save = () => {
  emit("submit", selectedResults.value);
};

const touchStartY = ref(0);
const currentIndex = ref(null);
const dragIndex = ref(null);

const onDragStart = (index, event) => {
  dragIndex.value = index;
  event.dataTransfer.setData("text/plain", index);
  event.dataTransfer.effectAllowed = "move";
};

const onDragOver = (event) => {
  event.preventDefault();
};

const onDrop = (index, event) => {
  event.preventDefault();
  const draggedIndex = parseInt(event.dataTransfer.getData("text/plain"), 10);

  if (draggedIndex !== index) {
    const draggedItem = selectedResults.value[draggedIndex];
    selectedResults.value.splice(draggedIndex, 1);
    selectedResults.value.splice(index, 0, draggedItem);
  }
};

const onTouchStart = (index, event) => {
  dragIndex.value = index;
  touchStartY.value = event.touches[0].clientY;
};

const onTouchMove = (event) => {
  event.preventDefault();
  const touchY = event.touches[0].clientY;

  const containerRect = event.currentTarget.parentElement.getBoundingClientRect();
  const itemHeight = containerRect.height / selectedResults.value.length;

  const newIndex = Math.floor((touchY - containerRect.top) / itemHeight);

  if (newIndex !== currentIndex.value && newIndex >= 0 && newIndex < selectedResults.value.length) {
    currentIndex.value = newIndex;
  }
};

const onTouchEnd = (event) => {
  const touchY = event.changedTouches[0].clientY;
  const itemRect = event.currentTarget.getBoundingClientRect();
  const midPoint = itemRect.top - itemRect.height / 2;

  let newIndex = currentIndex.value;
  if (touchY > midPoint) {
    newIndex = currentIndex.value + 1;
  }

  if (
    dragIndex.value !== null &&
    dragIndex.value !== undefined &&
    newIndex !== dragIndex.value &&
    newIndex <= selectedResults.value.length
  ) {
    const draggedItem = selectedResults.value[dragIndex.value];

    selectedResults.value.splice(dragIndex.value, 1);

    if (newIndex > dragIndex.value) {
      newIndex -= 1;
    }

    selectedResults.value.splice(newIndex, 0, draggedItem);
  }
  dragIndex.value = null;
  currentIndex.value = null;
};

onMounted(() => {
  plan.value = JSON.parse(sessionStorage.getItem("plan"));
});
</script>

<template>
  <div class="container">
    <div class="flex flex-col items-center lg:flex-row lg:items-between md:flex-row md:items-between">
      <div class="relative">
        <TMap
          class="w-[67vw] h-[100vw] lg:w-[60vh] lg:h-[50vh] md:w-[40vw] md:h-[50vh]"
          width="65vw"
          height="100vw"
          :search-results="searchResults"
          :selected-results="selectedResults"
          :center="center"
          @map-init-event="informMap" />
        <div class="absolute bottom-2 flex max-w-full overflow-scroll px-2 lg:w-[96%] lg:left-[2%] md:w-[96%] md:left-[2%]">
          <template v-for="point in searchResults" :key="point.id">
            <VCard
              class="w-[12rem] h-[10rem] max-h-[30vw] lg:w-[15vw] lg:h-[10vw] md:w-[15vw] md:h-[12vw] mx-2 overflow-hidden"
              title-class="text-md lg:text-sm md:text-sm"
              content-class="text-xs"
              :title="point.name"
              :content="point.newAddressList.newAddress[0].fullAddressRoad"
              button="추가"
              @v-click="select(point)"
              @click="setCenter(point)" />
          </template>
        </div>
      </div>
      <div
        v-if="selectedResults.length"
        class="flex flex-col justify-around p-1 bg-sky-100 w-[90%] mt-2 lg:ms-3 md:ms-3">
        <template v-for="(point, idx) in selectedResults">
          <div
            class="flex grid grid-cols-6 my-1 p-2 bg-white draggable cursor-move active:hover:shadow-[inset_0_10px_15px_-3px_rgba(0,0,0,0.1)]"
            :draggable="true"
            @dragstart="onDragStart(idx, $event)"
            @dragover="onDragOver($event)"
            @drop="onDrop(idx, $event)"
            @touchstart="onTouchStart(idx, $event)"
            @touchmove="onTouchMove($event)"
            @touchend="onTouchEnd($event)"
            @click="setCenter(point)">
            <h1 class="font-black text-xs self-center">
              {{ idx + 1 }}<span v-if="type === 'accommodation'">일차</span>
            </h1>
            <div class="flex items-center col-span-4 grid">
              <span class="inline-block font-black text-sm">{{ point.name }}</span>
              <span class="text-xs">{{ point.newAddressList.newAddress[0].fullAddressRoad }}</span>
            </div>
            <div class="relative flex items-center">
              <ButtonClose class="absolute right-1" @click="removeItem(point)" />
            </div>
          </div>
        </template>
      </div>
    </div>
    <ButtonA class="w-[100%] self-center" value="확인" @click="save" />
  </div>
</template>

<style scoped></style>
