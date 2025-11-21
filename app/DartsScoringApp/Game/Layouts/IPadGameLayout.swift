import SwiftUI

struct IPadGameLayout: View {
    @ObservedObject var viewModel: GameViewModel

    var body: some View {
        HStack(spacing: 0) {
            //Left side
            VStack(spacing: 0) {
                // Player Info Section
                HStack(spacing: DesignSystem.Spacing.lg) {
                    PlayerInfoBox(
                        gamePlayer: viewModel.player1,
                        gameViewModel: viewModel,
                        color: DesignSystem.Colors.accent,
                        isActive: viewModel.currentPlayerIndex == 0
                    )

                    PlayerInfoBox(
                        gamePlayer: viewModel.player2,
                        gameViewModel: viewModel,
                        color: DesignSystem.Colors.error,
                        isActive: viewModel.currentPlayerIndex == 1
                    )
                }
                .padding(.top, DesignSystem.Spacing.lg)
                .padding(.horizontal, DesignSystem.Spacing.xl)

                // Round Log
                RoundLogView(
                    player1: viewModel.player1,
                    player2: viewModel.player2,
                    gameViewModel: viewModel,
                    currentPlayerIndex: viewModel.currentPlayerIndex
                )
                .padding(.horizontal, DesignSystem.Spacing.xl)
                .padding(.vertical, DesignSystem.Spacing.lg)
            }
            .frame(maxWidth: .infinity)

            Rectangle()
                .fill(DesignSystem.Colors.systemGray4)
                .frame(width: DesignSystem.Sizes.dividerWidth)
                .padding(.vertical, DesignSystem.Spacing.lg)

            // Right side
            VStack(spacing: 0) {
                DartKeyboardView(viewModel: viewModel)
                    .padding(.top, DesignSystem.Spacing.lg)
            }
            .frame(maxWidth: .infinity) 
            .padding(.horizontal, DesignSystem.Spacing.xl)
            .padding(.bottom, DesignSystem.Spacing.lg)
        }
    }

}

#Preview {
    var player1 = Player(name: "Hannibal")
    var player2 = Player(name: "Clemens")
    var gameSettings = GameSettings()
    gameSettings.player1 = player1
    gameSettings.player2 = player2
    var viewModel = GameViewModel(gameSettings: gameSettings)

    return IPadGameLayout(viewModel: viewModel)
}

#Preview {
    var player1 = Player(name: "Hannibal")
    var player2 = Player(name: "Clemens")
    var gameSettings = GameSettings()
    gameSettings.player1 = player1
    gameSettings.player2 = player2
    var viewModel = GameViewModel(gameSettings: gameSettings)

    return IPadGameLayout(viewModel: viewModel)
}
