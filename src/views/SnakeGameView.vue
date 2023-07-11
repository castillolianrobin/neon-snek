
<script setup lang="ts">
import { AppButton } from '@/components/app';
import { ref, computed } from 'vue';
import { useIntervalFn, useVibrate  } from '@vueuse/core'


/** GAME SETTINGS */

const X_BOUNDS = 15;
const Y_BOUNDS = 15;
const X_AXIS = ['l', 'r'];
const Y_AXIS = ['t', 'b'];
const INITIAL_SNEK = [
  { x: 1, y:2 },
  { x: 2, y:2 },
  { x: 3, y:2 },
];
const INITIAL_SNEK_DIRECTION: Directions = 'r';



function resetGame() {
  score.value = 0;
  food.value = [];
  snake.value = [...INITIAL_SNEK];
  snakeDirection.value = INITIAL_SNEK_DIRECTION;
  isSnakeDead.value = false;
  pauseGame(true);
  boundsFocused.value = false;
}

function pauseGame(pause = !snakeMovement.isActive.value) {
  if (pause) {
    snakeMovement.pause()
    foodSpawning.pause()
  } else {
    snakeMovement.resume()
    foodSpawning.resume()
  }
}


/** Snake Logic */

const boundsFocused = ref(false);
const snake = ref([...INITIAL_SNEK]);
const isSnakeDead = ref(false);

type Directions = 'l' | 'r' | 'b' | 't';
  
const snakeDirectionNew = ref<Directions | null>(null);
const snakeDirection = ref<Directions>(INITIAL_SNEK_DIRECTION);


function getMultiplier(value: number, division: number) {
  const totalScore = X_BOUNDS*Y_BOUNDS;
  // const level = totalScore/division;
  const levelMultiplier = Math.floor((value/totalScore)*100);
  return Math.ceil(division*(levelMultiplier/100));
}
const moveSpeed = computed(()=>200/getMultiplier(snake.value.length, 3));

function moveSnake() {
  let newSnakeHead = { x: 0, y: 0, ...[...snake.value].pop() };
  if (snakeDirectionNew.value !== null) {
    snakeDirection.value = snakeDirectionNew.value;
    snakeDirectionNew.value = null;
  }
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
} 

const snakeMovement = useIntervalFn(moveSnake, moveSpeed)


function isMovingSameBound(direction: Directions) {
  if (X_AXIS.includes(direction)) {
    return X_AXIS.includes(snakeDirection.value);
  } else if (Y_AXIS.includes(direction)) {
    return Y_AXIS.includes(snakeDirection.value);
  } else {
    return false;
  }
}

const { vibrate: keypressVibrate } = useVibrate({ pattern: [ 50 ] })
function changeDirection(direction: Directions) {
  if (isMovingSameBound(direction)) return;
  
  keypressVibrate();
  snakeDirectionNew.value = direction;
}

function onKeypressHandler(e: KeyboardEvent) {
  switch(e.key) {
    case 'ArrowRight': case 'D': case 'd':
      return changeDirection('r');
    case 'ArrowLeft': case 'A': case 'a':
      return changeDirection('l');
    case 'ArrowUp': case 'W': case 'w':
      return changeDirection('t');
    case 'ArrowDown': case 'S': case 's':
      return changeDirection('b');
  }
}

/** Snake Movement Mobile */


const arrowControls = [
  // Up
  {
    keyCode: 'ArrowUp',
    htmlCode: '&#x25B2;',
    class: 'col-start-2',
    onClick: ()=>changeDirection('t'),
  },
  // Left
  {
    keyCode: 'ArrowLeft',
    htmlCode: '&#9664;',
    class: 'row-start-2 col-start-1',
    onClick: ()=>changeDirection('l'),
  },
  // Right
  {
    keyCode: 'ArrowRight',
    htmlCode: '&#9654;',
    class: 'row-start-2 col-start-3',
    onClick: ()=>changeDirection('r'),
  },
  // Down
  {
    keyCode: 'ArrowDown',
    htmlCode: '&#x25BC;',
    class: 'row-start-3 col-start-2',
    onClick: ()=>changeDirection('b'),
  },
];

