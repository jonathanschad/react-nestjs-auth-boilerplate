import Foundation
import Alamofire

struct GameResult: Encodable {
    let winner: String
    let loser: String
    let format: GameFormat
    
    struct GameFormat: Encodable {
        let type: String
        let legs: Int
        
        init(startingPoints: StartingPoints, legs: Int = 1) {
            self.type = startingPoints.displayName
            self.legs = legs
        }
    }
}

class GameRepository {
    static let shared = GameRepository()
    private let apiClient = APIClient.shared
    private let baseURL = "https://dart-bot-stats-40bf895a4f48.herokuapp.com/api"
    
    private init() {}
    
    func submitGameResult(winner: Player, loser: Player, startingPoints: StartingPoints) async throws {
        let gameResult = GameResult(
            winner: winner.name,
            loser: loser.name,
            format: GameResult.GameFormat(startingPoints: startingPoints)
        )
        
        return try await withCheckedThrowingContinuation { continuation in
            AF.request("\(baseURL)/games",
                      method: .post,
                      parameters: gameResult,
                      encoder: JSONParameterEncoder.default)
            .validate()
            .responseData { response in
                // Log the request
                print("🎮 Submitting game result:")
                print("🌐 URL: \(String(describing: response.request?.url?.absoluteString))")
                print("📤 Request Body: \(String(describing: gameResult))")
                
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
} 
