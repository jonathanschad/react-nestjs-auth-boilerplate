import Foundation
import Alamofire

enum APIError: Error {
    case invalidURL
    case networkError(Error)
    case invalidResponse
    case decodingError(Error)
    case serverError(String)
}

class APIClient {
    private let baseURL = "https://dart-bot-stats-40bf895a4f48.herokuapp.com/api"
    static let shared = APIClient()
    
    private let decoder: JSONDecoder = {
        let decoder = JSONDecoder()
        // Create custom date formatter for MongoDB dates
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
        decoder.dateDecodingStrategy = .formatted(dateFormatter)
        return decoder
    }()
    
    private init() {}
    
    func fetchPlayers() async throws -> [Player] {
        return try await withCheckedThrowingContinuation { continuation in
            AF.request("\(baseURL)/players", method: .get)
                .validate()
                .responseDecodable(of: [Player].self, decoder: decoder) { response in
                    // Log the request
                    print("🌐 Request: \(String(describing: response.request?.url?.absoluteString))")
                    print("📤 Headers: \(String(describing: response.request?.allHTTPHeaderFields))")
                    
                    // Log the response
                    if let statusCode = response.response?.statusCode {
                        print("📥 Status Code: \(statusCode)")
                    }
                    
                    switch response.result {
                    case .success(let players):
                        print("✅ Successfully decoded \(players.count) players")
                        continuation.resume(returning: players)
                    case .failure(let error):
                        // Log the error details
                        print("❌ Error: \(error.localizedDescription)")
                        print("❌ Detailed Error: \(error)")
                        if let data = response.data, let serverError = String(data: data, encoding: .utf8) {
                            print("🔥 Server Error: \(serverError)")
                            continuation.resume(throwing: APIError.serverError(serverError))
                        } else {
                            print("🔥 Network Error: \(error)")
                            continuation.resume(throwing: APIError.networkError(error))
                        }
                    }
                }
        }
    }
    
    // MARK: - Helper Methods
    
    private func handleError(_ error: AFError) -> APIError {
        // Log detailed error information
        print("🚨 Alamofire Error: \(error)")
        print("🚨 Error Description: \(error.errorDescription ?? "No description")")
        print("🚨 Failure Reason: \(error.failureReason ?? "No failure reason")")
        print("🚨 Recovery Suggestion: \(error.recoverySuggestion ?? "No recovery suggestion")")
        
        switch error {
        case .responseValidationFailed(let reason):
            return .serverError("Validation failed: \(reason)")
        case .responseSerializationFailed(let reason):
            return .decodingError(error)
        default:
            return .networkError(error)
        }
    }
} 