/** Snake Helper */

function isSnakeBody(x: number, y: number) {
  return snake.value.some((coord)=>x === coord.x && y === coord.y)
}

function isSnakeHead(x: number, y: number) {
  const snakeHeadCoord = [...snake.value].pop();
  return snakeHeadCoord?.x === x && snakeHeadCoord.y === y;
}



/** Eating Logic */

const food = ref([
  { x: 10, y: 10}
])
const score = ref(0);

const { vibrate: eatVibrate } = useVibrate({ pattern: [ 100 ] })
function eatFood(coords: { x: number, y: number }) {
  const foodI = [...food.value].findIndex(({ x, y })=>x === coords.x && y === coords.y)
  if (typeof foodI !== 'number' || foodI < 0) return false;
  
  food.value.splice(foodI, 1);
  score.value += 1;
  eatVibrate();
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
const foodSpeed = computed(()=>2000/getMultiplier(snake.value.length, 5))
const foodSpawning = useIntervalFn(spawnFood, foodSpeed);


/** Food Helper */

function isFood(x: number, y: number) {
  return food.value.some((coord)=>x === coord.x && y === coord.y)
}

function isEmpty(x: number, y: number) {
  return !isFood(x, y) && !isSnakeBody(x, y) && !isSnakeHead(x, y) 
}



pauseGame(true);
</script>

<template>
  <div 
    class="
      p-5 md:px-20 md:py-12 
      h-full 
      flex flex-col gap-5 items-center justify-center 
      bg-zinc-800
      overflow-auto
      bg-blend-overlay
      bg-[url('https://preview.redd.it/imkv74m4q5g41.png?auto=webp&s=81c7eeea375a30ad48a907c2ac913e0395f5cc5a')]
    "
  >
    
    <!-- Snake Bounds -->
    <div 
      tabindex="0"
      class="
        select-none
        outline-none
        h-full w-full 
        flex flex-col items-center justify-center gap-5
      " 
      @focus="boundsFocused = true, pauseGame(false)"
      @keydown="onKeypressHandler"
    > 
      
      <!-- Header -->
      <div class="w-full flex items-center justify-center gap-10">
        <h3 
          class="text-center text-3xl text-primary-200  drop-shadow-[]" 
          style=" text-shadow: 1px 1px 1px #ff5555ee, -1px -1px 1px #ff5555ee, -1px 1px 1px #ff5555ee, 1px -1px 1px #ff5555ee, 1px 0px 20px hotpink"
        >
          Snake Game
        </h3>
        <p class="text-white text-sm">
          Snake Length: <span class="ml-1 font-bold text-yellow-300">{{ score }}</span> {{ moveSpeed }}
        </p>
        <AppButton v-if="false" variant="outline" class="font-serif" @click="pauseGame(snakeMovement.isActive.value)">
          {{ snakeMovement.isActive.value ? 'Pause' : 'Start' }}
        </AppButton>
      </div>

      <!-- Snake Area -->
      <div 
        class="
          p-1
          aspect-square 
          relative
          cursor-pointer
          w-full md:w-fit md:h-full
          border-2
          border-primary-300 
          shadow-green-500 
          bg-indigo-900
          bg-blend-difference
          bg-[url('https://preview.redd.it/imkv74m4q5g41.png?auto=webp&s=81c7eeea375a30ad48a907c2ac913e0395f5cc5a')]
        "
        style="
          box-shadow: 0px 0px 20px red, inset   0px 0px 10px red;
        "
      > 
        <!-- Game Starter -->
        <div
          v-if="!boundsFocused" 
          class="
            absolute top-0 left-0 
            backdrop-blur 
            z-50 h-full 
            w-full flex 
            flex-col 
            items-center 
            justify-center gap-3
            text-white
            text-center
          "  
        >
          <p class="bg-zinc-900 p-1 hidden md:block">Controls: <span class="ml-1 text-sm">Use Arrow Keys/ WASD to Control the snake</span></p>
          <button>
            <span class="md:hidden">Tap</span>
            <span class="hidden md:inline">Click</span>
            here To start 
          </button>
        </div>

        <!-- Game Over -->
      <div 
        v-if="isSnakeDead" 
        class="
          absolute top-0 left-0 
          backdrop-blur-lg 
          z-50 h-full w-full flex 
          flex-col 
          items-center 
          justify-center gap-3
          text-red-500
        "
      >
        <h1 
          class="text-5xl"
          style=" text-shadow: 1px 1px 1px #ff5555ee, -1px -1px 1px #ff5555ee, -1px 1px 1px #ff5555ee, 1px -1px 1px #ff5555ee, 1px 0px 20px hotpink"
        >
          Game Over
        </h1>
        <AppButton  @click="resetGame">Play Again</AppButton>
      </div>

        <!-- Snake Area -->
        <table class="h-full w-full text-white">
          <tbody>
            <tr
              v-for="yLength in Y_BOUNDS"
              :key="yLength + 'y'"
            >
              <td
                v-for="xLength in X_BOUNDS"
                :key="xLength + 'x'" 
                class="aspect-square md:p-0.5 border border-gray-500/5"
              >
                <div
                  class="relative w-full aspect-square border-2 md:border-4"
                  :class="{
                    'border-transparent': isEmpty(xLength, yLength),
                    'bg-pink-700 border-primary-300 md:rounded': isFood(xLength, yLength),
                    'border-green-400 rounded md:rounded-lg': isSnakeBody(xLength, yLength) && !isSnakeHead(xLength, yLength),
                    'border-yellow-300': isSnakeHead(xLength, yLength),
                    'rounded-r-xl md:rounded-r-2xl': isSnakeHead(xLength, yLength) && snakeDirection === 'r',
                    'rounded-t-xl md:rounded-t-2xl': isSnakeHead(xLength, yLength) && snakeDirection === 't',
                    'rounded-b-xl md:rounded-b-2xl': isSnakeHead(xLength, yLength) && snakeDirection === 'b',
                    'rounded-l-xl md:rounded-l-2xl': isSnakeHead(xLength, yLength) && snakeDirection === 'l',
                  }"
                  :style="
                    isSnakeHead(xLength, yLength)
                      ? 'box-shadow: 0px 0px 10px yellow, inset 0px 0px 10px yellow;' 
                      : isSnakeBody(xLength, yLength) 
                        ? 'box-shadow: 0px 0px 15px green, inset 0px 0px 15px green;' 
                        : isFood(xLength, yLength) 
                          ? 'box-shadow: 0px 0px 30px red;'
                          : ''"  
                >
                  <!-- Snake Eyes -->
                  <div 
                    v-if="isSnakeHead(xLength, yLength)" 
                    class="
                      flex items-center justify-center 
                      text-yellow-400 text-2xl font-extrabold 
                      absolute h-full w-full 
                    "
                    :class="{
                      'rotate-90': ['b','t'].includes(snakeDirection)
                    }"
                  >
                    :
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Mobile Controls -->
      <div class="my-auto w-full md:sr-only flex justify-center">
        <div class="
          w-2/3 
          aspect-square
          grid grid-cols-3 grid-rows-3 gap-5  
          border border-white/25 rounded-full
          "
        >
          <!-- Arrow buttons -->
          <button 
            v-for="arrCtrl in arrowControls"
            :key="arrCtrl.keyCode"
            v-html="arrCtrl.htmlCode"
            :class="arrCtrl.class"
            class="
              border-4 border-green-200 rounded-xl 
              flex items-center justify-center 
              text-green-200
              active:bg-red-500
            "
            style="box-shadow: 0px 0px 15px green, inset   0px 0px 15px green;"
            @click="arrCtrl.onClick"
          ></button>
        </div>
      </div>
    </div>
  </div>
</template>
