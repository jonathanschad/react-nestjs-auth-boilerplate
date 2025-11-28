import SwiftUI

struct GameView: View {
    @StateObject private var viewModel: GameViewModel
    @ObservedObject private var soundManager = SoundManager.shared
    @Environment(\.navigationCoordinator) private var navigationCoordinator
    
    init(gameSettings: GameSettings) {
        // Ensure the ViewModel is created only once with stable settings
        let settings = gameSettings // Create a local copy
        self._viewModel = StateObject(wrappedValue: GameViewModel(gameSettings: settings))
    }
    
    // Prevent view from being destroyed during navigation
    private var shouldPreventDeinit: Bool {
        true
    }
    
    var body: some View {
        GeometryReader { geometry in
            VStack {
                GameLayout(viewModel: viewModel)
                .navigationBarBackButtonHidden(true)
                .toolbar {
                    ToolbarItem(placement: .navigationBarLeading) {
                        Button("Spiel Beenden") {
                            viewModel.requestEndGame()
                        }
                        .foregroundColor(DesignSystem.Colors.error)
                    }

                    ToolbarItem(placement: .navigationBarTrailing) {
                        HStack(spacing: DesignSystem.Spacing.lg) {
                            // Switch Starting Player Button (only visible before first throw)
                            if viewModel.player1.dartThrows.isEmpty && viewModel.player2.dartThrows.isEmpty {
                                Button(action: {
                                    viewModel.switchStartingPlayer()
                                }) {
                                    Image(systemName: "arrow.left.arrow.right")
                                        .foregroundColor(DesignSystem.Colors.accent)
                                }
                            }

                            // Sound Toggle
                            Button(action: {
                                soundManager.toggleSound()
                            }) {
                                Image(systemName: soundManager.isSoundEnabled ? "speaker.2.fill" : "speaker.slash.fill")
                                    .foregroundColor(soundManager.isSoundEnabled ? DesignSystem.Colors.accent : DesignSystem.Colors.disabled)
                                    .frame(minWidth: 30)
                            }
                            .padding(DesignSystem.Spacing.sm)
                        }
                        .padding(.horizontal, DesignSystem.Spacing.md)
                    }
                }
                .alert("Spiel Beenden?", isPresented: $viewModel.shouldEndGame) {
                    Button("Abbrechen", role: .cancel) {
                        viewModel.resetNavigationFlags()
                    }
                    Button("Beenden", role: .destructive) {
                        navigationCoordinator.endGame()
                        viewModel.resetNavigationFlags()
                    }
                } message: {
                    Text("Möchtest du das Spiel wirklich beenden?")
                }
                .overlay {
                    if viewModel.showingGameFinished {
                        VictoryOverlay(
                            viewModel: viewModel,
                            onBackToSetup: {
                                navigationCoordinator.endGame()
                            },
                            screenSize: geometry.size
                        )
                    }
                }
        }
        }
    }
}

#Preview {
    NavigationStack {
        var gameSettings = GameSettings()
        let player1 = Player(name: "Test")
        let player2 = Player(name: "Test2")
        gameSettings.player1 = player1
        gameSettings.player2 = player2
        return GameView(gameSettings: gameSettings)
    }
} 
