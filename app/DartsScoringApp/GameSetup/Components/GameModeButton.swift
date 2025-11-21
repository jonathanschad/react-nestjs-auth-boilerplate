import SwiftUI

struct GameModeButton: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            VStack(spacing: DesignSystem.Spacing.sm) {
                Text(title)
                    .font(.title2)
                    .fontWeight(.bold)
                Text("Out")
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
        GameModeButton(
            title: "Single",
            isSelected: true,
            action: {}
        )
        
        GameModeButton(
            title: "Double",
            isSelected: false,
            action: {}
        )
    }
    .padding()
    .background(DesignSystem.Colors.groupedBackground)
} 