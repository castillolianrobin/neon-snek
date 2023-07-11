
<script setup lang="ts">
import { AppButton } from '@/components/app';
import { ref, computed } from 'vue';
import { useIntervalFn } from '@vueuse/core'
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
  food.value = [];
  snake.value = [...INITIAL_SNEK];
  snakeDirection.value = INITIAL_SNEK_DIRECTION;
  isSnakeDead.value = false;
  pauseGame(false);
}

function pauseGame(pause = !snakeMovement.isActive.value) {
  if (pause) {
    snakeMovement.pause()
    foodSpawning.pause()
  } else {
    snakeMovement.resume()
    foodSpawning.resume()
    // moveSnek()
  }
}


/** Snake Logic */

const snake = ref([...INITIAL_SNEK]);
const isSnakeDead = ref(false);

type Directions = 'l' | 'r' | 'b' | 't';
  
const snakeDirection = ref<Directions>(INITIAL_SNEK_DIRECTION);


const moveSpeed = computed(()=>200/(snake.value.length/4));

const snakeMovement = useIntervalFn(()=>{
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
}, moveSpeed)


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

function isSnakeBody(coord: { x: number, y: number}) {
  return snake.value.some(({x, y})=>x === coord.x && y === coord.y)
}

function isSnakeHead(coord: { x: number, y: number}) {
  const snakeHeadCoord = [...snake.value].pop();
  return snakeHeadCoord?.x === coord.x && snakeHeadCoord.y === coord.y;
}


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

const foodSpawning = useIntervalFn(spawnFood, 3000);


/** Food Helper */

function isFood(coord: { x: number, y: number}) {
  return food.value.some(({x, y})=>x === coord.x && y === coord.y)
}

</script>

<template>
  <div 
    class="
      p-5 md:px-20 md:py-12 
      h-full 
      flex flex-col gap-5
      bg-zinc-900
      overflow-auto
      bg-blend-overlay
      bg-[url('https://preview.redd.it/imkv74m4q5g41.png?auto=webp&s=81c7eeea375a30ad48a907c2ac913e0395f5cc5a')]
    "
  >
    <!-- Header -->
    <div class="flex justify-center gap-5 ">
      <h3 
        class="text-center text-3xl text-pink-200  drop-shadow-[]" 
        style=" text-shadow: 1px 1px 1px #ff5555ee, -1px -1px 1px #ff5555ee, -1px 1px 1px #ff5555ee, 1px -1px 1px #ff5555ee, 1px 0px 20px hotpink"
      >
        Snake Game
      </h3>
      <AppButton variant="outline" class="font-serif" @click="pauseGame(snakeMovement.isActive.value)">
        {{ snakeMovement.isActive.value ? 'Start' : 'Pause' }}
      </AppButton>
    </div>
    
    <!-- Snake Bounds -->
    <div 
      class="
        relative 
        select-none 
        h-full w-full 
        flex flex-col items-center justify-center gap-5
      " 
      @keydown="onKeypressHandler"

    > 
      <!-- Game Over -->
      <div 
        v-if="isSnakeDead" 
        class="
          absolute top-0 left-0 
          backdrop-blur-lg 
          z-50 h-full 
          w-full flex 
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
      <div 
        tabindex="0"
        class="
          aspect-square
          cursor-pointer
          w-full md:w-fit md:h-full 
      
          border-2
          border-pink-500 
          shadow-green-500 
          bg-indigo-900
          bg-blend-difference
          bg-[url('https://preview.redd.it/imkv74m4q5g41.png?auto=webp&s=81c7eeea375a30ad48a907c2ac913e0395f5cc5a')]
        "
        style="
          box-shadow: 0px 0px 20px red, inset   0px 0px 10px red;
        "
      >
        <table class="w-full text-white">
          <tbody class="">
            <tr
              v-for="yLength in Y_BOUNDS"
              :key="yLength + 'y'"
            >
              <td
                v-for="xLength in X_BOUNDS"
                :key="xLength + 'x'" 
                class="aspect-square md:p-0.5"
              >
                <div 
                  class="relative w-full aspect-square border-2 md:border-4 border-white/0"
                  :class="{
                    'bg-green-700 border-green-200 md:rounded': isFood({ x: xLength, y: yLength }),
                    'border-pink-300 rounded md:rounded-lg': isSnakeBody({ x: xLength, y: yLength }),
                    'border-yellow-300': isSnakeHead({ x: xLength, y: yLength }),
                    'rounded-r-xl md:rounded-r-2xl': isSnakeHead({ x: xLength, y: yLength }) && snakeDirection === 'r',
                    'rounded-t-xl md:rounded-t-2xl': isSnakeHead({ x: xLength, y: yLength }) && snakeDirection === 't',
                    'rounded-b-xl md:rounded-b-2xl': isSnakeHead({ x: xLength, y: yLength }) && snakeDirection === 'b',
                    'rounded-l-xl md:rounded-l-2xl': isSnakeHead({ x: xLength, y: yLength }) && snakeDirection === 'l',
                  }"
                  :style="
                    isSnakeBody({ x: xLength, y: yLength }) 
                      ? 'box-shadow: 0px 0px 15px red, inset 0px 0px 15px red;' 
                      : isFood({ x: xLength, y: yLength }) 
                        ? 'box-shadow: 0px 0px 30px green;'
                        : ''"  
                >
                  <!-- Snake Eyes -->
                  <div 
                    v-if="isSnakeHead({ x: xLength, y: yLength })" 
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
        <div class="w-1/2 aspect-square gap-2  grid grid-cols-3 grid-rows-3 border border-white/25 rounded-full">
          <!-- Arrow buttons -->
          <button 
            v-for="arrCtrl in arrowControls"
            :key="arrCtrl.keyCode"
            v-html="arrCtrl.htmlCode"
            :class="arrCtrl.class"
            class="
              border-4 border-green-200 rounded-lg 
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
