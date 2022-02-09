import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(title: string): Promise<Game[]> {
    const games = await this.repository
      .createQueryBuilder('game')
      .where('LOWER(game.title) like :title', { 
        title: `%${title.toLocaleLowerCase()}%` 
      })
      .getMany() as Game[];

    return games; 
  }

  async countAllGames(): Promise<[{ count: string }]> {
    const count = await this.repository.query('SELECT COUNT(*) FROM games');

    return count;
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    const game = await this.repository.createQueryBuilder('game').where('game.id = :id', { id }).getOne() as Game;

    const users = await this.repository
      .createQueryBuilder()
      .relation(Game, 'users')
      .of(game)
      .loadMany() as User[];

    return users;  
  }
}
