import SwiftUI

struct GameSetupView: View {
    @StateObject private var viewModel: GameSetupViewModel
    @State private var showingPlayerSelection = false
    @State private var selectingPlayerSlot: PlayerSlot = .player1

    init(navigationCoordinator: NavigationCoordinator) {
        self._viewModel = StateObject(wrappedValue: GameSetupViewModel(navigationCoordinator: navigationCoordinator))
    }

    enum PlayerSlot {
        case player1, player2
    }

    var body: some View {
        NavigationStack {
            ZStack {
                VStack(spacing: DesignSystem.Spacing.xxl) {
                    // MARK: - Spielerauswahl
                    VStack(alignment: .leading, spacing: DesignSystem.Spacing.lg) {
                        Text("Spieler")
                            .font(.title2)
                            .fontWeight(.bold)
                            .foregroundColor(DesignSystem.Colors.primary)

                        HStack(spacing: DesignSystem.Spacing.lg) {
                            // Player 1 Selection
                            PlayerSelectionBox(
                                player: viewModel.gameSettings.player1,
                                placeholder: "Spieler 1 wählen",
                                color: DesignSystem.Colors.accent
                            ) {
                                selectingPlayerSlot = .player1
                                showingPlayerSelection = true
                            }

                            // VS Separator
                            VStack {
                                Text("VS")
                                    .font(.title3)
                                    .fontWeight(.bold)
                                    .foregroundColor(DesignSystem.Colors.secondary)
                            }
                            .frame(width: DesignSystem.Sizes.smallIcon)

                            // Player 2 Selection
                            PlayerSelectionBox(
                                player: viewModel.gameSettings.player2,
                                placeholder: "Spieler 2 wählen",
                                color: DesignSystem.Colors.error
                            ) {
                                selectingPlayerSlot = .player2
                                showingPlayerSelection = true
                            }
                        }
                    }

                    // MARK: - Game Preview
                    if let preview = viewModel.gamePreview {
                        GamePreviewCard(preview: preview)
                    }

                    // MARK: - Game Mode
                    VStack(alignment: .leading, spacing: DesignSystem.Spacing.lg) {
                        Text("Spielmodus")
                            .font(.title2)
                            .fontWeight(.bold)
                            .foregroundColor(DesignSystem.Colors.primary)

                        HStack(spacing: DesignSystem.Spacing.md) {
                            GameModeButton(
                                title: "Double Out",
                                isSelected: viewModel.gameSettings.gameMode == .doubleOut
                            ) {
                                viewModel.setGameMode(.doubleOut)
                            }

                            GameModeButton(
                                title: "Single Out",
                                isSelected: viewModel.gameSettings.gameMode == .singleOut
                            ) {
                                viewModel.setGameMode(.singleOut)
                            }
                        }
                    }

                    // MARK: - Starting points
                    VStack(alignment: .leading, spacing: DesignSystem.Spacing.lg) {
                        Text("Startpunkte")
                            .font(.title2)
                            .fontWeight(.bold)
                            .foregroundColor(DesignSystem.Colors.primary)

                        HStack(spacing: DesignSystem.Spacing.md) {
                            StartingPointsButton(
                                points: ._301,
                                isSelected: viewModel.gameSettings.startingPoints == ._301
                            ) {
                                viewModel.setStartingPoints(._301)
                            }

                            StartingPointsButton(
                                points: ._501,
                                isSelected: viewModel.gameSettings.startingPoints == ._501
                            ) {
                                viewModel.setStartingPoints(._501)
                            }
                        }
                    }

                    // MARK: - Start Game
                    StartGameButton(
                        canStartGame: viewModel.gameSettings.canStartGame,
                        onStart: viewModel.startGame
                    )

                    Spacer(minLength: DesignSystem.Spacing.xxxl)
                }
            }
            .padding(.horizontal, DesignSystem.Spacing.xl)
            .padding(.vertical, DesignSystem.Spacing.xxl)
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    NavigationLink {
                        StatsView()
                    } label: {
                        HStack(alignment: .center) {
                            Text("Leaderboard")
                            Image(systemName: "list.bullet.clipboard")
                        }
                        .padding(.trailing, DesignSystem.Spacing.md)
                    }
                }

            }
            .fullScreenCover(isPresented: $viewModel.showIntroView) {
                BoxingIntroView(player1: viewModel.gameSettings.player1?.firstName ?? "", player2: viewModel.gameSettings.player2?.firstName ?? "")
            }
            .sheet(isPresented: $showingPlayerSelection) {
                PlayerSelectionSheet(
                    viewModel: viewModel,
                    excludedPlayer: selectingPlayerSlot == .player1 ? viewModel.gameSettings.player2 : viewModel.gameSettings.player1,
                    onPlayerSelected: { player in
                        if selectingPlayerSlot == .player1 {
                            viewModel.selectPlayer1(player)
                        } else {
                            viewModel.selectPlayer2(player)
                        }
                        showingPlayerSelection = false
                    }
                )
            }
            .background(DesignSystem.Colors.groupedBackground)
        }
    }
}

#Preview {
    GameSetupView(navigationCoordinator: NavigationCoordinator())
}
