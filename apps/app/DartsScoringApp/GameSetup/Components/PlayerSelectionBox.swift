import SwiftUI

struct PlayerSelectionBox: View {
    let player: Player?
    let placeholder: String
    let color: Color
    let eloPreview: EloPreview?
    let action: () -> Void

    private var winChange: Double? {
        guard let elo = eloPreview else { return nil }
        return elo.onWin - elo.current
    }

    private var lossChange: Double? {
        guard let elo = eloPreview else { return nil }
        return elo.onLoss - elo.current
    }

    var body: some View {
        Button(action: action) {
            VStack(spacing: DesignSystem.Spacing.lg) {
                // Spieler Bild
                ZStack {
                    Circle()
                        .fill(color.opacity(0.12))
                        .frame(width: DesignSystem.Sizes.largeIcon, height: DesignSystem.Sizes.largeIcon)
                        .overlay(
                            Circle()
                                .stroke(color.opacity(0.4), lineWidth: DesignSystem.BorderWidth.medium)
                        )

                    if let player = player {
                        Image(systemName: "person.fill")
                            .font(.largeTitle)
                            .foregroundColor(color)
                    } else {
                        Image(systemName: "plus")
                            .font(.title)
                            .foregroundColor(color.opacity(0.6))
                    }
                }

                // Spieler Info
                VStack(spacing: DesignSystem.Spacing.xs) {
                    Text(player != nil ? "Ausgewählt" : "Wählen")
                        .font(.subheadline)
                        .foregroundColor(DesignSystem.Colors.secondary)
                        .fontWeight(.medium)

                    Text(player?.name ?? placeholder)
                        .font(.headline)
                        .fontWeight(.semibold)
                        .foregroundColor(player == nil ? color : DesignSystem.Colors.primary)
                        .multilineTextAlignment(.center)
                        .lineLimit(2)
                        .minimumScaleFactor(0.8)
                }

                // ELO Preview Section (Fixed Height - Always Visible)
                VStack(spacing: DesignSystem.Spacing.sm) {
                    // Current ELO (shows immediately when player selected)
                    VStack(spacing: 2) {
                        if let selectedPlayer = player {
                            Text("ELO: \(String(format: "%.1f", selectedPlayer.eloRating))")
                                .font(.subheadline)
                                .fontWeight(.semibold)
                                .foregroundColor(DesignSystem.Colors.primary)
                        } else {
                            Text("ELO: -")
                                .font(.subheadline)
                                .fontWeight(.semibold)
                                .foregroundColor(DesignSystem.Colors.secondary.opacity(0.5))
                        }
                    }

                    // Win/Loss predictions (always show structure)
                    HStack(spacing: DesignSystem.Spacing.md) {
                        // Win
                        HStack(spacing: 3) {
                            Image(systemName: "arrow.up")
                                .font(.caption2)
                                .foregroundColor(.green)
                            Text(winChange != nil ? String(format: "%@%.1f", winChange! >= 0 ? "+" : "", winChange!) : "-")
                                .font(.caption)
                                .fontWeight(.semibold)
                                .foregroundColor(winChange != nil ? .green : DesignSystem.Colors.secondary.opacity(0.5))
                        }

                        Divider()
                            .frame(height: 12)

                        // Loss
                        HStack(spacing: 3) {
                            Image(systemName: "arrow.down")
                                .font(.caption2)
                                .foregroundColor(.red)
                            Text(lossChange != nil ? String(format: "%@%.1f", lossChange! >= 0 ? "+" : "", lossChange!) : "-")
                                .font(.caption)
                                .fontWeight(.semibold)
                                .foregroundColor(lossChange != nil ? .red : DesignSystem.Colors.secondary.opacity(0.5))
                        }
                    }
                }
                .frame(height: 44)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, DesignSystem.Spacing.xxl)
            .padding(.horizontal, DesignSystem.Spacing.lg)
            .background(
                RoundedRectangle(cornerRadius: DesignSystem.CornerRadius.large)
                    .fill(DesignSystem.Colors.systemBackground)
                    .overlay(
                        RoundedRectangle(cornerRadius: DesignSystem.CornerRadius.large)
                            .stroke(player != nil ? color.opacity(0.3) : DesignSystem.Colors.systemGray4, lineWidth: DesignSystem.BorderWidth.medium)
                    )
                    .shadow(color: .black.opacity(0.08), radius: 12, x: 0, y: 4)
            )
        }
        .buttonStyle(.plain)
        .scaleEffect(player != nil ? 1.02 : 1.0)
        .animation(.easeInOut(duration: 0.2), value: player != nil)
    }
}

#Preview {
    HStack {
        PlayerSelectionBox(
            player: Player(name: "Max"),
            placeholder: "Spieler 1",
            color: DesignSystem.Colors.accent,
            eloPreview: EloPreview(onWin: 1025, onLoss: 975, current: 1000),
            action: {}
        )

        PlayerSelectionBox(
            player: Player(name: "Anna"),
            placeholder: "Spieler 2",
            color: DesignSystem.Colors.error,
            eloPreview: EloPreview(onWin: 1220, onLoss: 1180, current: 1200),
            action: {}
        )
    }
    .padding()
    .background(DesignSystem.Colors.groupedBackground)
} 
