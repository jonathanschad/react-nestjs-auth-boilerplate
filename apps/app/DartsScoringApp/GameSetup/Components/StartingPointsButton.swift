import SwiftUI

struct StartingPointsButton: View {
    let points: StartingPoints
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: DesignSystem.Spacing.sm) {
                Text("\(points.rawValue)")
                    .font(.title2)
                    .fontWeight(.bold)
                Text("Punkte")
                    .font(.caption)
                    .foregroundColor(DesignSystem.Colors.secondary)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, DesignSystem.Spacing.lg)
            .background(
                RoundedRectangle(cornerRadius: DesignSystem.CornerRadius.large)
                    .fill(isSelected ? DesignSystem.Colors.accentLight : DesignSystem.Colors.systemBackground)
                    .overlay(
                        RoundedRectangle(cornerRadius: DesignSystem.CornerRadius.large)
                            .stroke(isSelected ? DesignSystem.Colors.accent : DesignSystem.Colors.systemGray4, lineWidth: DesignSystem.BorderWidth.medium)
                    )
                    .shadow(color: .black.opacity(0.08), radius: 8, x: 0, y: 2)
            )
            .foregroundColor(isSelected ? DesignSystem.Colors.accent : DesignSystem.Colors.primary)
        }
        .buttonStyle(.plain)
    }
}

#Preview {
    HStack {
        StartingPointsButton(
            points: ._301,
            isSelected: true,
            action: {}
        )
        
        StartingPointsButton(
            points: ._501,
            isSelected: false,
            action: {}
        )
    }
    .padding()
    .background(DesignSystem.Colors.groupedBackground)
} 