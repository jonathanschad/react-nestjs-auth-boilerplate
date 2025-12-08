import SwiftUI

struct PlayerEloSideDisplay: View {
    let eloPreview: EloPreview?
    let alignment: HorizontalAlignment

    private var winChange: Double? {
        guard let elo = eloPreview else { return nil }
        return elo.onWin - elo.current
    }

    private var lossChange: Double? {
        guard let elo = eloPreview else { return nil }
        return elo.onLoss - elo.current
    }

    var body: some View {
        VStack(alignment: alignment, spacing: DesignSystem.Spacing.md) {
            if let elo = eloPreview {
                // Current ELO
                VStack(alignment: alignment, spacing: 2) {
                    Text(String(format: "%.1f", elo.current))
                        .font(.title2)
                        .fontWeight(.bold)
                        .foregroundColor(DesignSystem.Colors.primary)
                    Text("ELO")
                        .font(.caption2)
                        .foregroundColor(DesignSystem.Colors.secondary)
                }
                .padding(.bottom, DesignSystem.Spacing.xs)

                Divider()

                // Win scenario
                VStack(alignment: alignment, spacing: 2) {
                    HStack(spacing: 3) {
                        if alignment == .trailing {
                            Text("Sieg")
                                .font(.caption)
                                .foregroundColor(DesignSystem.Colors.secondary)
                            Image(systemName: "arrow.up.circle.fill")
                                .font(.caption)
                                .foregroundColor(.green)
                        } else {
                            Image(systemName: "arrow.up.circle.fill")
                                .font(.caption)
                                .foregroundColor(.green)
                            Text("Sieg")
                                .font(.caption)
                                .foregroundColor(DesignSystem.Colors.secondary)
                        }
                    }
                    if let change = winChange {
                        Text(String(format: "%@%.1f", change >= 0 ? "+" : "", change))
                            .font(.title3)
                            .fontWeight(.semibold)
                            .foregroundColor(.green)
                    }
                }

                // Loss scenario
                VStack(alignment: alignment, spacing: 2) {
                    HStack(spacing: 3) {
                        if alignment == .trailing {
                            Text("Niederlage")
                                .font(.caption)
                                .foregroundColor(DesignSystem.Colors.secondary)
                            Image(systemName: "arrow.down.circle.fill")
                                .font(.caption)
                                .foregroundColor(.red)
                        } else {
                            Image(systemName: "arrow.down.circle.fill")
                                .font(.caption)
                                .foregroundColor(.red)
                            Text("Niederlage")
                                .font(.caption)
                                .foregroundColor(DesignSystem.Colors.secondary)
                        }
                    }
                    if let change = lossChange {
                        Text(String(format: "%@%.1f", change >= 0 ? "+" : "", change))
                            .font(.title3)
                            .fontWeight(.semibold)
                            .foregroundColor(.red)
                    }
                }
            } else {
                // Placeholder to maintain layout
                Color.clear
                    .frame(width: 60, height: 1)
            }
        }
        .frame(width: 80)
        .opacity(eloPreview != nil ? 1.0 : 0.0)
        .animation(.easeInOut(duration: 0.3), value: eloPreview != nil)
    }
}

#Preview {
    HStack {
        PlayerEloSideDisplay(
            eloPreview: EloPreview(onWin: 1025, onLoss: 975, current: 1000),
            alignment: .leading
        )

        Spacer()

        PlayerEloSideDisplay(
            eloPreview: EloPreview(onWin: 1220, onLoss: 1180, current: 1200),
            alignment: .trailing
        )
    }
    .padding()
    .background(DesignSystem.Colors.groupedBackground)
}
