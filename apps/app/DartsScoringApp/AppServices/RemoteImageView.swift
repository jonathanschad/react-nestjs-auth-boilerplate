import SwiftUI
import Alamofire

/// A view that asynchronously loads and displays an image from the backend file API
struct RemoteImageView: View {
    let fileId: String?
    let placeholder: Image
    let size: CGSize
    
    @State private var loadedImage: UIImage?
    @State private var isLoading = false
    @State private var loadError = false
    
    private var imageURL: String? {
        guard let fileId = fileId else { return nil }
        // Remove /api suffix from baseURL and add file endpoint
        let baseURL = Configuration.baseURL.replacingOccurrences(of: "/api", with: "")
        return "\(baseURL)/api/file/\(fileId)"
    }
    
    var body: some View {
        Group {
            if let image = loadedImage {
                Image(uiImage: image)
                    .resizable()
                    .aspectRatio(contentMode: .fill)
                    .frame(width: size.width, height: size.height)
                    .clipShape(Circle())
            } else {
                placeholder
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: size.width, height: size.height)
            }
        }
        .onAppear {
            loadImage()
        }
        .onChange(of: fileId) { _ in
            loadImage()
        }
    }
    
    private func loadImage() {
        guard let urlString = imageURL, !isLoading else { return }
        
        isLoading = true
        loadError = false
        
        AF.request(urlString, method: .get, headers: ["Authorization": Configuration.basicAuthHeader])
            .validate()
            .responseData { response in
                isLoading = false
                
                switch response.result {
                case .success(let data):
                    if let image = UIImage(data: data) {
                        self.loadedImage = image
                    } else {
                        print("❌ Failed to decode image from data")
                        self.loadError = true
                    }
                case .failure(let error):
                    print("❌ Failed to load profile picture: \(error.localizedDescription)")
                    self.loadError = true
                }
            }
    }
}

#Preview {
    RemoteImageView(
        fileId: nil,
        placeholder: Image(systemName: "person.fill"),
        size: CGSize(width: 100, height: 100)
    )
}
