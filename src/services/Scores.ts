import { CRUDService } from './types';

class Scores extends CRUDService<SnakeScore, CreateSnakeScore>{
  constructor() {
    super('lian/snake-score');
  }
}
export default new Scores();


export interface SnakeScore {
  id: number;
  alias?: string;
  score?: number;
} 

export interface CreateSnakeScore {
  alias?: string;
  score?: number;
}