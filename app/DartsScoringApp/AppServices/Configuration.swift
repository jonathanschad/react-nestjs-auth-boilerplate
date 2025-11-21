import Foundation

enum Configuration {
    // MARK: - API Configuration

    static var baseURL: String {
        // TODO: Replace with actual production URL when available
        #if DEBUG
        return "http://localhost:8080/api"
        #else
        return "https://your-production-domain.com/api"
        #endif
    }

    // MARK: - Authentication

    static var basicAuthUsername: String {
        // TODO: Replace with actual credentials
        return "your-username"
    }

    static var basicAuthPassword: String {
        // TODO: Replace with actual credentials
        return "your-password"
    }

    static var basicAuthHeader: String {
        let credentials = "\(basicAuthUsername):\(basicAuthPassword)"
        let base64Credentials = Data(credentials.utf8).base64EncodedString()
        return "Basic \(base64Credentials)"
    }
}
