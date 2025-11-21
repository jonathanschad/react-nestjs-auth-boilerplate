import SwiftUI

struct PlayerSelectionBox: View {
    let player: Player?
    let placeholder: String
    let color: Color
    let action: () -> Void
    
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
            action: {}
        )
        
        PlayerSelectionBox(
            player: nil,
            placeholder: "Spieler 2",
            color: DesignSystem.Colors.error,
            action: {}
        )
    }
    .padding()
    .background(DesignSystem.Colors.groupedBackground)
} 
