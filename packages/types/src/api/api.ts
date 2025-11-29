import { GameController } from './game/game.dto';
import { PlayerController } from './player/player.dto';
import { RankingController } from './ranking/ranking.dto';

export type Api = {
    dart: {
        game: GameController;
        rankings: RankingController;
        player: PlayerController;
    };
};

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

type ApiEndpoint<Request, Response, Method extends ApiMethod> = {
    request: Request;
    response: Response;
    method: Method;
};

export type ApiGetEndpoint<Request, Response> = ApiEndpoint<Request, Response, 'GET'>;

export type ApiPostEndpoint<Request, Response> = ApiEndpoint<Request, Response, 'POST'>;

export type ApiPutEndpoint<Request, Response> = ApiEndpoint<Request, Response, 'PUT'>;

export type ApiDeleteEndpoint<Request, Response> = ApiEndpoint<Request, Response, 'DELETE'>;
