import SwiftUI

struct GamePreviewCard: View {
    let preview: GamePreviewResponse

    var body: some View {
        VStack(alignment: .leading, spacing: DesignSystem.Spacing.lg) {
            Text("Mögliche ELO-Änderungen")
                .font(.title2)
                .fontWeight(.bold)
                .foregroundColor(DesignSystem.Colors.primary)

            HStack(spacing: DesignSystem.Spacing.lg) {
                // Player A Preview
                PlayerEloPreview(
                    playerName: preview.playerA.name,
                    currentElo: preview.playerA.elo.current,
                    eloOnWin: preview.playerA.elo.onWin,
                    eloOnLoss: preview.playerA.elo.onLoss,
                    color: DesignSystem.Colors.accent
                )

                Divider()
                    .frame(height: 80)

                // Player B Preview
                PlayerEloPreview(
                    playerName: preview.playerB.name,
                    currentElo: preview.playerB.elo.current,
                    eloOnWin: preview.playerB.elo.onWin,
                    eloOnLoss: preview.playerB.elo.onLoss,
                    color: DesignSystem.Colors.error
                )
            }
            .padding(DesignSystem.Spacing.lg)
            .background(
                RoundedRectangle(cornerRadius: DesignSystem.CornerRadius.large)
                    .fill(DesignSystem.Colors.systemBackground)
                    .shadow(color: .black.opacity(0.06), radius: 8, x: 0, y: 2)
            )
        }
    }
}

struct PlayerEloPreview: View {
    let playerName: String
    let currentElo: Double
    let eloOnWin: Double
    let eloOnLoss: Double
    let color: Color

    private var winChange: Double {
        return eloOnWin - currentElo
    }

    private var lossChange: Double {
        return eloOnLoss - currentElo
    }

    var body: some View {
        VStack(spacing: DesignSystem.Spacing.md) {
            // Player name (abbreviated)
            Text(playerName.components(separatedBy: " ").first ?? playerName)
                .font(.headline)
                .fontWeight(.semibold)
                .foregroundColor(color)

            // Current ELO
            VStack(spacing: DesignSystem.Spacing.xxs) {
                Text("Aktuell")
                    .font(.caption)
                    .foregroundColor(DesignSystem.Colors.secondary)
                Text(String(format: "%.1f", currentElo))
                    .font(.title3)
                    .fontWeight(.bold)
                    .foregroundColor(DesignSystem.Colors.primary)
            }

            Divider()

            // Win scenario
            VStack(spacing: DesignSystem.Spacing.xxs) {
                HStack(spacing: DesignSystem.Spacing.xs) {
                    Image(systemName: "arrow.up.circle.fill")
                        .foregroundColor(.green)
                        .font(.caption)
                    Text("Sieg")
                        .font(.caption)
                        .foregroundColor(DesignSystem.Colors.secondary)
                }
                Text(String(format: "%.1f", eloOnWin))
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .foregroundColor(.green)
                Text(String(format: "%@%.1f", winChange >= 0 ? "+" : "", winChange))
                    .font(.caption2)
                    .foregroundColor(.green.opacity(0.8))
            }

            // Loss scenario
            VStack(spacing: DesignSystem.Spacing.xxs) {
                HStack(spacing: DesignSystem.Spacing.xs) {
                    Image(systemName: "arrow.down.circle.fill")
                        .foregroundColor(.red)
                        .font(.caption)
                    Text("Niederlage")
                        .font(.caption)
                        .foregroundColor(DesignSystem.Colors.secondary)
                }
                Text(String(format: "%.1f", eloOnLoss))
                    .font(.subheadline)
                    .fontWeight(.semibold)
                    .foregroundColor(.red)
                Text(String(format: "%@%.1f", lossChange >= 0 ? "+" : "", lossChange))
                    .font(.caption2)
                    .foregroundColor(.red.opacity(0.8))
            }
        }
        .frame(maxWidth: .infinity)
    }
}

#Preview {
    let preview = GamePreviewResponse(
        playerA: PlayerPreview(
            id: "1",
            name: "Max Mustermann",
            elo: EloPreview(onWin: 1025, onLoss: 975, current: 1000),
            profilePictureId: nil
        ),
        playerB: PlayerPreview(
            id: "2",
            name: "Anna Schmidt",
            elo: EloPreview(onWin: 1220, onLoss: 1180, current: 1200),
            profilePictureId: nil
        )
    )

    return VStack {
        GamePreviewCard(preview: preview)
    }
    .padding()
    .background(DesignSystem.Colors.groupedBackground)
}
