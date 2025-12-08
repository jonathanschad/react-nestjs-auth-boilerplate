import SwiftUI

struct DartKeyboardView: View {
    @ObservedObject var viewModel: GameViewModel

    var body: some View {
        GeometryReader { geometry in
            VStack(spacing: DesignSystem.Spacing.md ) {
                // Header mit aktuellem Spieler und Würfen
                VStack(spacing: DesignSystem.Spacing.sm) {
                    Text("\(viewModel.currentPlayer.player.name) ist dran")
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(DesignSystem.Colors.primary)

                    Text("\(3 - viewModel.currentThrowInTurn) Würfe übrig")
                        .font(.subheadline)
                        .foregroundColor(DesignSystem.Colors.secondary)
                }

                // Multiplier Section - Nur Double und Triple
                MultiplierSection(viewModel: viewModel)

                // Numbers Grid - 5x4 Layout für größere Buttons
                LazyVGrid(columns: Array(repeating: GridItem(.flexible(), spacing: DesignSystem.Spacing.md), count: 5), spacing: DesignSystem.Spacing.md) {
                    ForEach(1...20, id: \.self) { number in
                        DartNumberButton(
                            number: number,
                            action: { viewModel.makeThrow(number) },
                            multiplier: viewModel.selectedMultiplier,
                        )
                        .aspectRatio(1,contentMode: .fit)

                    }
                }
                .frame(maxHeight: geometry.size.height * 0.8)

                // Bottom Row - 25, Miss, No Score
                HStack(spacing: DesignSystem.Spacing.lg) {
                    // 25 Button
                    DartSpecialButton(
                        action: { viewModel.makeThrow(25) },
                        title: viewModel.selectedMultiplier == .double ? "D25" : "25",
                        subtitle: viewModel.selectedMultiplier == .double ? "50" : nil,
                        systemImage: nil,
                        backgroundColor: DesignSystem.Colors.systemGray6,
                        textColor: DesignSystem.Colors.primary,
                        strokeColor: DesignSystem.Colors.systemGray4,
                        disabled: false
                    )

                    // Miss Button
                    DartSpecialButton(
                        action: { viewModel.makeMiss() },
                        title: "",
                        subtitle: "Miss",
                        systemImage: "xmark",
                        backgroundColor: DesignSystem.Colors.error,
                        textColor: Color(.white),
                        strokeColor: DesignSystem.Colors.error.opacity(0.2),
                        disabled: false
                    )

                    // No Score Button
                    DartSpecialButton(
                        action: { viewModel.makeNoScore() },
                        title: "0",
                        subtitle: "No Score",
                        systemImage: nil,
                        backgroundColor: DesignSystem.Colors.error,
                        textColor: Color(.white),
                        strokeColor: DesignSystem.Colors.error.opacity(0.2),
                        disabled: false
                    )

                    // CLR Button
                    DartSpecialButton(
                        action: { viewModel.clearCurrentRound() },
                        title: "CLR",
                        subtitle: nil,
                        systemImage: nil,
                        backgroundColor: DesignSystem.Colors.warning,
                        textColor: DesignSystem.Colors.primary,
                        strokeColor: DesignSystem.Colors.warning,
                        disabled: viewModel.currentThrowInTurn == 0
                    )
                }
            }
            .padding(DesignSystem.Spacing.xxl)
            .background(
                RoundedRectangle(cornerRadius: DesignSystem.CornerRadius.large)
                    .fill(DesignSystem.Colors.systemBackground)
                    .overlay(
                        RoundedRectangle(cornerRadius: DesignSystem.CornerRadius.large)
                            .stroke(DesignSystem.Colors.systemGray4, lineWidth: DesignSystem.BorderWidth.regular)
                    )
                    .shadow(color: .black.opacity(0.08), radius: 12, x: 0, y: 4)

            )
            .frame(maxHeight: geometry.size.height)
        }
    }
}

#Preview {
    let player1 = Player(name: "Test")
    let player2 = Player(name: "Test2")
    var gameSettings = GameSettings()
    gameSettings.player1 = player1
    gameSettings.player2 = player2
    let viewModel = GameViewModel(gameSettings: gameSettings)

    return DartKeyboardView(viewModel: viewModel)
        .frame(width: 1000, height: 800, alignment: .center)
        .padding(DesignSystem.Spacing.keyboardPadding)
        .standardBackground()
}
