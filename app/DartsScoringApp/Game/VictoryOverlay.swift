import SwiftUI

struct VictoryOverlay: View {
    @Environment(\.navigationCoordinator) private var navigationCoordinator
    @ObservedObject var viewModel: GameViewModel
    let onBackToSetup: () -> Void
    let screenSize: CGSize
    
    private var winner: Player {
        if case .finished(let winner) = viewModel.gameState {
            return winner
        }
        fatalError("VictoryOverlay shown without winner")
    }
    
    private func submitAndFinish() {
        Task {
            viewModel.submitGameResult()
        }
        
        self.navigationCoordinator.endGame()
    }
    
    var body: some View {
        ZStack {
            if(winner.name != "Michael Haas") {
                // Blurred background with gradient
                DesignSystem.Colors.groupedBackground
                    .background(.ultraThinMaterial)
                    .ignoresSafeArea()
            }
            else if(winner.name == "Michael Haas") {
                Image("Marksman")
                    .resizable()
                    .scaledToFill()
                    .ignoresSafeArea()
            }

            // Victory content
            VStack(spacing: 0) {
                Spacer()

                if(winner.name != "Michael Haas") {
                    // Trophy icon with glow effect
                    Image(systemName: "trophy.fill")
                        .font(.system(size: 80))
                        .foregroundStyle(
                            LinearGradient(
                                colors: [.yellow, .orange],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .shadow(color: .yellow.opacity(0.3), radius: 20, x: 0, y: 0)
                        .padding(.bottom, 30)


                    // Winner name with gradient
                    Text(winner.name)
                        .font(.system(size: 48, weight: .bold))
                        .foregroundStyle(
                            LinearGradient(
                                colors: [DesignSystem.Colors.accent, DesignSystem.Colors.accent.opacity(0.7)],
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .shadow(color: DesignSystem.Colors.accent.opacity(0.3), radius: 10, x: 0, y: 0)

                    Text("HAT GEWONNEN!")
                        .font(.system(size: 24, weight: .bold))
                        .foregroundColor(DesignSystem.Colors.primary.opacity(0.8))
                        .padding(.top, 5)
                        .padding(.bottom, 40)
                }

                // Status section
                if viewModel.isSubmittingResult {
                    VStack(spacing: 15) {
                        ProgressView()
                            .controlSize(.large)
                            .tint(DesignSystem.Colors.primary)
                        Text("Speichere Ergebnis...")
                            .foregroundColor(DesignSystem.Colors.secondary)
                    }
                    .padding(.vertical, 20)
                    .frame(maxWidth: .infinity)
                    .background(Color.white.opacity(0.05))
                    .cornerRadius(15)
                    .padding(.horizontal)
                } else if let error = viewModel.submitError {
                    VStack(spacing: 15) {
                        Image(systemName: "exclamationmark.triangle.fill")
                            .font(.title)
                            .foregroundColor(DesignSystem.Colors.error)
                        Text("Fehler beim Speichern")
                            .font(.headline)
                        Text(error.localizedDescription)
                            .font(.subheadline)
                            .foregroundColor(DesignSystem.Colors.secondary)
                            .multilineTextAlignment(.center)
                            .padding(.horizontal)
                    }
                    .padding(.vertical, 20)
                    .frame(maxWidth: .infinity)
                    .background(Color.white.opacity(0.05))
                    .cornerRadius(15)
                    .padding(.horizontal)
                }
                
                Spacer()
                
                // Action buttons
                VStack(spacing: 15) {
                    if !viewModel.isSubmittingResult {
                        Button(action: submitAndFinish) {
                            HStack {
                                Image(systemName: "square.and.arrow.up.fill")
                                Text("Ergebnis Eintragen")
                            }
                            .font(.headline)
                            .foregroundColor(.blue)
                            .frame(height: 50)
                            .frame(maxWidth: .infinity)
                            .background(
                                LinearGradient(
                                    colors: [Color.white, Color.white.opacity(0.8)],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .cornerRadius(15)
                        }
                    }
                    
                    Button(action: onBackToSetup) {
                        HStack {
                            Image(systemName: "arrow.uturn.backward")
                            Text("Zurück zum Setup")
                        }
                            .font(.headline)
                            .foregroundColor(.blue)
                            .frame(height: 50)
                            .frame(maxWidth: .infinity)
                            .background(
                                LinearGradient(
                                    colors: [Color.white, Color.white.opacity(0.8)],
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .cornerRadius(15)
                    }
                }
                .padding(.horizontal)
                .padding(.bottom, 30)
            }
        }
    }
}

#Preview {
    var gameSettings = GameSettings()
    gameSettings.player1 = Player(name: "Michi")
    gameSettings.player2 = Player(name: "Michi")
    var viewModel = GameViewModel(gameSettings: gameSettings)
    viewModel.gameState = .finished(winner: Player(name: "Michael Haas"))

    return VictoryOverlay(
            viewModel: viewModel,
            onBackToSetup: {},
            screenSize: CGSizeMake(1000, 1000)
        )
} 
