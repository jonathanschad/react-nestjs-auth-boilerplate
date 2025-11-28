import Foundation

enum GameState: Equatable {
    case playing
    case finished(winner: Player)
} 
