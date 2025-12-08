import Foundation
import Alamofire

class GameRepository {
    static let shared = GameRepository()
    private let apiClient = APIClient.shared
    private let baseURL = Configuration.baseURL

    private var authHeaders: HTTPHeaders {
        return ["Authorization": Configuration.basicAuthHeader]
    }

    private let jsonEncoder: JSONEncoder = {
        let encoder = JSONEncoder()
        encoder.dateEncodingStrategy = .iso8601
        return encoder
    }()

    private init() {}

    func submitGameResult(
        gameId: UUID,
        gameStartTime: Date,
        playerA: GamePlayer,
        playerB: GamePlayer,
        winner: Player,
        gameSettings: GameSettings
    ) async throws {
        // Convert game data to backend format
        let visitsA = convertRoundsToVisits(rounds: playerA.rounds, playerId: playerA.player.id)
        let visitsB = convertRoundsToVisits(rounds: playerB.rounds, playerId: playerB.player.id)

        // Combine and sort visits by visit number
        let allVisits = (visitsA + visitsB).sorted { $0.visitNumber < $1.visitNumber }

        // Game end time is now
        let gameEndTime = Date()

        // Map game settings to backend format
        let gameType: String
        switch gameSettings.startingPoints {
        case ._301:
            gameType = "X301"
        case ._501:
            gameType = "X501"
        }
        
        let checkoutMode: String
        switch gameSettings.gameMode {
        case .singleOut:
            checkoutMode = "SINGLE_OUT"
        case .doubleOut:
            checkoutMode = "DOUBLE_OUT"
        }

        let gameRequest = CreateGameRequest(
            playerAId: playerA.player.id,
            playerBId: playerB.player.id,
            winnerId: winner.id,
            gameStart: gameStartTime,
            gameEnd: gameEndTime,
            type: gameType,
            checkoutMode: checkoutMode,
            visits: allVisits
        )

        // Log the request payload before sending
        print("🎮 Submitting game result:")
        print("📤 Game ID: \(gameId.uuidString)")
        print("📤 Player A: \(playerA.player.name) (\(gameRequest.playerAId))")
        print("📤 Player B: \(playerB.player.name) (\(gameRequest.playerBId))")
        print("📤 Winner: \(winner.name) (\(gameRequest.winnerId))")
        print("📤 Game Type: \(gameRequest.type)")
        print("📤 Checkout Mode: \(gameRequest.checkoutMode)")
        print("📤 Game Start: \(gameRequest.gameStart)")
        print("📤 Game End: \(gameRequest.gameEnd)")
        print("📤 Total Visits: \(gameRequest.visits.count)")
        
        // Log the JSON payload
        if let jsonData = try? jsonEncoder.encode(gameRequest),
           let jsonString = String(data: jsonData, encoding: .utf8) {
            print("📦 Request JSON:\n\(jsonString)")
        }

        return try await withCheckedThrowingContinuation { continuation in
            AF.request("\(baseURL)/dart/game/\(gameId.uuidString)",
                      method: .put,
                      parameters: gameRequest,
                      encoder: JSONParameterEncoder(encoder: jsonEncoder),
                      headers: authHeaders)
            .validate()
            .responseData { response in
                // Log the response
                print("📥 Response received:")
                print("🌐 URL: \(String(describing: response.request?.url?.absoluteString))")
                
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

    private func convertRoundsToVisits(rounds: [DartRound], playerId: String) -> [GameVisitRequest] {
        return rounds.enumerated().map { index, round in
            let dartThrows = round.dartThrows

            return GameVisitRequest(
                playerId: playerId,
                visitNumber: index,
                throw1: dartThrows.count > 0 ? dartThrows[0].number : 0,
                throw1Multiplier: dartThrows.count > 0 ? dartThrows[0].multiplier.multiplier : 1,
                throw2: dartThrows.count > 1 ? dartThrows[1].number : 0,
                throw2Multiplier: dartThrows.count > 1 ? dartThrows[1].multiplier.multiplier : 1,
                throw3: dartThrows.count > 2 ? dartThrows[2].number : 0,
                throw3Multiplier: dartThrows.count > 2 ? dartThrows[2].multiplier.multiplier : 1
            )
        }
    }
} 
