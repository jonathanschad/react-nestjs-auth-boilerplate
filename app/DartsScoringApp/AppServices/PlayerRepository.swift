import Foundation

@MainActor
class PlayerRepository: ObservableObject {
    @Published private(set) var players: [Player] = []
    @Published private(set) var isLoading = false
    @Published private(set) var error: Error?
    
    static let shared = PlayerRepository()
    private let apiClient = APIClient.shared
    
    private init() {
        Task {
            await loadPlayers()
        }
    }
    
    func loadPlayers() async {
        isLoading = true
        error = nil
        
        do {
            players = try await apiClient.fetchPlayers()
        } catch {
            self.error = error
        }
        
        isLoading = false
    }
    
    func getPlayer(withId id: String) -> Player? {
        return nil
    }
    
    func getPlayer(withName name: String) -> Player? {
        players.first { $0.name == name }
    }
    
    func sortedPlayers(by sortOption: Player.SortOption) -> [Player] {
        players.sorted(by: sortOption.comparator)
    }
} 
