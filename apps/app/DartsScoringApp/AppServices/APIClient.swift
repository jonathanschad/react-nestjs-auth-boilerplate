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
    private let baseURL = Configuration.baseURL
    static let shared = APIClient()
    
    private let decoder: JSONDecoder = {
        let decoder = JSONDecoder()
        // Use custom ISO8601 date decoding that handles fractional seconds
        let formatter = ISO8601DateFormatter()
        formatter.formatOptions = [.withInternetDateTime, .withFractionalSeconds]
        decoder.dateDecodingStrategy = .custom { decoder in
            let container = try decoder.singleValueContainer()
            let dateString = try container.decode(String.self)
            
            // Try with fractional seconds first
            if let date = formatter.date(from: dateString) {
                return date
            }
            
            // Fallback to without fractional seconds
            formatter.formatOptions = [.withInternetDateTime]
            if let date = formatter.date(from: dateString) {
                return date
            }
            
            throw DecodingError.dataCorruptedError(in: container, debugDescription: "Cannot decode date string \(dateString)")
        }
        return decoder
    }()

    private var authHeaders: HTTPHeaders {
        return ["Authorization": Configuration.basicAuthHeader]
    }
    
    private init() {}
    
    func fetchPlayers() async throws -> [Player] {
        return try await withCheckedThrowingContinuation { continuation in
            AF.request("\(baseURL)/dart/player", method: .get, headers: authHeaders)
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

    func fetchGamePreview(playerAId: String, playerBId: String) async throws -> GamePreviewResponse {
        return try await withCheckedThrowingContinuation { continuation in
            AF.request("\(baseURL)/dart/game/preview/playerA/\(playerAId)/playerB/\(playerBId)",
                      method: .get,
                      headers: authHeaders)
                .validate()
                .responseDecodable(of: GamePreviewResponse.self, decoder: decoder) { response in
                    // Log the request
                    print("🎲 Game Preview Request: \(String(describing: response.request?.url?.absoluteString))")

                    // Log the response
                    if let statusCode = response.response?.statusCode {
                        print("📥 Status Code: \(statusCode)")
                    }

                    switch response.result {
                    case .success(let preview):
                        print("✅ Successfully fetched game preview")
                        continuation.resume(returning: preview)
                    case .failure(let error):
                        print("❌ Error fetching game preview: \(error.localizedDescription)")
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
