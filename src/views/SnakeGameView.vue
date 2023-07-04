
<script setup lang="ts">
import { AppButton } from '@/components/app';
import { ref } from 'vue';

/** GAME SETTINGS */

const X_BOUNDS = 40;
const Y_BOUNDS = 20;
const X_AXIS = ['l', 'r'];
const Y_AXIS = ['t', 'b'];
const moveSpeed = ref(200);
const INITIAL_SNEK = [
  { x: 1, y:2 },
  { x: 2, y:2 },
  { x: 3, y:2 },
];



function resetGame() {
  moveId.value && clearInterval(moveId.value);
  snakeDirection.value = 'l';
  snake.value = [...INITIAL_SNEK];
  isSnakeDead.value = false;
  food.value = [];
  moveSnek();
}

function pauseGame(pause = moveId.value !== null) {
  if (pause && moveId.value) {
    clearInterval(moveId.value);
    moveId.value = null;
  } else {
    moveSnek()
  }
}


/** Snake Logic */

const snake = ref([...INITIAL_SNEK]);
const isSnakeDead = ref(false);

type Directions = 'l' | 'r' | 'b' | 't';
  
const snakeDirection = ref<Directions>('r');

const moveId = ref<NodeJS.Timer | null>(null);


function moveSnek() {
  moveId.value = setInterval(()=>{
    let newSnakeHead = { x: 0, y: 0, ...[...snake.value].pop() };
    
    // Moving X
    if (X_AXIS.includes(snakeDirection.value)) {
      newSnakeHead.x = snakeDirection.value == 'l'
        ? (newSnakeHead.x || (X_BOUNDS + 1)) - 1
        : (newSnakeHead.x === X_BOUNDS ? 0 : newSnakeHead.x) + 1;
    } 
    // Moving Y
    else if (Y_AXIS.includes(snakeDirection.value)) {
      newSnakeHead.y = snakeDirection.value === 't'
        ? (newSnakeHead.y || (Y_BOUNDS + 1)) - 1
        : (newSnakeHead.y === Y_BOUNDS ? 0 : newSnakeHead.y) + 1;
    } 
    // Moving Wrong
    else {
      console.log('Moving Incorrectly');
    }
    
    // Eat Self
    if (snake.value.some(({ x, y})=>newSnakeHead.x === x && newSnakeHead.y === y)) {
      isSnakeDead.value = true;
      pauseGame(true);
    }
    // Eat Food
    const hasFood = eatFood(newSnakeHead);
    if (!hasFood) {
      snake.value.shift();
    }
    snake.value.push(newSnakeHead);
  }, moveSpeed.value)
}


function isMovingSameBound(direction: Directions) {
  if (X_AXIS.includes(direction)) {
    return X_AXIS.includes(snakeDirection.value);
  } else if (Y_AXIS.includes(direction)) {
    return Y_AXIS.includes(snakeDirection.value);
  } else {
    return false;
  }
}

function changeDirection(direction: Directions) {
  if (isMovingSameBound(direction)) return;
  else snakeDirection.value = direction;
}

function onKeypressHandler(e: KeyboardEvent) {
  switch(e.key) {
    case 'ArrowRight':
      return changeDirection('r');
    case 'ArrowLeft':
      return changeDirection('l');
    case 'ArrowUp':
      return changeDirection('t');
    case 'ArrowDown':
      return changeDirection('b');
  }
}

moveSnek();


/** Eating Logic */

const food = ref([
  { x: 10, y: 10}
])

function eatFood(coords: { x: number, y: number }) {
  const foodI = [...food.value].findIndex(({ x, y })=>x === coords.x && y === coords.y)
  if (typeof foodI !== 'number' || foodI < 0) return false;
  
  food.value.splice(foodI, 1);

  return true;
}


function spawnFood() {
  const newFood = {
    y: Math.floor(Math.random()*Y_BOUNDS),
    x: Math.floor(Math.random()*X_BOUNDS),

  }
  if (snake.value.some(({x,y})=>x === newFood.x && y === newFood.y )) return;

  food.value.push(newFood);
}

setInterval(()=>spawnFood(), 3000);
</script>

<template>
  <div 
    class="
      md:px-20 md:py-12 
      h-full 
      flex flex-col gap-5
      bg-zinc-900
    "
  >
    <!-- Header -->
    <div class="flex justify-between">
      <h3 
        class="text-center text-3xl text-pink-200  drop-shadow-[]" 
        style=" text-shadow: 1px 1px 1px #ff5555ee, -1px -1px 1px #ff5555ee, -1px 1px 1px #ff5555ee, 1px -1px 1px #ff5555ee, 1px 0px 20px hotpink"
      >
        Snake Game <span class="ml-2 text-sm font-serif">( But Neon )</span>
      </h3>
      <AppButton variant="outline" class="font-serif" @click="pauseGame">
        {{ moveId !== null ? 'Pause' : 'Start' }}
      </AppButton>
    </div>
    
    <!-- Snake Bounds -->
    <div 
      tabindex="0"
      class="relative cursor-pointer h-full w-full border-2 border-pink-500 shadow-green-500" 
      style="box-shadow: 0px 0px 20px red, inset   0px 0px 10px red;"
      @keydown="onKeypressHandler"

    > 
      <div v-if="isSnakeDead" class="absolute top-0 left-0 backdrop-blur-lg z-50 h-full w-full flex flex-col items-center justify-center gap-3">
        <h1 
          class="text-5xl"
          style=" text-shadow: 1px 1px 1px #ff5555ee, -1px -1px 1px #ff5555ee, -1px 1px 1px #ff5555ee, 1px -1px 1px #ff5555ee, 1px 0px 20px hotpink"
        >
          Game Over
        </h1>
        <AppButton  class="font-serif"  @click="resetGame">Play Again</AppButton>
      </div>
      <table class="border bg-white/10 w-full h-full text-white">
        <tbody>
          <tr
            v-for="yLength in Y_BOUNDS"
            :key="yLength + 'y'"
          >
            <td
              v-for="xLength in X_BOUNDS"
              :key="xLength + 'x'" 
              class="border border-white/0"
              :class="{
                'bg-green-600 rounded-full': food.some(({x, y})=>x === xLength && y === yLength),
                'bg-pink-400': snake.some(({x, y})=>x === xLength && y === yLength),
              }"
              :style="
                snake.some(({x, y})=>x === xLength && y === yLength) 
                  ? 'box-shadow: 0px 0px 20px red;' 
                  : food.some(({x, y})=>x === xLength && y === yLength) 
                    ? 'box-shadow: 0px 0px 30px green;'
                    : ''"
            >
              <!-- <div class="w-full aspect-square"></div> -->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
