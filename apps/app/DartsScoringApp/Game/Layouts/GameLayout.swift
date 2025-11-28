import SwiftUI

struct GameLayout: View {
    @ObservedObject var viewModel: GameViewModel
    @Environment(\.navigationCoordinator) private var navigationCoordinator
    
    var body: some View {
        GeometryReader { geometry in
            ZStack {
                // Main Game Layout
                IPadGameLayout(viewModel: viewModel)
                }
                
                // Victory Overlay
                if case .finished(_) = viewModel.gameState {
                    VictoryOverlay(
                        viewModel: viewModel,
                        onBackToSetup: { navigationCoordinator.endGame() },
                        screenSize: geometry.size
                    )
                }
            }
        }
    }


#Preview {
    var gameSettings = GameSettings()
    let player1 = Player(name: "Test")
    let player2 = Player(name: "Test2")
    gameSettings.player1 = player1
    gameSettings.player2 = player2
    let viewModel = GameViewModel(gameSettings: gameSettings)

    return GameLayout(viewModel: viewModel)
} 
