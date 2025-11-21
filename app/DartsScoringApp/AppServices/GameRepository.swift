import Foundation
import Alamofire

class GameRepository {
    static let shared = GameRepository()
    private let apiClient = APIClient.shared
    private let baseURL = Configuration.baseURL

    private var authHeaders: HTTPHeaders {
        return ["Authorization": Configuration.basicAuthHeader]
    }

    private init() {}

    func submitGameResult(
        gameId: UUID,
        playerA: GamePlayer,
        playerB: GamePlayer,
        winner: Player
    ) async throws {
        // Convert game data to backend format
        let turnsA = convertRoundsToTurns(rounds: playerA.rounds, playerId: playerA.player.id)
        let turnsB = convertRoundsToTurns(rounds: playerB.rounds, playerId: playerB.player.id)

        // Combine and sort turns by turn number
        let allTurns = (turnsA + turnsB).sorted { $0.turnNumber < $1.turnNumber }

        let gameRequest = CreateGameRequest(
            playerAId: playerA.player.id,
            playerBId: playerB.player.id,
            winnerId: winner.id,
            turns: allTurns
        )

        return try await withCheckedThrowingContinuation { continuation in
            AF.request("\(baseURL)/dart/game/\(gameId.uuidString)",
                      method: .put,
                      parameters: gameRequest,
                      encoder: JSONParameterEncoder.default,
                      headers: authHeaders)
            .validate()
            .responseData { response in
                // Log the request
                print("🎮 Submitting game result:")
                print("🌐 URL: \(String(describing: response.request?.url?.absoluteString))")
                print("📤 Game ID: \(gameId.uuidString)")
                print("📤 Player A: \(playerA.player.name) (\(playerA.player.id))")
                print("📤 Player B: \(playerB.player.name) (\(playerB.player.id))")
                print("📤 Winner: \(winner.name) (\(winner.id))")
                print("📤 Total Turns: \(allTurns.count)")

                // Log the response
                if let statusCode = response.response?.statusCode {
                    print("📥 Status Code: \(statusCode)")
                }

                if let data = response.data, let json = try? JSONSerialization.jsonObject(with: data) {
                    print("📦 Response: \(json)")
                }

                switch response.result {
                case .success:
                    print("✅ Game result submitted successfully")
                    continuation.resume()
                case .failure(let error):
                    print("❌ Error submitting game result: \(error)")
                    if let data = response.data, let serverError = String(data: data, encoding: .utf8) {
                        print("🔥 Server Error: \(serverError)")
                        continuation.resume(throwing: APIError.serverError(serverError))
                    } else {
                        continuation.resume(throwing: APIError.networkError(error))
                    }
                }
            }
        }
    }

    private func convertRoundsToTurns(rounds: [DartRound], playerId: String) -> [GameTurnRequest] {
        return rounds.enumerated().map { index, round in
            let dartThrows = round.dartThrows

            return GameTurnRequest(
                playerId: playerId,
                turnNumber: index,
                throw1: dartThrows.count > 0 ? dartThrows[0].number : nil,
                throw1Multiplier: dartThrows.count > 0 ? dartThrows[0].multiplier.multiplier : nil,
                throw2: dartThrows.count > 1 ? dartThrows[1].number : nil,
                throw2Multiplier: dartThrows.count > 1 ? dartThrows[1].multiplier.multiplier : nil,
                throw3: dartThrows.count > 2 ? dartThrows[2].number : nil,
                throw3Multiplier: dartThrows.count > 2 ? dartThrows[2].multiplier.multiplier : nil
            )
        }
    }
} 
